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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
    useProductListQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useDownloadTemplateImportProduct,
    useImportProductMutation,
} from "@/hooks/use-product-query";
import Image from "next/image";
import { ProductData } from "@/types/product";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { useCategoryListQuery } from "@/hooks/use-category-query";
import { useToast } from "@/hooks/use-toast";

export default function ProductList() {
    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const search = searchParams.get("search");

    const { data, isLoading } = useProductListQuery(Number(page || 1), 10, search || "");
    const { data: categories } = useCategoryListQuery({ page: 1, pageSize: 100000 });
    const addProductMutation = useAddProductMutation();
    const updateProductMutation = useUpdateProductMutation();
    const deleteProductMutation = useDeleteProductMutation();
    const [deletingProduct, setDeletingProduct] = useState<ProductData | null>(null);
    const downloadTemplateMutation = useDownloadTemplateImportProduct();
    const importProductMutation = useImportProductMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleAddProduct = async (productData: ProductData) => {
        try {
            await addProductMutation.mutateAsync({
                data: productData,
            });
        } catch (error) {
            throw error;
        }
    };

    const handleEditProduct = async (productData: ProductData) => {
        try {
            await updateProductMutation.mutateAsync({
                data: productData,
            });
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteProduct = async () => {
        if (!deletingProduct) return;

        try {
            await deleteProductMutation.mutateAsync(deletingProduct.id.toString());
            setDeletingProduct(null);
        } catch (error) { }
    };

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

        importProductMutation.mutate(formData);

        event.target.value = '';
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const products = data?.data || [];
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
            <h2 className="text-3xl font-bold tracking-tight">Sản phẩm</h2>
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
                                onClick={() => downloadTemplateMutation.mutate()}
                                disabled={downloadTemplateMutation.isPending}
                                className="cursor-pointer"
                            >
                                {downloadTemplateMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                Tải mẫu Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={triggerFileSelect}
                                disabled={importProductMutation.isPending}
                                className="cursor-pointer"
                            >
                                {importProductMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileUp className="mr-2 h-4 w-4" />
                                )}
                                Import Excel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ProductFormDialog
                        mode="add"
                        categories={categories?.data || []}
                        onSubmit={handleAddProduct}
                        addProductMutation={addProductMutation}
                        updateProductMutation={updateProductMutation}
                    />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Hình ảnh</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Giá gốc</TableHead>
                        <TableHead>Giá sale</TableHead>
                        <TableHead>Giảm giá</TableHead>
                        <TableHead>Nổi bật</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: any) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <div className="relative w-16 aspect-[2/3]">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className=" object-cover rounded-md"
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.categoryName}</TableCell>
                            <TableCell>{formatPrice(product.price)}</TableCell>
                            <TableCell>{formatPrice(product.priceWithDiscount)}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        product.discountRate > 0 ? "destructive" : "secondary"
                                    }
                                >
                                    {product.discountRate * 100}%
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={product.featured ? "default" : "secondary"}>
                                    {product.featured ? "Có" : "Không"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <div className="cursor-pointer">
                                            <ProductFormDialog
                                                mode="edit"
                                                product={product}
                                                categories={categories?.data || []}
                                                onSubmit={handleEditProduct}
                                                addProductMutation={addProductMutation}
                                                updateProductMutation={updateProductMutation}
                                            />
                                        </div>
                                        <DropdownMenuItem
                                            className="text-destructive py-2 px-4 focus:text-destructive cursor-pointer"
                                            onClick={() => setDeletingProduct(product)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Xóa
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

            {/* AlertDialog xóa sản phẩm */}
            <AlertDialog
                open={!!deletingProduct}
                onOpenChange={() => setDeletingProduct(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa sản phẩm này và không thể khôi phục.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProduct}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleteProductMutation.isPending ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
