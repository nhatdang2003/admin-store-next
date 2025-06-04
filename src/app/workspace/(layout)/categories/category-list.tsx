"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, MoreHorizontal, X } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import {
    useCategoryListQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "@/hooks/use-category-query";
import { Pagination } from "@/components/shared/pagination";
import type { Category, CategoryListResponse } from "@/types/category";
import { PAGE_SIZE } from "@/constants/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CategoryForm from "@/components/categories/category-form";
import { CategorySearch } from "@/components/categories/category-search";

export default function CategoryList() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || undefined;

    const { data, isLoading } = useCategoryListQuery({
        page: currentPage,
        pageSize: PAGE_SIZE,
        search,
    });

    const categories = data?.data || [];
    const meta = data?.meta;

    const addMutation = useAddCategoryMutation();
    const updateMutation = useUpdateCategoryMutation();
    const deleteMutation = useDeleteCategoryMutation();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleAddCategory = async (formData: Omit<Category, "id">) => {
        try {
            console.log(formData);
            await addMutation.mutateAsync(formData);
            setIsAddDialogOpen(false);
        } catch {
            // Error đã được xử lý trong mutation
        }
    };

    const handleUpdateCategory = async (formData: Omit<Category, "id">) => {
        try {
            if (!editingCategory) return;
            await updateMutation.mutateAsync({
                id: editingCategory.id,
                ...formData,
            });
            setEditingCategory(null);
        } catch {
            // Error đã được xử lý trong mutation
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
            await deleteMutation.mutateAsync(id);
        } catch {
            // Error đã được xử lý trong mutation
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Danh mục sản phẩm</h1>

            <div className="flex justify-between items-center">
                <CategorySearch />
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm danh mục mới</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            onSave={handleAddCategory}
                            onCancel={() => setIsAddDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên danh mục</TableHead>
                            <TableHead>Hình ảnh</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category: Category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="w-20 object-cover aspect-[2/3]"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onSelect={() => setEditingCategory(category)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                <span>Chỉnh sửa</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => handleDeleteCategory(category.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Xóa</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {data?.data.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        {search
                            ? `Không tìm thấy danh mục nào cho "${search}"`
                            : "Chưa có danh mục nào"}
                    </div>
                )}
            </>

            {meta && (
                <div className="flex flex-col gap-2">
                    <Pagination currentPage={meta.page + 1} totalPages={meta.pages} />
                </div>
            )}

            <Dialog
                open={!!editingCategory}
                onOpenChange={() => setEditingCategory(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <CategoryForm
                            category={editingCategory}
                            onSave={handleUpdateCategory}
                            onCancel={() => setEditingCategory(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
