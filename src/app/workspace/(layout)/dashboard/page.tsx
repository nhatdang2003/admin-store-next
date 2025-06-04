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
} from "lucide-react";
import {
    formatPrice,
    getPaymentStatusColor,
    getPaymentStatusText,
    getStatusColor,
    getStatusText,
    getPaymentMethodText,
    getShippingMethodText,
} from "@/lib/utils";
import { format } from "date-fns";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { useDashboard, useNewOrders } from "@/hooks/use-dashboard-query";

export default function DashboardPage() {
    const { data: dataDashboard, isLoading } = useDashboard();
    const { data: dataOrders, isLoading: isLoadingOrders } = useNewOrders();

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
                    {/* Metrics */}
                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                title: "Tổng doanh thu",
                                value: formatPrice(dataDashboard.totalRevenue),
                                icon: DollarSign,
                                color: "text-green-600",
                            },
                            {
                                title: "Tổng đơn hàng",
                                value: dataDashboard.totalOrders,
                                icon: ShoppingBag,
                                color: "text-blue-600",
                            },
                            {
                                title: "Tổng khách hàng",
                                value: dataDashboard.totalUsers,
                                icon: Users,
                                color: "text-yellow-600",
                            },
                            {
                                title: "Tổng sản phẩm",
                                value: dataDashboard.totalProducts,
                                icon: Package,
                                color: "text-purple-600",
                            },
                        ].map((item) => (
                            <Card key={item.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {item.title}
                                    </CardTitle>
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{item.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <RevenueChart />

                    {/* Recent Orders */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Đơn hàng mới nhất</CardTitle>
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
                </div>
            </main>
        </div>
    );
}
