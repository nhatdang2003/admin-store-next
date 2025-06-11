"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Printer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    getStatusColor,
    getStatusText,
    getPaymentMethodText,
    getPaymentStatusText,
    getColorText,
    formatPrice,
} from "@/lib/utils";
import { useOrder } from "@/hooks/use-order-query";
import { useUpdateOrderStatus } from "@/hooks/use-order-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { STATUS_ORDER } from "@/constants/order";

interface OrderDetailModalProps {
    orderId: string;
    open: boolean;
    onClose: () => void;
}

export function OrderDetailNotiModal({
    orderId,
    open,
    onClose,
}: OrderDetailModalProps) {
    const { data: order, isLoading } = useOrder(orderId);
    const { mutate: updateOrderStatus } = useUpdateOrderStatus();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
    };

    const OrderSkeleton = () => (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>

            {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 py-4 border-t">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="w-24 space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}

            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2 text-right">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-4 py-2 sm:px-6 sm:py-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg sm:text-xl">
                            Chi tiết đơn hàng
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 max-h-[90vh] overflow-auto">
                    {isLoading ? (
                        <OrderSkeleton />
                    ) : order ? (
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Order Info */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="font-semibold">Mã đơn hàng: {order.code}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Ngày đặt: {formatDate(order.orderDate)}
                                    </div>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`rounded-full ${getStatusColor(order.status)}`}
                                >
                                    {getStatusText(order.status)}
                                </Badge>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            Phương thức thanh toán:{" "}
                                            {getPaymentMethodText(order.paymentMethod)}
                                        </p>
                                        <p>
                                            Trạng thái thanh toán:{" "}
                                            {getPaymentStatusText(order.paymentStatus)}
                                        </p>
                                        {order.paymentDate && (
                                            <p>Ngày thanh toán: {formatDate(order.paymentDate)}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-medium">
                                            {order.shippingProfile.lastName}{" "}
                                            {order.shippingProfile.firstName}
                                        </p>
                                        <p>Số điện thoại: {order.shippingProfile.phoneNumber}</p>
                                        <p>
                                            Địa chỉ:{" "}
                                            {`${order.shippingProfile.address}, ${order.shippingProfile.ward}, ${order.shippingProfile.district}, ${order.shippingProfile.province}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-4">
                                {order.lineItems.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row gap-4 py-4 border-t"
                                    >
                                        <Image
                                            src={item.variantImage}
                                            alt={item.productName}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover self-center sm:self-start"
                                        />
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-medium mb-1">{item.productName}</h3>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                Màu: {getColorText(item.color)}, Kích thước: {item.size}
                                            </div>
                                            <div className="text-sm">x{item.quantity}</div>
                                        </div>
                                        <div className="text-center sm:text-right">
                                            {item.discount > 0 ? (
                                                <>
                                                    <div className="font-medium text-red-600">
                                                        {formatPrice(item.unitPrice - item.discount)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        {formatPrice(item.unitPrice)}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="font-medium">
                                                    {formatPrice(item.unitPrice)}
                                                </div>
                                            )}
                                            <div className="text-sm font-semibold mt-1">
                                                Tổng:{" "}
                                                {formatPrice(
                                                    (item.unitPrice - item.discount) * item.quantity
                                                )}
                                            </div>
                                            {item.discount > 0 && (
                                                <div className="text-xs text-green-600">
                                                    Tiết kiệm:{" "}
                                                    {formatPrice(item.discount * item.quantity)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        {order.lineItems.length} sản phẩm
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <div className="text-sm text-muted-foreground">
                                            Tổng tiền hàng: {formatPrice(order.total)}
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="text-sm text-green-600">
                                                Tiết kiệm: -{formatPrice(order.discount)}
                                            </div>
                                        )}
                                        {order.shippingFee > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                Phí vận chuyển: {formatPrice(order.shippingFee)}
                                            </div>
                                        )}
                                        <div className="text-lg font-medium mt-1">
                                            Tổng số tiền: {formatPrice(order.finalTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Order Actions */}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        Trạng thái hiện tại:
                                    </div>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) => {
                                            updateOrderStatus({
                                                orderId,
                                                status: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_ORDER.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            Không tìm thấy thông tin đơn hàng
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
