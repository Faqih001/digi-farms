"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-slate-900 dark:text-slate-50",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-1 h-7 w-7 p-0 opacity-60 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-1 h-7 w-7 p-0 opacity-60 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-slate-500 dark:text-slate-400 rounded-md w-9 font-normal text-[0.8rem] h-9 flex items-center justify-center",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal"
        ),
        selected:
          "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-600 focus:text-white rounded-lg",
        today:
          "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50 rounded-lg font-semibold",
        outside: "text-slate-400 opacity-40 dark:text-slate-500",
        disabled: "text-slate-400 opacity-40 dark:text-slate-500 cursor-not-allowed",
        range_start: "rounded-l-lg",
        range_end: "rounded-r-lg",
        range_middle:
          "aria-selected:bg-green-100 aria-selected:text-green-900 dark:aria-selected:bg-green-900/30 dark:aria-selected:text-green-100",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          ...rest
        }: {
          orientation?: string;
          size?: number;
          disabled?: boolean;
          className?: string;
        }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
