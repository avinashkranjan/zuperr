/* eslint-disable no-nested-ternary */
"use client";

import * as React from "react";
import { format, subDays, differenceInCalendarDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

const predefinedRanges = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
];

export function DateRangePicker({
  className,
  value,
  onChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: DateRange;
  onChange?: (dateRange?: DateRange) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [isCustom, setIsCustom] = React.useState(false);

  const handlePresetClick = (days: number) => {
    const to = new Date();
    const from = subDays(to, days - 1);
    setIsCustom(false);
    onChange?.({ from, to });
    setOpen(false);
  };

  const handleCustomSelect = (range?: DateRange) => {
    if (range?.from && range?.to) {
      const daysDiff = differenceInCalendarDays(range.to, range.from);
      if (daysDiff > 89) return; // limit to 90 days including both ends
    }
    onChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 space-y-2" align="start">
          <div className="flex gap-2 flex-wrap">
            {predefinedRanges.map((range) => (
              <Button
                key={range.label}
                variant="secondary"
                size="sm"
                onClick={() => handlePresetClick(range.days)}
              >
                {range.label}
              </Button>
            ))}
            <Button
              variant={isCustom ? "default" : "secondary"}
              size="sm"
              onClick={() => setIsCustom(true)}
            >
              Custom
            </Button>
          </div>

          {isCustom && (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={handleCustomSelect}
              numberOfMonths={2}
              disabled={(date) => {
                if (value?.from) {
                  const maxToDate = new Date(value.from);
                  maxToDate.setDate(maxToDate.getDate() + 89);
                  return date > maxToDate;
                }
                return false;
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
