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
import { Product, WarehouseCategory, WarehouseInventory } from "@/types/data";

interface StockItemComboboxProps {
  products: Product[];
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

const getCategoryDisplay = (category: WarehouseCategory) => {
  switch (category) {
    case WarehouseCategory.SIAP_JUAL: return "Siap Jual";
    case WarehouseCategory.RISET: return "Riset";
    case WarehouseCategory.RETUR: return "Retur";
    case WarehouseCategory.BACKUP_TEKNISI: return "Backup Teknisi";
    default: return category;
  }
};

const formatStockInventories = (inventories?: WarehouseInventory[]) => {
  if (!inventories || inventories.length === 0) {
    return "Stok: 0";
  }
  const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  const details = inventories
    .filter(inv => inv.quantity > 0)
    .map(inv => `${getCategoryDisplay(inv.warehouse_category)}: ${inv.quantity}`)
    .join(', ');
  return `Total: ${totalStock} (${details || 'Tidak ada stok per kategori'})`;
};

const StockItemCombobox: React.FC<StockItemComboboxProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  placeholder = "Pilih produk...",
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selectedItem = products.find((item) => item.id === selectedProductId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedItem
            ? `${selectedItem.nama_barang} (${selectedItem.kode_barang}) - ${formatStockInventories(selectedItem.inventories)}`
            : inputValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari produk..."
            value={inputValue}
            onValueChange={setInputValue}
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
                    setInputValue(""); // Clear input after selection
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProductId === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.nama_barang} ({item.kode_barang}) - {formatStockInventories(item.inventories)}
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