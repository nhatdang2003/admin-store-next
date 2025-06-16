"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarIcon, Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { useToast } from "@/hooks/use-toast";
import { useExportExcelStockHistory, useStockHistoryQuery } from "@/hooks/use-stock-query";
import { format, formatDate } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

export default function StockHistoriesList() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const router = useRouter();
    const { mutate: exportStock, isPending: isExportStockLoading } = useExportExcelStockHistory();
    const [startDateState, setStartDateState] = useState<any>(startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDateState, setEndDateState] = useState<any>(endDate ? new Date(endDate) : new Date());
    const { data, isLoading } = useStockHistoryQuery(Number(page || 1), 10, search || "", startDate || "", endDate || "");

    const handleExportExcel = () => {
        exportStock({
            sku: search || "",
            startDate: startDate || "",
            endDate: endDate || ""
        });
    }

    // Sync URL params to state when URL changes
    useEffect(() => {
        if (startDate) {
            setStartDateState(new Date(startDate));
        } else {
            setStartDateState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        }

        if (endDate) {
            setEndDateState(new Date(endDate));
        } else {
            setEndDateState(new Date());
        }
    }, [startDate, endDate]);

    // Sync state to URL when state changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (startDateState) {
            params.set("startDate", format(startDateState, "yyyy-MM-dd"));
        } else {
            params.delete("startDate");
        }
        if (endDateState) {
            params.set("endDate", format(endDateState, "yyyy-MM-dd"));
        } else {
            params.delete("endDate");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, [startDateState, endDateState]);

    const histories = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Lịch sử tồn kho</h2>
                <div className="flex items-center gap-2">
                    <DatePickerWithRange
                        fromDate={startDateState}
                        toDate={endDateState}
                        handleFromDateChange={(date: any) => setStartDateState(date)}
                        handleToDateChange={(date: any) => setEndDateState(date)}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <SearchInput placeholder="Tìm kiếm sản phẩm" className="w-[300px]" />
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handleExportExcel()} disabled={isExportStockLoading}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ngày thay đổi</TableHead>
                        <TableHead>Mã biến thể</TableHead>
                        <TableHead className="text-center">Số lượng thay đổi</TableHead>
                        <TableHead className="text-center">Số lượng sau thay đổi</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead>User thực hiện</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {histories.length > 0 ? histories.map((history: any) => (
                        <TableRow key={history.id}>
                            <TableCell className="font-medium">{formatDate(history.timestamp, "dd/MM/yyyy HH:mm")}</TableCell>
                            <TableCell className="font-medium">{history.productSku}</TableCell>
                            <TableCell className="text-right">{history.changeInQuantity}</TableCell>
                            <TableCell className="text-right">{history.quantityAfterChange}</TableCell>
                            <TableCell>{history.notes}</TableCell>
                            <TableCell>{history.updatedBy}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">Không có dữ liệu</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {meta && (
                <Pagination currentPage={meta.page + 1} totalPages={meta.pages} />
            )}
        </div>
    );
}
