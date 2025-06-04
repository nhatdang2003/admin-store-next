"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Pagination } from "@/components/shared/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
    formatPrice,
    getColorText,
    getStatusColor,
    getStatusText,
} from "@/lib/utils";
import { OrderDetailModal } from "../modal/detail-order-dialog";
import { orderApi } from "@/services/order.api";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Star } from "lucide-react";
import { ProductReviewModal } from "../modal/product-review-modal";
import { useOrders } from "@/hooks/use-order-query";
import { error } from "console";

interface LineItem {
    id: number;
    productName: string;
    color: string;
    size: string;
    variantImage: string;
    quantity: number;
    unitPrice: number;
    discount: number;
}

interface Order {
    id: number;
    code: string;
    orderDate: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    lineItems: LineItem[];
    total: number;
    shippingFee: number;
    discount: number;
    finalTotal: number;
    canReview: boolean;
    isReviewed: boolean;
}

interface ApiResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        data: Order[];
    };
}

export default function OrderList() {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "6";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const { data: orders, isLoading, error: ordersError } = useOrders({
        page: parseInt(page),
        size: parseInt(size),
        status,
        search,
    });
    // Lấy thông tin pagination từ meta
    const currentPage = orders?.meta?.page + 1; // Vì API trả về page bắt đầu từ 0
    const totalPages = orders?.meta?.pages;

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

    const continuePayment = async (id: string) => {
        try {
            const response = await orderApi.continuePayment(id);
            router.push(response.paymentUrl);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra, vui lòng thử lại",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                            <div>
                                <Skeleton className="h-4 w-[200px] mb-2" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                            <Skeleton className="h-6 w-[100px] rounded-full" />
                        </div>
                        <Skeleton className="h-[100px] w-full mb-4" />
                        <Skeleton className="h-8 w-[200px]" />
                    </Card>
                ))}
            </div>
        );
    }

    if (ordersError) {
        return (
            <div className="text-center py-4 text-red-500">
                <p>{ordersError.message}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Thử lại
                </Button>
            </div>
        );
    }

    if (!orders?.data || orders?.data?.length === 0) {
        return <div className="text-center py-4">Không có đơn hàng nào.</div>;
    }

    return (
        <div className="space-y-4">
            {orders?.data?.map((order: Order) => (
                <Card key={order.id} className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
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
                    {order?.lineItems?.map((item: LineItem) => (
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
                            <div className="text-center sm:text-right mt-2 sm:mt-0">
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
                                        Tiết kiệm: {formatPrice(item.discount * item.quantity)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="border-t pt-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                            <div className="text-sm text-muted-foreground">
                                {order?.lineItems?.length} sản phẩm
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
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm">
                                <span className="text-muted-foreground">
                                    Phương thức thanh toán:{" "}
                                </span>
                                <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                                <OrderDetailModal orderId={order.id.toString()} />
                                {order.paymentMethod === "VNPAY" &&
                                    order.paymentStatus === "PENDING" && (
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={() => continuePayment(order.id.toString())}
                                        >
                                            <CreditCard className="h-6 w-6 mr-2" />
                                            Tiếp tục thanh toán
                                        </Button>
                                    )}
                                {order.canReview ||
                                    (order.isReviewed && (
                                        <ProductReviewModal orderId={order.id.toString()} />
                                    ))}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                className="mt-8"
            />
        </div>
    );
}
