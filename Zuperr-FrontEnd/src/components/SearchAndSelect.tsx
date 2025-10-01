"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command";
import { Button } from "@components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@lib/utils";

export interface SearchableSelectProps<T> {
  items: T[];
  placeholder?: string;
  displayField: keyof T;
  valueField: keyof T;
  selectedValue: string;
  onChange: (value: string) => void;
  includeAllOption?: boolean;
}

export function SearchableSelect<T>({
  items,
  placeholder = "Select an option",
  displayField,
  valueField,
  selectedValue,
  onChange,
  includeAllOption = false,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = React.useState(false);

  const getDisplay = (val: string) => {
    if (val === "all") return "All";
    const item = items.find((item) => item[valueField] === val);
    return item ? String(item[displayField]) : placeholder;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-64 justify-between text-muted-foreground border-muted-foreground"
        >
          {getDisplay(selectedValue)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-64 p-0">
        <Command>
          <CommandInput placeholder={"Search..."} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {includeAllOption && (
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All
              </CommandItem>
            )}
            {items.map((item, index) => {
              const value = String(item[valueField]);
              const label = String(item[displayField]);
              return (
                <CommandItem
                  key={value + index}
                  value={label}
                  onSelect={() => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
