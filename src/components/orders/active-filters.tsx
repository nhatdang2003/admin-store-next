"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPaymentMethodText,
  getPaymentStatusText,
  getShippingMethodText,
  getStatusText,
  getPaymentStatusColor,
  getStatusColor,
} from "@/lib/utils";
import { format } from "date-fns";

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("paymentStatus");
  const orderStatus = searchParams.get("orderStatus");
  const paymentMethod = searchParams.get("paymentMethod");
  const deliveryMethod = searchParams.get("deliveryMethod");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  const hasActiveFilters =
    paymentStatus ||
    orderStatus ||
    paymentMethod ||
    deliveryMethod ||
    fromDate ||
    toDate;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const removeDateFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span>Bộ lọc đang áp dụng:</span>
      <div className="flex flex-wrap gap-2">
        {(fromDate || toDate) && (
          <Badge variant="secondary">
            Thời gian: {fromDate && `Từ ${fromDate}`}{" "}
            {toDate && `Đến ${toDate}`}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={removeDateFilter}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {paymentStatus && (
          <Badge
            variant="secondary"
            className={getPaymentStatusColor(paymentStatus)}
          >
            Thanh toán: {getPaymentStatusText(paymentStatus)}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => removeFilter("paymentStatus")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {orderStatus && (
          <Badge variant="secondary" className={getStatusColor(orderStatus)}>
            Đơn hàng: {getStatusText(orderStatus)}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => removeFilter("orderStatus")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {paymentMethod && (
          <Badge variant="secondary">
            PT thanh toán: {getPaymentMethodText(paymentMethod)}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => removeFilter("paymentMethod")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {deliveryMethod && (
          <Badge variant="secondary">
            PT giao hàng: {getShippingMethodText(deliveryMethod)}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => removeFilter("deliveryMethod")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}
