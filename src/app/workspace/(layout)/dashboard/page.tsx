"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
    ShoppingBag,
    Users,
    DollarSign,
    Package,
    TrendingUp,
    TrendingDown,
    Eye,
    RotateCcw,
    ArrowRight,
    MoreHorizontal,
} from "lucide-react";
import {
    formatPrice,
    getPaymentStatusColor,
    getPaymentStatusText,
    getStatusColor,
    getStatusText,
    getPaymentMethodText,
    getShippingMethodText,
    getStatusCashBackColor,
    getStatusCashBackText,
    getStatusReturnColor,
    getStatusReturnText,
} from "@/lib/utils";
import { format } from "date-fns";
import RevenueChart from "@/components/dashboard/revenue-chart";
import CategorySalesChart from "@/components/dashboard/category-sales-chart";
import { useDashboard, useLowStockProducts, useNewOrders, useSummary, useTopProducts, useTopReturnRequests } from "@/hooks/use-dashboard-query";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { ReturnRequestDetailModal } from "@/components/modal/detail-return-request";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

const TIME_PERIODS = [
    { value: "today", label: "Hôm nay" },
    { value: "this_week", label: "Tuần này" },
    { value: "this_month", label: "Tháng này" },
];

export default function DashboardPage() {
    const { data: dataDashboard, isLoading } = useDashboard();
    const { data: dataOrders, isLoading: isLoadingOrders } = useNewOrders();
    const { data: dataSummary, isLoading: isLoadingSummary } = useSummary();
    const [selectedPeriod, setSelectedPeriod] = useState("this_month");
    const { data: dataTopProducts, isLoading: isLoadingTopProducts } = useTopProducts(selectedPeriod);
    const { data: dataLowStockProducts, isLoading: isLoadingLowStockProducts } = useLowStockProducts();
    const { data: dataTopReturnRequests, isLoading: isLoadingTopReturnRequests } = useTopReturnRequests();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (dataDashboard === undefined) {
        return <div>No data</div>;
    }

    return (
        <div className="flex">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Dashboard Content */}
                <div className="p-6">
                    {/* Summary Metrics */}
                    {dataSummary && (
                        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Doanh số bán hàng
                                    </CardTitle>
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatPrice(dataSummary.totalSales.value)}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        {dataSummary.totalSales.changePercentage >= 0 ? (
                                            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                                        ) : (
                                            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                                        )}
                                        <span className={dataSummary.totalSales.changePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                                            {dataSummary.totalSales.changePercentage}% so với kỳ trước
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Lượt truy cập
                                    </CardTitle>
                                    <Eye className="w-4 h-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dataSummary.visitors.value}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        {dataSummary.visitors.changePercentage >= 0 ? (
                                            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                                        ) : (
                                            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                                        )}
                                        <span className={dataSummary.visitors.changePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                                            {dataSummary.visitors.changePercentage}% so với kỳ trước
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Tổng đơn hàng
                                    </CardTitle>
                                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dataSummary.totalOrders.value}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        {dataSummary.totalOrders.changePercentage >= 0 ? (
                                            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                                        ) : (
                                            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                                        )}
                                        <span className={dataSummary.totalOrders.changePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                                            {dataSummary.totalOrders.changePercentage}% so với kỳ trước
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Đơn hàng hoàn trả
                                    </CardTitle>
                                    <RotateCcw className="w-4 h-4 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dataSummary.refunded.value}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        {dataSummary.refunded.changePercentage >= 0 ? (
                                            <TrendingUp className="mr-1 h-3 w-3 text-red-600" />
                                        ) : (
                                            <TrendingDown className="mr-1 h-3 w-3 text-green-600" />
                                        )}
                                        <span className={dataSummary.refunded.changePercentage >= 0 ? "text-red-600" : "text-green-600"}>
                                            {dataSummary.refunded.changePercentage}% so với kỳ trước
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="flex gap-6 mb-8">
                        <div className="flex-1">
                            <RevenueChart />
                        </div>
                        <div className="w-[350px] flex-shrink-0">
                            <CategorySalesChart />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-1">
                            {/* Top Products */}
                            <Card className="mb-8">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle>Top sản phẩm bán chạy</CardTitle>
                                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                        <SelectTrigger className="w-[120px] h-8">
                                            <SelectValue placeholder="Chọn thời gian" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_PERIODS.map((period) => (
                                                <SelectItem key={period.value} value={period.value}>
                                                    {period.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead></TableHead>
                                                <TableHead>Tên sản phẩm</TableHead>
                                                <TableHead className="text-right">Số lượng</TableHead>
                                                <TableHead className="text-right">Doanh thu</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dataTopProducts?.data.map((product: any) => (
                                                <TableRow key={product.productId}>
                                                    <TableCell>
                                                        <Image
                                                            src={product.imageUrl}
                                                            alt={product.productName}
                                                            width={50}
                                                            height={50}
                                                            className="object-cover"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{product.productName}</TableCell>
                                                    <TableCell className="text-right">
                                                        {product.quantitySold}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatPrice(product.totalSales)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex-1">
                            {/* Số lượng tồn kho */}
                            <Card className="mb-8">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle>Các mã sản phẩm sắp hết hàng</CardTitle>
                                    <div className="text-sm text-muted-foreground">
                                        <Link className="flex items-center gap-2 hover:text-primary" href="/workspace/stock">
                                            Chi tiết tồn kho <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mã sản phẩm</TableHead>
                                                <TableHead className="text-right">Số lượng</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dataLowStockProducts?.data.map((product: any) => (
                                                <TableRow key={product.sku}>
                                                    <TableCell>{product.sku}</TableCell>
                                                    <TableCell className="text-right">
                                                        {product.quantityInStock}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <Card className="mb-8">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle>Đơn hàng mới nhất</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                <Link className="flex items-center gap-2 hover:text-primary" href="/workspace/orders">
                                    Quản lý đơn hàng <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã đơn hàng</TableHead>
                                        <TableHead>Ngày đặt</TableHead>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead className="text-right">Tổng tiền</TableHead>
                                        <TableHead className="text-center">
                                            Trạng thái thanh toán
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Trạng thái đơn hàng
                                        </TableHead>
                                        <TableHead className="text-right">Số lượng</TableHead>
                                        <TableHead className="text-center">
                                            Phương thức thanh toán
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Phương thức giao hàng
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataOrders?.data.map((order: any) => (
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Yêu cầu hoàn trả */}
                    <Card className="mb-8">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle>Yêu cầu hoàn trả</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                <Link className="flex items-center gap-2 hover:text-primary" href="/workspace/refunds">
                                    Quản lý yêu cầu hoàn trả <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
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
                                    {dataTopReturnRequests?.data.map((returnRequest: any) => (
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
