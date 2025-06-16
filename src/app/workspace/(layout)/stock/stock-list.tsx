"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal, Download, Loader2, ChevronDown, FileUp } from "lucide-react";
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
import { useExportExcelStock, useImportStockQuery, useStockQuery, useUpdateStockQuery } from "@/hooks/use-stock-query";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CASH_BACK_STATUS, STATUS_RETURN } from "@/constants/order";

export default function ProductList() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const router = useRouter();
    const { data, isLoading } = useStockQuery(Number(page || 1), 10, search || "", sort === "all" ? undefined : sort || "");
    const { mutate: exportStock, isPending: isExportStockLoading } = useExportExcelStock();
    const { mutate: importStock, isPending: isImportStockPending } = useImportStockQuery();
    const { mutate: updateStock, isPending: isUpdateStockPending } = useUpdateStockQuery();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [openUpdateStock, setOpenUpdateStock] = useState(false);
    const [sku, setSku] = useState<any>(null);
    const [quantity, setQuantity] = useState<any>(0);
    const [note, setNote] = useState<any>("");

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

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set("page", "1");
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        router.push(`${pathname}?${params.toString()}`);
    }

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
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">Sắp xếp</p>
                    <Select value={sort || "all"} onValueChange={handleSort}>
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Mã sản phẩm</SelectItem>
                            <SelectItem value="asc">Số lượng tăng dần</SelectItem>
                            <SelectItem value="desc">Số lượng giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
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
                                            className="py-2 px-4 cursor-pointer"
                                            onClick={() => {
                                                setOpenUpdateStock(true);
                                                setSku(stock.sku);
                                                setQuantity(stock.quantityInStock);
                                                setNote(stock.note);
                                            }}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
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

            <Dialog open={openUpdateStock} onOpenChange={setOpenUpdateStock}>
                <DialogContent className="p-0">
                    <DialogHeader className="px-4 py-2 sm:px-6 sm:py-4 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-lg sm:text-xl">
                                Cập nhật tồn kho
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">Mã sản phẩm</p>
                            <Input type="text" value={sku} readOnly />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">Số lượng</p>
                            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">Ghi chú</p>
                            <Textarea value={note} onChange={(e) => setNote(e.target.value)}
                                rows={3} className="resize-none" />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOpenUpdateStock(false)}>
                                Hủy
                            </Button>
                            <Button
                                onClick={() => {
                                    updateStock({
                                        sku: sku,
                                        quantity: quantity,
                                        note: note
                                    })
                                    setOpenUpdateStock(false);
                                }}
                                disabled={isUpdateStockPending}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
