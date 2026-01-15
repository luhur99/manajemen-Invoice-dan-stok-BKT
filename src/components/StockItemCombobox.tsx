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
import { StockItem, WarehouseInventory } from "@/types/data"; // Import WarehouseInventory

interface StockItemComboboxProps {
  items: StockItem[];
  value?: string; // The selected item_name (for display in trigger)
  onValueChange: (item: StockItem | undefined) => void; // For selecting an actual StockItem object
  inputValue: string; // The current text in the input field
  onInputValueChange: (value: string) => void; // Callback for raw input text changes
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

const StockItemCombobox: React.FC<StockItemComboboxProps> = ({
  items,
  value, // This is the `item_name` from the form, used to mark selected item
  onValueChange,
  inputValue, // This is the actual text in the CommandInput
  onInputValueChange,
  placeholder = "Pilih item...",
  disabled = false,
  id,
  name,
}) => {
  const [open, setOpen] = React.useState(false);

  // Find the selected item based on the `value` prop (item_name from form)
  const selectedItem = items.find((item) => item["NAMA BARANG"] === value);

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
          {/* Display the current input value, or the selected item's name if available */}
          {inputValue || (selectedItem ? `${selectedItem["NAMA BARANG"]} (${selectedItem["KODE BARANG"]}) - ${formatStockInventories(selectedItem.inventories)}` : placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari item..."
            value={inputValue} // Controlled by inputValue prop
            onValueChange={onInputValueChange} // Updates inputValue in parent form
          />
          <CommandList>
            <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item["NAMA BARANG"]} // Use item name for CommandItem value
                  onSelect={(currentCommandItemValue) => {
                    // When an item is selected from the list
                    const selected = items.find(i => i["NAMA BARANG"] === currentCommandItemValue);
                    onValueChange(selected); // Pass the full StockItem object
                    onInputValueChange(selected ? selected["NAMA BARANG"] : ""); // Update input text to selected item's name
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItem?.["NAMA BARANG"] === item["NAMA BARANG"] ? "opacity-100" : "opacity-0"
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