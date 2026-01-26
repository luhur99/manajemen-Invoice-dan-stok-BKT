"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Product, WarehouseInventory, WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Import the interface
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface StockItemComboboxProps {
  products: Product[];
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string | undefined) => void;
  inputValue: string; // Added for external control of input value
  onInputValueChange: (value: string) => void; // Added for external control of input value
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean; // Added loading prop
  showInventory?: boolean; // New prop to control inventory display
}

const StockItemCombobox: React.FC<StockItemComboboxProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  inputValue,
  onInputValueChange,
  placeholder = "Pilih produk...",
  disabled = false,
  loading = false,
  showInventory = true, // Default to true for backward compatibility
}) => {
  const [open, setOpen] = React.useState(false);

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select(`id, name, code`) // Select all columns to match WarehouseCategoryType
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data as WarehouseCategoryType[];
    },
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const formatStockInventories = (inventories?: WarehouseInventory[]) => {
    if (!showInventory) return ""; // If showInventory is false, return empty string
    if (loadingCategories) return "Memuat stok...";
    if (categoriesError) return "Error memuat kategori";

    if (!inventories || inventories.length === 0) {
      return "Stok: 0";
    }
    const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
    const details = inventories
      .filter(inv => inv.quantity > 0)
      .map(inv => `${getCategoryDisplayName(inv.warehouse_category)}: ${inv.quantity}`)
      .join(', ');
    return `Total: ${totalStock} (${details || 'Tidak ada stok per kategori'})`;
  };

  const selectedItem = products.find((item) => item.id === selectedProductId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loadingCategories || loading}
        >
          {loadingCategories || loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : selectedItem
            ? `${selectedItem.nama_barang} (${selectedItem.kode_barang}) ${showInventory ? `- ${formatStockInventories(selectedItem.inventories)}` : ''}`
            : inputValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari produk..."
            value={inputValue}
            onValueChange={onInputValueChange}
          />
          <CommandList>
            <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {products.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.nama_barang} ${item.kode_barang}`}
                  onSelect={() => {
                    onSelectProduct(item.id === selectedProductId ? undefined : item.id);
                    setOpen(false);
                    onInputValueChange(""); // Clear input after selection
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProductId === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.nama_barang} ({item.kode_barang}) {showInventory ? `- ${formatStockInventories(item.inventories)}` : ''}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StockItemCombobox;