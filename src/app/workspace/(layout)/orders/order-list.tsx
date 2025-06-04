"use client";

import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";
import { OrderFilter } from "@/components/orders/order-filter";
import {
    formatPrice,
    getPaymentMethodText,
    getPaymentStatusColor,
    getPaymentStatusText,
    getShippingMethodText,
    getStatusColor,
    getStatusText,
} from "@/lib/utils";
import { ActiveFilters } from "@/components/orders/active-filters";
import { OrderSearch } from "@/components/orders/order-search";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useOrders } from "@/hooks/use-order-query";
import { OrderDetailModal } from "@/components/modal/detail-order-dialog";
import { useSearchParams } from "next/navigation";

export default function OrderList() {
    const searchParams = useSearchParams();

    const { data: orders, isLoading } = useOrders({
        page: parseInt(searchParams.get("page") || "1"),
        size: parseInt(searchParams.get("size") || "10"),
        status: searchParams.get("status") || "",
        search: searchParams.get("search") || "",
        paymentStatus: searchParams.get("paymentStatus") || "",
        orderStatus: searchParams.get("orderStatus") || "",
        paymentMethod: searchParams.get("paymentMethod") || "",
        deliveryMethod: searchParams.get("deliveryMethod") || "",
        from: searchParams.get("from") || "",
        to: searchParams.get("to") || "",
    });

    const currentPage = orders?.meta?.page + 1;
    const totalPages = orders?.meta?.pages;
    const data = orders?.data;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Đơn hàng</h1>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <OrderSearch />
                    <OrderFilter onFiltersChange={(filters) => console.log(filters)} />
                </div>

                <ActiveFilters />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                        <TableHead className="text-center">Trạng thái thanh toán</TableHead>
                        <TableHead className="text-center">Trạng thái đơn hàng</TableHead>
                        <TableHead className="text-right">Số lượng</TableHead>
                        <TableHead className="text-center">
                            Phương thức thanh toán
                        </TableHead>
                        <TableHead className="text-center">Phương thức giao hàng</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((order: any) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.orderCode}</TableCell>
                            <TableCell>
                                {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
                            </TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell className="text-right">
                                {formatPrice(order.total)}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge
                                    variant="secondary"
                                    className={getPaymentStatusColor(order.paymentStatus)}
                                >
                                    {getPaymentStatusText(order.paymentStatus)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge
                                    variant="secondary"
                                    className={getStatusColor(order.orderStatus)}
                                >
                                    {getStatusText(order.orderStatus)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {order.numberOfItems}
                            </TableCell>
                            <TableCell className="text-center">
                                {getPaymentMethodText(order.paymentMethod)}
                            </TableCell>
                            <TableCell className="text-center">
                                {getShippingMethodText(order.deliveryMethod)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <OrderDetailModal orderId={order.id} updateStatus={true} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
