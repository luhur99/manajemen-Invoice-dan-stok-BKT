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
import { StockItem, WarehouseInventory } from "@/types/data";

interface StockItemComboboxProps {
  items: StockItem[];
  selectedItemId?: string; // The ID of the currently selected item
  onSelectItemId: (id: string | undefined) => void; // Callback when an item is selected by ID
  inputValue: string; // The text currently in the search input
  onInputValueChange: (value: string) => void; // Callback for when the search input text changes
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

const StockItemCombobox: React.FC<StockItemComboboxProps> = ({
  items,
  selectedItemId,
  onSelectItemId,
  inputValue,
  onInputValueChange,
  placeholder = "Pilih item...",
  disabled = false,
  id,
  name,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur') => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return "";
    }
  };

  const formatStockInventories = (inventories?: WarehouseInventory[]) => {
    if (!inventories || inventories.length === 0) return "Stok: 0";
    return inventories.map(inv => `${getCategoryDisplay(inv.warehouse_category)}: ${inv.quantity}`).join(', ');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          id={id}
          name={name}
        >
          {selectedItem
            ? `${selectedItem["NAMA BARANG"]} (${selectedItem["KODE BARANG"]}) - ${formatStockInventories(selectedItem.inventories)}`
            : inputValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari item..."
            value={inputValue}
            onValueChange={onInputValueChange}
          />
          <CommandList>
            <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item["NAMA BARANG"]} // Use item name for search/display in list
                  onSelect={() => {
                    onSelectItemId(item.id); // Pass the ID of the selected item
                    onInputValueChange(item["NAMA BARANG"]); // Update input text to selected item's name
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItemId === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item["NAMA BARANG"]} ({item["KODE BARANG"]}) - {formatStockInventories(item.inventories)}
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