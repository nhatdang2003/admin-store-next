"use client";

import { useEffect, useState } from "react";
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
    Legend,
    ReferenceLine,
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
    const { data: chartData, isLoading } = useRevenueByMonth(selectedYear);

    const formattedData = chartData?.labels.map((label: string, index: number) => ({
        month: label,
        revenue: Number((chartData.datasets[0].data[index] / 1000000).toFixed(1)), // Convert to millions
        orders: chartData.datasets[1].data[index],
    }));

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg font-bold">Doanh thu & đơn hàng hàng tháng</CardTitle>
                    </div>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[120px]">
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
                        <LineChart
                            data={formattedData}
                            margin={{ top: 0, right: 20, left: 20, bottom: 30 }}
                        >
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#1E40AF" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#D97706" stopOpacity={1} />
                                </linearGradient>
                                <filter id="dropShadow">
                                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                                </filter>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="2 4"
                                stroke="hsl(var(--muted-foreground))"
                                strokeOpacity={0.15}
                                horizontal={true}
                                vertical={true}
                            />
                            <XAxis
                                angle={-45}
                                dataKey="month"
                                axisLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
                                tickLine={false}
                                tick={{
                                    fontSize: 12,
                                    fill: "hsl(var(--muted-foreground))",
                                }}
                                dy={25}
                            />
                            <YAxis
                                yAxisId="revenue"
                                axisLine={{ stroke: "#1F2937", strokeWidth: 1.5 }}
                                tickLine={false}
                                tick={{
                                    fontSize: 14,
                                    fill: "#1F2937",
                                }}
                                label={{
                                    value: "Doanh thu (Triệu VNĐ)",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '14px',
                                        fill: '#1F2937'
                                    },
                                }}
                                dx={-10}
                            />
                            <YAxis
                                yAxisId="orders"
                                orientation="right"
                                axisLine={{ stroke: "#1F2937", strokeWidth: 1.5 }}
                                tickLine={false}
                                tick={{
                                    fontSize: 14,
                                    fill: "#1F2937",
                                }}
                                label={{
                                    value: "Số đơn hàng",
                                    angle: 90,
                                    position: "insideRight",
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '14px',
                                        fill: '#1F2937'
                                    },
                                }}
                                dx={10}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                                                <p className=" text-gray-800 mb-2">{label}</p>
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: entry.color }}
                                                        />
                                                        <span className="font-medium" style={{ color: entry.color }}>
                                                            {entry.name}:
                                                        </span>
                                                        <span className="text-gray-700 font-semibold">
                                                            {String(entry.name)?.includes('Doanh thu')
                                                                ? `${entry.value} triệu VNĐ`
                                                                : `${entry.value} đơn`
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="line"
                                wrapperStyle={{
                                    paddingBottom: '20px',
                                    fontSize: '14px',
                                }}
                            />
                            <ReferenceLine
                                yAxisId="revenue"
                                x={0}
                                stroke="#16A34A"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                strokeOpacity={0.4}
                            />
                            <ReferenceLine
                                yAxisId="orders"
                                x={formattedData?.length ? formattedData.length - 1 : 11}
                                stroke="#1F2937"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                strokeOpacity={0.4}
                            />
                            <Line
                                yAxisId="revenue"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#16A34A"
                                name="Doanh thu"
                            />
                            <Line
                                yAxisId="orders"
                                type="monotone"
                                dataKey="orders"
                                stroke="#1F2937"
                                name="Số đơn hàng"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
