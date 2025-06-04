"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  fromDate?: Date;
  toDate?: Date;
  handleFromDateChange?: (date: Date | undefined) => void;
  handleToDateChange?: (date: Date | undefined) => void;
}

export function DatePickerWithRange({
  className,
  fromDate,
  toDate,
  handleFromDateChange,
  handleToDateChange,
}: DatePickerWithRangeProps) {
  const currentYear = new Date().getFullYear();
  const toYear = currentYear + 5;

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="grid flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Từ ngày</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateChange}
              defaultMonth={fromDate}
              toDate={toDate}
              captionLayout="dropdown-buttons"
              fromYear={1960}
              toYear={toYear}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "dd/MM/yyyy") : <span>Đến ngày</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              selected={toDate}
              onSelect={handleToDateChange}
              defaultMonth={toDate ?? fromDate}
              fromDate={fromDate}
              captionLayout="dropdown-buttons"
              fromYear={1960}
              toYear={toYear}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
