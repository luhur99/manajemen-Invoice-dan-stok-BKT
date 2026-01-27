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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product, WarehouseInventory } from "@/types/data";

interface StockItemComboboxProps {
  products: Product[];
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string | undefined) => void;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  showInventory?: boolean;
}

const formatStockInventories = (inventories: WarehouseInventory[] | undefined) => {
  if (!inventories || inventories.length === 0) {
    return "Stok: 0";
  }
  const total = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  const details = inventories.map(inv => `${inv.warehouse_category}: ${inv.quantity}`).join(', ');
  return `Total: ${total} (${details})`;
};

const StockItemCombobox: React.FC<StockItemComboboxProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  inputValue,
  onInputValueChange,
  disabled,
  loading,
  showInventory = true,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedItem = products.find((item) => item.id === selectedProductId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {loading ? "Memuat..." : selectedItem
            ? `${selectedItem.nama_barang} (${selectedItem.kode_barang}) ${showInventory ? `- ${formatStockInventories(selectedItem.inventories)}` : ''}`
            : inputValue || "Pilih produk..."}
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
            <CommandEmpty>Tidak ada produk ditemukan.</CommandEmpty>
            <CommandGroup>
              {products.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.nama_barang} ${item.kode_barang}`}
                  onSelect={() => {
                    onSelectProduct(item.id === selectedProductId ? undefined : item.id);
                    setOpen(false);
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