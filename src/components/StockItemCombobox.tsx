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
import { StockItem } from "@/types/data";

interface StockItemComboboxProps {
  items: StockItem[];
  value?: string; // The selected item_name
  onValueChange: (item: StockItem | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string; // Added for accessibility
  name?: string; // Added for accessibility
}

const StockItemCombobox: React.FC<StockItemComboboxProps> = ({
  items,
  value,
  onValueChange,
  placeholder = "Pilih item...",
  disabled = false,
  id, // Destructure id
  name, // Destructure name
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedItem = items.find((item) => item["NAMA BARANG"] === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          id={id} // Pass id to the button
          name={name} // Pass name to the button
        >
          <span>
            {selectedItem ? `${selectedItem["NAMA BARANG"]} (${selectedItem["KODE BARANG"]})` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Cari item..." />
          <CommandList>
            <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item["NAMA BARANG"]}
                  onSelect={(currentValue) => {
                    onValueChange(
                      currentValue === selectedItem?.["NAMA BARANG"] ? undefined : item
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItem?.["NAMA BARANG"] === item["NAMA BARANG"] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item["NAMA BARANG"]} ({item["KODE BARANG"]})
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