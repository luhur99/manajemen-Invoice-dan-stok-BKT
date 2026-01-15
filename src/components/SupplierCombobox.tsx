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
import { Supplier } from "@/types/data";

interface SupplierComboboxProps {
  suppliers: Supplier[];
  value?: string; // The selected supplier_id
  onValueChange: (supplier: Supplier | undefined) => void;
  inputValue: string; // The current text in the input field
  onInputValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

const SupplierCombobox: React.FC<SupplierComboboxProps> = ({
  suppliers,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  placeholder = "Pilih pemasok...",
  disabled = false,
  id,
  name,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedSupplier = suppliers.find((supplier) => supplier.id === value);

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
          {inputValue || (selectedSupplier ? selectedSupplier.name : placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari pemasok..."
            value={inputValue}
            onValueChange={onInputValueChange}
          />
          <CommandList>
            <CommandEmpty>Tidak ada pemasok ditemukan.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={supplier.name} // Use supplier name for CommandItem value
                  onSelect={(currentCommandItemValue) => {
                    const selected = suppliers.find(s => s.name === currentCommandItemValue);
                    onValueChange(selected);
                    onInputValueChange(selected ? selected.name : "");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSupplier?.id === supplier.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {supplier.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SupplierCombobox;