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
    getStatusReturnText,
    getStatusCashBackText,
    getStatusCashBackColor,
    getStatusReturnColor,
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
import { useReturnQuery } from "@/hooks/use-return-query";
import { ReturnRequestDetailModal } from "@/components/modal/detail-return-request";

export default function ReturnRequestList() {
    const searchParams = useSearchParams();

    const { data: returnRequests, isLoading } = useReturnQuery(1, 10, searchParams.get("status") || "", searchParams.get("search") || "");

    const currentPage = returnRequests?.meta?.page + 1;
    const totalPages = returnRequests?.meta?.pages;
    const data = returnRequests?.data;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Yêu cầu hoàn trả</h1>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <OrderSearch placeholder="Tìm kiếm theo mã đơn hàng" />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Ngày yêu cầu</TableHead>
                        <TableHead>Lý do hoàn trả</TableHead>
                        <TableHead className="text-center">Trạng thái hoàn trả</TableHead>
                        <TableHead className="text-center">Trạng thái hoàn tiền</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((returnRequest: any) => (
                        <TableRow key={returnRequest.id}>
                            <TableCell>{returnRequest.orderCode}</TableCell>
                            <TableCell>
                                {format(new Date(returnRequest.createdAt), "dd/MM/yyyy HH:mm")}
                            </TableCell>
                            <TableCell>{returnRequest.reason}</TableCell>
                            <TableCell className="text-center">
                                <Badge
                                    variant="secondary"
                                    className={getStatusReturnColor(returnRequest.status)}
                                >
                                    {getStatusReturnText(returnRequest.status)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                {returnRequest.cashBackStatus && (
                                    <Badge
                                        variant="secondary"
                                        className={getStatusCashBackColor(returnRequest.cashBackStatus)}
                                    >
                                        {getStatusCashBackText(returnRequest.cashBackStatus)}
                                    </Badge>
                                )}
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
                                        <ReturnRequestDetailModal returnRequestId={returnRequest.id} />
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
