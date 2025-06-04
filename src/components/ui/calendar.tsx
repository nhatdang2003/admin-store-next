"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vi } from "date-fns/locale";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            locale={vi}
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                caption_dropdowns: "flex justify-center gap-1",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
                    const options = React.Children.toArray(
                        children
                    ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
                    const selected = options.find((child) => child.props.value === value);
                    const handleChange = (value: string) => {
                        const changeEvent = {
                            target: { value },
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChange?.(changeEvent);
                    };

                    // Mapping tháng sang định dạng T1, T2, T3...
                    const monthMapping: { [key: string]: string } = {
                        "Tháng Một": "Tháng 1",
                        "Tháng Hai": "Tháng 2",
                        "Tháng Ba": "Tháng 3",
                        "Tháng Tư": "Tháng 4",
                        "Tháng Năm": "Tháng 5",
                        "Tháng Sáu": "Tháng 6",
                        "Tháng Bảy": "Tháng 7",
                        "Tháng Tám": "Tháng 8",
                        "Tháng Chín": "Tháng 9",
                        "Tháng Mười": "Tháng 10",
                        "Tháng Mười Một": "Tháng 11",
                        "Tháng Mười Hai": "Tháng 12"
                    };

                    const getDisplayText = (text: string) => {
                        return monthMapping[text] || text;
                    };

                    return (
                        <Select
                            value={value?.toString()}
                            onValueChange={(value) => {
                                handleChange(value);
                            }}
                        >
                            <SelectTrigger className="pr-1.5 focus:ring-0 w-fit px-2">
                                <SelectValue>
                                    {selected?.props?.children ?
                                        getDisplayText(selected.props.children.toString()) :
                                        selected?.props?.children
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <ScrollArea className="h-80">
                                    {options.map((option, id: number) => (
                                        <SelectItem
                                            key={`${option.props.value}-${id}`}
                                            value={option.props.value?.toString() ?? ""}
                                        >
                                            {getDisplayText(option.props.children?.toString() || "")}
                                        </SelectItem>
                                    ))}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                    );
                },
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
1;
