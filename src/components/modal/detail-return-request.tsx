"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, CreditCard, MessageSquare, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    getStatusColor,
    getStatusText,
    getPaymentMethodText,
    getPaymentStatusText,
    getColorText,
    formatPrice,
    getStatusCashBackText,
    getStatusReturnText,
    getStatusCashBackColor,
    getStatusReturnColor,
} from "@/lib/utils";
import { useReturnRequestByIdQuery, useUpdateReturnRequestStatusMutation } from "@/hooks/use-return-query";
import { useUpdateCashBackStatusMutation } from "@/hooks/use-return-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { STATUS_ORDER, STATUS_RETURN } from "@/constants/order";
import { CASH_BACK_STATUS } from "@/constants/order";
import { ImageModal } from "../ui/image-modal";
import { Textarea } from "../ui/textarea";

interface ReturnRequestDetailModalProps {
    returnRequestId: string;
    updateStatus?: boolean;
}

export function ReturnRequestDetailModal({
    returnRequestId,
    updateStatus,
}: ReturnRequestDetailModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { data: returnRequest, isLoading } = useReturnRequestByIdQuery(returnRequestId);
    const { mutate: updateReturnRequestStatus } = useUpdateReturnRequestStatusMutation();
    const { mutate: updateCashBackStatus } = useUpdateCashBackStatusMutation();
    const [isModalUpdateStatusOpen, setIsModalUpdateStatusOpen] = useState(false);

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

    const ModalUpdateStatus = ({ returnRequest, isOpen, setIsOpen }: {
        returnRequest: any, isOpen: boolean, setIsOpen: (open: boolean) => void
    }) => {
        const [adminComment, setAdminComment] = useState("");
        const [selectedStatus, setSelectedStatus] = useState(returnRequest?.status || "");
        const [selectedCashBackStatus, setSelectedCashBackStatus] = useState(returnRequest?.cashBackStatus || "");

        const handleUpdateStatus = () => {
            if (returnRequest.status === "APPROVED") {
                updateCashBackStatus({
                    id: returnRequestId,
                    cashBackStatus: selectedCashBackStatus
                });
            } else {
                updateReturnRequestStatus({
                    id: returnRequestId,
                    status: selectedStatus,
                    adminComment: adminComment
                });
            }
            setIsOpen(false);
        }

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="p-0">
                    <DialogHeader className="px-4 py-2 sm:px-6 sm:py-4 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-lg sm:text-xl">
                                Cập nhật trạng thái
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-4">
                        {returnRequest.status === "APPROVED" ? (
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    Trạng thái hoàn tiền:
                                </div>
                                <Select
                                    value={selectedCashBackStatus}
                                    onValueChange={setSelectedCashBackStatus}
                                >
                                    <SelectTrigger className="w-full">
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
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        Trạng thái yêu cầu hoàn trả:
                                    </div>
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={setSelectedStatus}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_RETURN.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        Phản hồi cho khách hàng:
                                    </div>
                                    <Textarea
                                        value={adminComment}
                                        onChange={(e) => setAdminComment(e.target.value)}
                                        className="w-full min-h-[100px] p-2 border rounded-md resize-none"
                                        placeholder="Nhập phản hồi..."
                                    />
                                </div>
                            </>
                        )}


                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Hủy
                            </Button>
                            <Button
                                onClick={handleUpdateStatus}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
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
                    variant="ghost"
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
                            {/* Return Request Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="font-semibold text-lg">Yêu cầu hoàn trả #{returnRequest.orderCode}</div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <div>Ngày tạo yêu cầu: {formatDate(returnRequest.createdAt)}</div>
                                        {returnRequest.orderDetails && (
                                            <div>Ngày đặt hàng: {formatDate(returnRequest.orderDetails.orderDate)}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full justify-center ${returnRequest.status === "APPROVED"
                                            ? getStatusCashBackColor(returnRequest.cashBackStatus)
                                            : getStatusReturnColor(returnRequest.status)}`}
                                    >
                                        {returnRequest.status === "APPROVED"
                                            ? getStatusCashBackText(returnRequest.cashBackStatus)
                                            : getStatusReturnText(returnRequest.status)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            {returnRequest.orderDetails && (
                                <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                Phương thức thanh toán:{" "}
                                                {getPaymentMethodText(returnRequest.orderDetails.paymentMethod)}
                                            </p>
                                            <p>
                                                Trạng thái thanh toán:{" "}
                                                {getPaymentStatusText(returnRequest.orderDetails.paymentStatus)}
                                            </p>
                                            {returnRequest.orderDetails.paymentDate && (
                                                <p>Ngày thanh toán: {formatDate(returnRequest.orderDetails.paymentDate)}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
                                        <div className="space-y-1 text-sm">
                                            {returnRequest.orderDetails.shippingProfile && (
                                                <>
                                                    <p className="font-medium">
                                                        {returnRequest.orderDetails.shippingProfile.lastName}{" "}
                                                        {returnRequest.orderDetails.shippingProfile.firstName}
                                                    </p>
                                                    <p>Số điện thoại: {returnRequest.orderDetails.shippingProfile.phoneNumber}</p>
                                                    <p>
                                                        Địa chỉ:{" "}
                                                        {`${returnRequest.orderDetails.shippingProfile.address}, ${returnRequest.orderDetails.shippingProfile.ward}, ${returnRequest.orderDetails.shippingProfile.district}, ${returnRequest.orderDetails.shippingProfile.province}`}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Return Request Details Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Thông tin hoàn trả
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">Lý do hoàn trả:</span>
                                            <div className="mt-1 text-muted-foreground bg-white p-2 rounded border">
                                                {returnRequest.reason}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Thông tin hoàn tiền
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        {returnRequest.bankName && (
                                            <>
                                                <div>
                                                    <span className="font-medium">Ngân hàng:</span> {returnRequest.bankName}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Số tài khoản:</span> {returnRequest.accountNumber}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Chủ tài khoản:</span> {returnRequest.accountHolderName}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Admin Comment */}
                            {returnRequest.adminComment && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold mb-2 text-blue-800">Phản hồi của cửa hàng</h3>
                                    <div className="text-sm text-blue-700">{returnRequest.adminComment}</div>
                                </div>
                            )}

                            {/* Images */}
                            {returnRequest.imageUrls && returnRequest.imageUrls.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Hình ảnh đính kèm ({returnRequest.imageUrls.length})
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {returnRequest.imageUrls.map((imageUrl: string, index: number) => (
                                            <div key={index} className="w-[100px] h-[100px] flex-shrink-0">
                                                <ImageModal
                                                    src={imageUrl}
                                                    alt={`Hình ảnh ${index + 1}`}
                                                >
                                                    <div className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={`Hình ảnh ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </ImageModal>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <div className="space-y-4">
                                    {returnRequest.orderDetails?.lineItems?.map((item: any) => (
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
                                                <h4 className="font-medium mb-1">{item.productName}</h4>
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
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        {returnRequest.orderDetails?.lineItems?.length || 0} sản phẩm
                                    </div>
                                    <div className="text-center sm:text-right">
                                        {returnRequest.orderDetails ? (
                                            <>
                                                <div className="text-sm text-muted-foreground">
                                                    Tổng tiền hàng: {formatPrice(returnRequest.orderDetails.total)}
                                                </div>
                                                {returnRequest.orderDetails.discount > 0 && (
                                                    <div className="text-sm text-green-600">
                                                        Tiết kiệm: -{formatPrice(returnRequest.orderDetails.discount)}
                                                    </div>
                                                )}
                                                {returnRequest.orderDetails.shippingFee > 0 && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Phí vận chuyển: {formatPrice(returnRequest.orderDetails.shippingFee)}
                                                    </div>
                                                )}
                                                <div className="text-lg font-medium mt-1">
                                                    Tổng tiền hoàn trả: {formatPrice(returnRequest.orderDetails.finalTotal)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-lg font-medium mt-1">
                                                Tổng tiền hoàn trả: {formatPrice(
                                                    returnRequest.orderDetails?.lineItems?.reduce((total: number, item: any) =>
                                                        total + (item.unitPrice - item.discount) * item.quantity, 0
                                                    ) || 0
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                <DialogFooter className="border-t px-2 py-2">
                    {/* Order Actions */}
                    <Button variant="default" onClick={() => setIsModalUpdateStatusOpen(true)}>
                        Cập nhật trạng thái
                    </Button>
                </DialogFooter>
                <ModalUpdateStatus returnRequest={returnRequest} isOpen={isModalUpdateStatusOpen} setIsOpen={setIsModalUpdateStatusOpen} />
            </DialogContent>
        </Dialog>
    );
}
