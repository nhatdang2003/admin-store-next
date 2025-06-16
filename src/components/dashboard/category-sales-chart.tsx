"use client";

import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { useCategorySalesChart } from "@/hooks/use-dashboard-query";

const COLORS = [
    "#16A34A", // Green
    "#1F2937", // Dark Gray
    "#6B7280", // Gray
    "#D1D5DB", // Light Gray
    "#F3F4F6", // Very Light Gray
];

const TIME_PERIODS = [
    { value: "today", label: "Hôm nay" },
    { value: "this_week", label: "Tuần này" },
    { value: "this_month", label: "Tháng này" },
];

export default function CategorySalesChart() {
    const [selectedPeriod, setSelectedPeriod] = useState("this_month");
    const { data: categorySales, isLoading } = useCategorySalesChart(selectedPeriod);

    // Process data: show top 4 categories + "Others" if more than 5
    const processedData = () => {
        if (!categorySales || categorySales.length === 0) return [];

        // Sort by totalSales descending
        const sortedData = [...categorySales].sort((a, b) => b.totalSales - a.totalSales);

        // Calculate total for percentage calculation
        const totalSales = sortedData.reduce((sum, item) => sum + item.totalSales, 0);

        if (sortedData.length <= 5) {
            return sortedData.map((item, index) => ({
                name: item.categoryName,
                value: item.totalSales,
                color: COLORS[index % COLORS.length],
                percentage: totalSales > 0 ? ((item.totalSales / totalSales) * 100).toFixed(1) : "0"
            }));
        }

        // Take top 4 and group the rest as "Others"
        const top4 = sortedData.slice(0, 4);
        const others = sortedData.slice(4);
        const othersTotal = others.reduce((sum, item) => sum + item.totalSales, 0);

        const result = [
            ...top4.map((item, index) => ({
                name: item.categoryName,
                value: item.totalSales,
                color: COLORS[index],
                percentage: totalSales > 0 ? ((item.totalSales / totalSales) * 100).toFixed(1) : "0"
            })),
            {
                name: "Khác",
                value: othersTotal,
                color: COLORS[4],
                percentage: totalSales > 0 ? ((othersTotal / totalSales) * 100).toFixed(1) : "0"
            }
        ];

        return result;
    };

    const chartData = processedData();
    const totalSales = chartData.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-gray-800 font-medium mb-1">{data.name}</p>
                    <p className="text-gray-600 text-sm">
                        Doanh thu: <span className="font-semibold">{formatPrice(data.value)}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                        Tỷ lệ: <span className="font-semibold">{data.payload.percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => (
        <div className="flex flex-col gap-1.5 mt-2">
            {payload?.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 w-4/5">
                        <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className=" text-gray-700 font-medium truncate">
                            {entry.value}
                        </span>
                    </div>
                    <span className="text-gray-500 font-medium ml-2">
                        {entry.payload.percentage}%
                    </span>
                </div>
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <Card className="w-full h-fit">
                <CardHeader className="pb-3">
                    <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold">Doanh thu theo danh mục</CardTitle>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Tổng: <span className="font-semibold text-primary">--</span>
                            </p>
                            <Select disabled>
                                <SelectTrigger className="w-[120px] h-8">
                                    <SelectValue placeholder="Đang tải..." />
                                </SelectTrigger>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="text-gray-500">Đang tải dữ liệu...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!categorySales || categorySales.length === 0 || totalSales === 0) {
        return (
            <Card className="w-full h-fit">
                <CardHeader className="pb-3">
                    <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold">Doanh thu theo danh mục</CardTitle>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Tổng: <span className="font-semibold text-primary">{formatPrice(0)}</span>
                            </p>
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
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="h-[300px] flex flex-col items-center justify-center text-center">
                        <div className="text-gray-400 mb-2">
                            <svg
                                className="w-12 h-12 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Không có dữ liệu</p>
                        <p className="text-gray-400 text-xs">
                            Chưa có doanh thu theo danh mục trong thời gian này
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-fit">
            <CardHeader className="pb-3">
                <div className="space-y-2">
                    <CardTitle className="text-xl font-semibold">Doanh thu theo danh mục</CardTitle>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Tổng: <span className="font-semibold text-primary">{formatPrice(totalSales)}</span>
                        </p>
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
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="45%"
                                innerRadius={45}
                                outerRadius={85}
                                paddingAngle={1}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="#ffffff"
                                        strokeWidth={1}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
} 