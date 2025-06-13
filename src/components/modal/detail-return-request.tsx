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
import { useReturnRequestByIdQuery, useUpdateReturnRequestStatusMutation } from "@/hooks/use-return-query";
import { useUpdateCashBackStatusMutation } from "@/hooks/use-return-query";
import { CASH_BACK_STATUS } from "@/constants/order";

interface ReturnRequestDetailModalProps {
    returnRequestId: string;
    updateStatus?: boolean;
}

export function ReturnRequestDetailModal({
    returnRequestId,
    updateStatus,
}: ReturnRequestDetailModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: returnRequest, isLoading } = useReturnRequestByIdQuery(returnRequestId);
    const { mutate: updateReturnRequestStatus } = useUpdateReturnRequestStatusMutation();
    const { mutate: updateCashBackStatus } = useUpdateCashBackStatusMutation();
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={updateStatus ? "ghost" : "outline"}
                    className="w-full sm:w-auto"
                >
                    <Eye className="h-6 w-6 mr-2" />
                    Xem chi tiết
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-4 py-2 sm:px-6 sm:py-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg sm:text-xl">
                            Chi tiết yêu cầu hoàn trả
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 max-h-[90vh] overflow-auto">
                    {isLoading ? (
                        <OrderSkeleton />
                    ) : returnRequest ? (
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Return Request Info */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="font-semibold">Mã đơn hàng: {returnRequest.orderCode}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Ngày yêu cầu hoàn trả: {formatDate(returnRequest.createdAt)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Lý do: {returnRequest.reason}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full ${getStatusColor(returnRequest.status)}`}
                                    >
                                        {getStatusText(returnRequest.status)}
                                    </Badge>
                                    {returnRequest.cashBackStatus && (
                                        <Badge variant="outline" className="rounded-full">
                                            Hoàn tiền: {returnRequest.cashBackStatus}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Return Request Details Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin thanh toán gốc</h3>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            Phương thức thanh toán:{" "}
                                            {getPaymentMethodText(returnRequest.originalPaymentMethod)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin hoàn tiền</h3>
                                    <div className="space-y-1 text-sm">
                                        {returnRequest.bankName && (
                                            <>
                                                <p className="font-medium">
                                                    {returnRequest.accountHolderName}
                                                </p>
                                                <p>Ngân hàng: {returnRequest.bankName}</p>
                                                <p>
                                                    Số tài khoản: {returnRequest.accountNumber}
                                                </p>
                                            </>
                                        )}
                                        {returnRequest.adminComment && (
                                            <p>Ghi chú admin: {returnRequest.adminComment}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Return Items */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">Sản phẩm yêu cầu hoàn trả</h3>
                                {returnRequest.orderItems.map((item: any) => (
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

                            {/* Return Summary */}
                            <div className="border-t pt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        {returnRequest.orderItems.length} sản phẩm yêu cầu hoàn trả
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <div className="text-lg font-medium mt-1">
                                            Tổng tiền hoàn trả: {formatPrice(
                                                returnRequest.orderItems.reduce((total: number, item: any) =>
                                                    total + (item.unitPrice - item.discount) * item.quantity, 0
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images Section */}
                            {returnRequest.imageUrls && returnRequest.imageUrls.length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Hình ảnh đính kèm</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {returnRequest.imageUrls.map((imageUrl: string, index: number) => (
                                            <Image
                                                key={index}
                                                src={imageUrl}
                                                alt={`Hình ảnh ${index + 1}`}
                                                width={100}
                                                height={100}
                                                className="rounded-md object-cover"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Actions */}
                            {updateStatus && returnRequest && (
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                                        <div className="text-sm text-muted-foreground">
                                            Trạng thái hiện tại:
                                        </div>
                                        <Select
                                            value={returnRequest.status}
                                            onValueChange={(value) => {
                                                updateReturnRequestStatus({
                                                    id: returnRequestId,
                                                    status: value,
                                                    adminComment: "",
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
                                        <div className="text-sm text-muted-foreground">
                                            Trạng thái hoàn tiền hiện tại:
                                        </div>
                                        <Select
                                            value={returnRequest.cashBackStatus}
                                            onValueChange={(value) => {
                                                updateCashBackStatus({
                                                    id: returnRequestId,
                                                    cashBackStatus: value,
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CASH_BACK_STATUS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
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
