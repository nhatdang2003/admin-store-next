"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal, Download, Loader2, ChevronDown, FileUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getColorText } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useExportExcelStock, useImportStockQuery, useStockQuery } from "@/hooks/use-stock-query";

export default function ProductList() {
    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const search = searchParams.get("search");

    const { data, isLoading } = useStockQuery(Number(page || 1), 10, search || "");
    const { mutate: exportStock, isPending: isExportStockLoading } = useExportExcelStock();
    const { mutate: importStock, isPending: isImportStockPending } = useImportStockQuery();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Chỉ chấp nhận file Excel (.xlsx, .xls)",
            });
            return;
        }

        console.log(file);
        const formData = new FormData();
        formData.append('file', file);

        importStock(formData);

        event.target.value = '';
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const stocks = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportExcel}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
            />
            <h2 className="text-3xl font-bold tracking-tight">Tồn kho</h2>
            <div className="flex justify-between items-center">
                <SearchInput placeholder="Tìm kiếm sản phẩm..." className="w-[300px]" />
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Excel
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => exportStock()}
                                disabled={isExportStockLoading}
                                className="cursor-pointer"
                            >
                                {isExportStockLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                Xuất Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={triggerFileSelect}
                                disabled={isImportStockPending}
                                className="cursor-pointer"
                            >
                                {isImportStockPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileUp className="mr-2 h-4 w-4" />
                                )}
                                Import Excel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã sản phẩm</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Màu sắc</TableHead>
                        <TableHead>Kích thước</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock: any) => (
                        <TableRow key={stock.variantId}>
                            <TableCell className="font-medium">{stock.sku}</TableCell>
                            <TableCell className="font-medium">{stock.productName}</TableCell>
                            <TableCell>{getColorText(stock.color)}</TableCell>
                            <TableCell>{stock.size}</TableCell>
                            <TableCell>{stock.quantityInStock}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="text-destructive py-2 px-4 focus:text-destructive cursor-pointer"
                                            onClick={() => { }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Cập nhật
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {meta && (
                <Pagination currentPage={meta.page + 1} totalPages={meta.pages} />
            )}
        </div>
    );
}
