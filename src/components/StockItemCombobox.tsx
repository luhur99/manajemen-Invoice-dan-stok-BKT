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
  CommandList,
  CommandItem, // Ditambahkan: Mengimpor CommandItem
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/types/data"; // Changed from StockItem

interface StockItemComboboxProps {
  items: Product[]; // Changed from StockItem[]
  value?: string; // The selected item_name
  onValueChange: (item: Product | undefined) => void; // Changed from StockItem
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

  const selectedItem = items.find((item) => item.nama_barang === value); // Corrected access

  // Removed getCategoryDisplay as warehouse_category is no longer on Product

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
          {/* Wrap children in a single span to ensure PopoverTrigger asChild receives one child */}
          <span>
            {selectedItem
              ? `${selectedItem.nama_barang} (${selectedItem.kode_barang})` // Corrected access
              : placeholder}
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
                  value={item.nama_barang} // Corrected access
                  onSelect={(currentValue) => {
                    onValueChange(
                      currentValue === selectedItem?.nama_barang ? undefined : item // Corrected access
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItem?.nama_barang === item.nama_barang ? "opacity-100" : "opacity-0" // Corrected access
                    )}
                  />
                  {item.nama_barang} ({item.kode_barang}) {/* Corrected access */}
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