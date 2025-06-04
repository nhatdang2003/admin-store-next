"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
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
import { useRevenueByMonth } from "@/hooks/use-dashboard-query";

const monthNames = [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
];

const CustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
        <text
            x={x + width / 2}
            y={y - 10}
            fill="hsl(var(--foreground))"
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {`${value.toFixed(1)}`}
        </text>
    );
};

export default function RevenueChart() {
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );
    const { data: revenueData, isLoading } = useRevenueByMonth(selectedYear);

    const formattedData = revenueData?.revenueByMonth.map((item: any) => ({
        ...item,
        revenue: Number((item.revenue / 1000000).toFixed(1)), // Convert to millions
        monthName: monthNames[item.month - 1],
    }));

    return (
        <Card className="w-full mb-8">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Doanh Thu Hàng Tháng</CardTitle>
                        <CardDescription>
                            Tổng quan doanh thu cho năm {selectedYear}
                        </CardDescription>
                    </div>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i} value={`${new Date().getFullYear() - i}`}>
                                    {`${new Date().getFullYear() - i}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="monthName" />
                            <YAxis
                                label={{
                                    value: "Doanh Thu (Triệu VNĐ)",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} Triệu`, "Doanh Thu"]}
                                labelFormatter={(label) => `Tháng: ${label}`}
                            />
                            <Bar dataKey="revenue" fill="hsl(var(--primary))">
                                <Label content={CustomBarLabel} position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
