"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import {
  usePromotionListQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} from "@/hooks/use-promotion-query";
import { PromotionSearch } from "@/components/promotions/promotion-search";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromotionForm } from "@/components/promotions/promotion-form";
import { useSearchParams } from "next/navigation";

export default function PromotionList({ initialData }: any) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [open, setOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<any>(null);
  const { data, isLoading } = usePromotionListQuery({
    initialData,
    search,
  });
  const addPromotionMutation = useAddPromotionMutation();
  const updatePromotionMutation = useUpdatePromotionMutation();
  const deletePromotionMutation = useDeletePromotionMutation();
  const { toast } = useToast();
  const promotions = data?.data || [];
  const meta = data?.meta;

  const handleAddPromotion = async (data: any) => {
    try {
      await addPromotionMutation.mutateAsync(data);
      toast({
        variant: "success",
        title: "Thêm khuyến mãi thành công",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra khi thêm khuyến mãi",
      });
    }
  };

  const handleUpdatePromotion = async (data: any) => {
    try {
      await updatePromotionMutation.mutateAsync({
        id: editingPromotion.id,
        ...data,
      });
      toast({
        variant: "success",
        title: "Cập nhật khuyến mãi thành công",
      });
      setEditingPromotion(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra khi cập nhật khuyến mãi",
      });
    }
  };

  const handleDeletePromotion = async () => {
    try {
      await deletePromotionMutation.mutateAsync(deletingPromotion.id);
      toast({
        variant: "success",
        title: "Xóa khuyến mãi thành công",
      });
      setDeletingPromotion(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra khi xóa khuyến mãi",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
      </div>

      <div className="flex justify-between items-center">
        <PromotionSearch />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm khuyến mãi
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm khuyến mãi mới</DialogTitle>
          </DialogHeader>
          <PromotionForm
            onSubmit={handleAddPromotion}
            isLoading={addPromotionMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingPromotion}
        onOpenChange={() => setEditingPromotion(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
          </DialogHeader>
          <PromotionForm
            promotion={editingPromotion}
            onSubmit={handleUpdatePromotion}
            isLoading={updatePromotionMutation.isPending}
            onCancel={() => setEditingPromotion(null)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingPromotion}
        onOpenChange={() => setDeletingPromotion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn khuyến mãi và gỡ bỏ tất cả các liên
              kết với sản phẩm và danh mục. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePromotion}
              disabled={deletePromotionMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletePromotionMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tên khuyến mãi</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Phạm vi áp dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion: any) => (
              <TableRow key={promotion.id}>
                <TableCell className="font-medium">
                  {promotion.name}
                  <p className="text-sm text-muted-foreground">
                    {promotion.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">
                    -{promotion.discountRate}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>
                      Bắt đầu:{" "}
                      {format(new Date(promotion.startDate), "dd/MM/yyyy")}
                    </p>
                    <p>
                      Kết thúc:{" "}
                      {format(new Date(promotion.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {promotion.categories.length > 0 && (
                        <>
                          <Badge variant="outline">
                            {promotion.categories.length} danh mục
                          </Badge>
                          {promotion.products.length > 0 && (
                            <span className="text-muted-foreground">•</span>
                          )}
                        </>
                      )}
                      {promotion.products.length > 0 && (
                        <Badge variant="outline">
                          {promotion.products.length} sản phẩm
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date() < new Date(promotion.startDate) ? (
                    <Badge variant="outline">Sắp diễn ra</Badge>
                  ) : new Date() > new Date(promotion.endDate) ? (
                    <Badge variant="destructive">Đã kết thúc</Badge>
                  ) : (
                    <Badge variant="success">Đang diễn ra</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingPromotion(promotion)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingPromotion(promotion)}
                        className="text-destructive focus:text-destructive"
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

        {promotions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có khuyến mãi nào
          </div>
        )}

        {meta && (
          <div className="flex flex-col gap-2">
            <Pagination currentPage={meta.page + 1} totalPages={meta.pages} />
          </div>
        )}
      </>
    </div>
  );
}
