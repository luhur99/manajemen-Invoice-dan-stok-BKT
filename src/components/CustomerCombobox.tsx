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
import { Customer } from "@/types/data";
import { Loader2 } from "lucide-react";

interface CustomerComboboxProps {
  customers: Customer[];
  value?: string; // The selected customer_id
  onValueChange: (customer: Customer | undefined) => void;
  inputValue: string; // The current text in the input field
  onInputValueChange: (value: string) => void; // This is for the CommandInput's text
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  loading?: boolean;
}

const CustomerCombobox: React.FC<CustomerComboboxProps> = ({
  customers,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  placeholder = "Pilih pelanggan...",
  disabled = false,
  id,
  name,
  loading = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedCustomer = customers.find((customer) => customer.id === value);

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
          ) : selectedCustomer
            ? selectedCustomer.customer_name
            : inputValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari pelanggan..."
            value={inputValue}
            onValueChange={onInputValueChange}
          />
          <CommandList>
            <CommandEmpty>Tidak ada pelanggan ditemukan.</CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.customer_name}
                  onSelect={() => {
                    onValueChange(customer);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {customer.customer_name} {customer.company_name ? `(${customer.company_name})` : ''}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerCombobox;