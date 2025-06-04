"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getPaymentMethodText,
  getPaymentStatusText,
  getShippingMethodText,
  getStatusText,
} from "@/lib/utils";
import {
  PAYMENT_STATUS,
  STATUS_ORDER,
  PAYMENT_METHOD,
  SHIPPING_METHOD,
} from "@/constants/order";
import { DATE_ERROR_MESSAGE } from "@/constants/message-error";

interface OrderFilterProps {
  onFiltersChange: (filters: {
    paymentStatus: string;
    orderStatus: string;
    paymentMethod: string;
    deliveryMethod: string;
  }) => void;
}

export function OrderFilter({ onFiltersChange }: OrderFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    paymentStatus: searchParams.get("paymentStatus") || "ALL",
    orderStatus: searchParams.get("orderStatus") || "ALL",
    paymentMethod: searchParams.get("paymentMethod") || "ALL",
    deliveryMethod: searchParams.get("deliveryMethod") || "ALL",
  });

  const [fromDate, setFromDate] = useState<Date | undefined>(() => {
    const from = searchParams.get("from");
    if (from) {
      const [day, month, year] = from.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    return undefined;
  });

  const [toDate, setToDate] = useState<Date | undefined>(() => {
    const to = searchParams.get("to");
    if (to) {
      const [day, month, year] = to.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    return undefined;
  });

  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    // Cập nhật filters
    const newFilters = {
      paymentStatus: searchParams.get("paymentStatus") || "ALL",
      orderStatus: searchParams.get("orderStatus") || "ALL",
      paymentMethod: searchParams.get("paymentMethod") || "ALL",
      deliveryMethod: searchParams.get("deliveryMethod") || "ALL",
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);

    // Cập nhật fromDate
    const from = searchParams.get("from");
    if (from) {
      const [day, month, year] = from.split("/");
      setFromDate(new Date(Number(year), Number(month) - 1, Number(day)));
    } else {
      setFromDate(undefined);
    }

    // Cập nhật toDate
    const to = searchParams.get("to");
    if (to) {
      const [day, month, year] = to.split("/");
      setToDate(new Date(Number(year), Number(month) - 1, Number(day)));
    } else {
      setToDate(undefined);
    }

    // Reset date error khi URL thay đổi
    setDateError(null);
  }, [searchParams, onFiltersChange]);

  const getActiveFiltersCount = () => {
    let count = Object.values(filters).filter(
      (value) => value !== "ALL"
    ).length;

    // Đếm filter thời gian là 1 bộ lọc nếu có từ ngày hoặc đến ngày và không có lỗi
    if ((fromDate || toDate) && !dateError) count++;

    return count;
  };

  const updateURL = (
    newFilters: typeof filters,
    newFromDate?: Date,
    newToDate?: Date
  ) => {
    const params = new URLSearchParams();

    // Luôn set from trước
    if (newFromDate) {
      params.set("from", format(newFromDate, "dd/MM/yyyy"));
    }

    // Sau đó set to
    if (newToDate) {
      params.set("to", format(newToDate, "dd/MM/yyyy"));
    }

    // Cuối cùng set các filter khác
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== "ALL") {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    if (!dateError) {
      updateURL(newFilters, fromDate, toDate);
    }
  };

  const resetFilters = () => {
    // Reset tất cả các filter
    const defaultFilters = {
      paymentStatus: "ALL",
      orderStatus: "ALL",
      paymentMethod: "ALL",
      deliveryMethod: "ALL",
    };
    setFilters(defaultFilters);

    // Reset date filters và error
    setFromDate(undefined);
    setToDate(undefined);
    setDateError(null);

    // Reset URL và callback
    router.push(window.location.pathname, { scroll: false });
    onFiltersChange(defaultFilters);
  };

  const handleFromDateChange = (date: Date | undefined) => {
    if (date && toDate && date > toDate) {
      setFromDate(date);
      setDateError(DATE_ERROR_MESSAGE.FROM_DATE_GREATER_THAN_TO_DATE);
    } else {
      setFromDate(date);
      setDateError(null);
      updateURL(filters, date, toDate);
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    if (date && fromDate && date < fromDate) {
      setToDate(date);
      setDateError(DATE_ERROR_MESSAGE.TO_DATE_LESS_THAN_FROM_DATE);
    } else {
      setToDate(date);
      setDateError(null);
      updateURL(filters, fromDate, date);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Bộ lọc
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Bộ lọc đơn hàng</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian đặt hàng</label>
              <DatePickerWithRange
                className="w-full"
                fromDate={fromDate}
                toDate={toDate}
                handleFromDateChange={handleFromDateChange}
                handleToDateChange={handleToDateChange}
              />
              {dateError && (
                <p className="text-sm text-destructive mt-1">{dateError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Trạng thái thanh toán
              </label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) =>
                  handleFilterChange("paymentStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  {PAYMENT_STATUS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái đơn hàng</label>
              <Select
                value={filters.orderStatus}
                onValueChange={(value) =>
                  handleFilterChange("orderStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  {STATUS_ORDER.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phương thức thanh toán
              </label>
              <Select
                value={filters.paymentMethod}
                onValueChange={(value) =>
                  handleFilterChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  {PAYMENT_METHOD.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phương thức giao hàng
              </label>
              <Select
                value={filters.deliveryMethod}
                onValueChange={(value) =>
                  handleFilterChange("deliveryMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  {SHIPPING_METHOD.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={resetFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
