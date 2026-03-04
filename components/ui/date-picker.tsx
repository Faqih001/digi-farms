"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  /** Controlled value as a YYYY-MM-DD string (or empty string). */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra classes forwarded to the trigger button (e.g. "h-9 text-sm"). */
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const d = parse(value, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    onChange(date ? format(date, "yyyy-MM-dd") : "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            // Match the project Input component's visual style
            "flex h-10 w-full items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-left",
            "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50",
            "transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-500",
            !selected && "text-slate-400 dark:text-slate-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
          {selected ? format(selected, "dd MMM yyyy") : <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
        align="start"
        side="bottom"
        sideOffset={6}
        avoidCollisions={false}
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
          className="rounded-2xl"
        />
      </PopoverContent>
    </Popover>
  );
}
