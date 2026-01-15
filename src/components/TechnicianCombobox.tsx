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
import { Technician } from "@/types/data";
import { Loader2 } from "lucide-react";

interface TechnicianComboboxProps {
  technicians: Technician[];
  value?: string; // The selected technician_id
  onValueChange: (technician: Technician | undefined) => void;
  inputValue: string; // The current text in the input field
  onInputValueChange: (value: string) => void; // This is for the CommandInput's text
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  loading?: boolean;
}

const TechnicianCombobox: React.FC<TechnicianComboboxProps> = ({
  technicians,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  placeholder = "Pilih teknisi...",
  disabled = false,
  id,
  name,
  loading = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedTechnician = technicians.find((technician) => technician.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
          id={id}
          name={name}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : selectedTechnician
            ? selectedTechnician.name
            : inputValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari teknisi..."
            value={inputValue}
            onValueChange={onInputValueChange}
          />
          <CommandList>
            <CommandEmpty>Tidak ada teknisi ditemukan.</CommandEmpty>
            <CommandGroup>
              {technicians.map((technician) => (
                <CommandItem
                  key={technician.id}
                  value={technician.name}
                  onSelect={() => {
                    onValueChange(technician);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === technician.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {technician.name} ({technician.type.charAt(0).toUpperCase() + technician.type.slice(1)})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TechnicianCombobox;