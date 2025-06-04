"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategoryListQuery } from "@/hooks/use-category-query";
import { useProductListQuery } from "@/hooks/use-product-query";
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

interface PromotionRequest {
  id?: number;
  name: string;
  description?: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  productIds: number[];
  categoryIds: number[];
}

const formSchema = z
  .object({
    name: z.string().min(1, "Vui lòng nhập tên khuyến mãi"),
    description: z.string().min(1, "Vui lòng nhập mô tả khuyến mãi"),
    discountRate: z
      .number()
      .min(1, "Vui lòng nhập %")
      .max(100, "Giảm giá phải từ 1-100%"),
    startDate: z.date({
      required_error: "Vui lòng chọn ngày bắt đầu",
    }),
    endDate: z.date({
      required_error: "Vui lòng chọn ngày kết thúc",
    }),
    categoryIds: z.array(z.number()).default([]),
    productIds: z.array(z.number()).default([]),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
      path: ["startDate"],
    }
  );

interface PromotionFormProps {
  promotion?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function PromotionForm({
  promotion,
  onSubmit,
  isLoading,
  onCancel,
}: PromotionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      discountRate: 0,
      startDate: undefined,
      endDate: undefined,
      categoryIds: [],
      productIds: [],
    },
  });

  // Watch startDate và endDate để cập nhật DatePickerWithRange
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Fetch categories và products
  const { data: categoriesData } = useCategoryListQuery({
    page: 1,
    pageSize: 20,
  });

  const { data: productsData } = useProductListQuery(1, 20);

  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];

  useEffect(() => {
    if (promotion) {
      form.reset({
        name: promotion.name,
        description: promotion.description,
        discountRate: promotion.discountRate,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        categoryIds: promotion.categories?.map((c: any) => c.id) || [],
        productIds: promotion.products?.map((p: any) => p.id) || [],
      });
    }
  }, [promotion, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...(promotion?.id && { id: promotion.id }),
      name: values.name,
      description: values.description || "",
      discountRate: values.discountRate,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      categoryIds: values.categoryIds || [],
      productIds: values.productIds || [],
    };

    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form
        id="promotion-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên khuyến mãi</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên khuyến mãi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả khuyến mãi"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 grid-cols-12">
          <FormField
            control={form.control}
            name="discountRate"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Phần trăm giảm giá</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      type="text"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => {
                        // Chỉ giữ lại số và giới hạn max 100
                        const value = e.target.value.replace(/\D/g, "");
                        if (value === "") {
                          field.onChange(0);
                          return;
                        }
                        const numValue = Math.min(Number(value), 100);
                        field.onChange(numValue);
                      }}
                      onBlur={(e) => {
                        const value = Number(e.target.value);
                        if (value > 100) {
                          field.onChange(100);
                        } else if (value < 0) {
                          field.onChange(0);
                        }
                      }}
                    />
                    <span className="ml-2">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-9">
            <FormLabel>Thời gian áp dụng</FormLabel>
            <DatePickerWithRange
              className="mt-2"
              fromDate={startDate || undefined}
              toDate={endDate || undefined}
              handleFromDateChange={(date: Date | undefined) => {
                if (date) {
                  form.setValue("startDate", date);
                }
              }}
              handleToDateChange={(date: Date | undefined) => {
                if (date) {
                  form.setValue("endDate", date);
                }
              }}
            />
            {(form.formState.errors.startDate ||
              form.formState.errors.endDate) && (
              <p className="text-[0.8rem] font-medium text-destructive mt-2">
                {form.formState.errors.startDate?.message ||
                  form.formState.errors.endDate?.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục áp dụng</FormLabel>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4">
                    <Command>
                      <CommandInput placeholder="Tìm danh mục..." />
                      <CommandEmpty>Không tìm thấy danh mục</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category: any) => (
                          <CommandItem
                            key={category.id}
                            onSelect={() => {
                              const current = field.value || [];
                              const newValue = current.includes(category.id)
                                ? current.filter((id) => id !== category.id)
                                : [...current, category.id];
                              field.onChange(newValue);
                            }}
                          >
                            <div className="flex items-center">
                              <span
                                className={cn(
                                  "mr-2",
                                  field.value?.includes(category.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              >
                                ✓
                              </span>
                              {category.name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </div>
                </ScrollArea>
                <div className="mt-2">
                  {field.value?.map((id: any) => {
                    const category = categories.find((c: any) => c.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="mr-1">
                        {category?.name}
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sản phẩm áp dụng</FormLabel>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4">
                    <Command>
                      <CommandInput placeholder="Tìm sản phẩm..." />
                      <CommandEmpty>Không tìm thấy sản phẩm</CommandEmpty>
                      <CommandGroup>
                        {products.map((product: any) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => {
                              const current = field.value || [];
                              const newValue = current.includes(product.id)
                                ? current.filter((id) => id !== product.id)
                                : [...current, product.id];
                              field.onChange(newValue);
                            }}
                          >
                            <div className="flex items-center">
                              <span
                                className={cn(
                                  "mr-2",
                                  field.value?.includes(product.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              >
                                ✓
                              </span>
                              {product.name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </div>
                </ScrollArea>
                <div className="mt-2">
                  {field.value?.map((id) => {
                    const product = products.find((p: any) => p.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="mr-1">
                        {product?.name}
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Hủy
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" disabled={isLoading}>
                {promotion ? "Cập nhật" : "Thêm mới"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {promotion ? "Xác nhận cập nhật?" : "Xác nhận thêm mới?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {promotion
                    ? "Hành động này sẽ cập nhật thông tin khuyến mãi. Các sản phẩm đang áp dụng khuyến mãi này sẽ được cập nhật giá mới."
                    : "Hành động này sẽ tạo khuyến mãi mới và áp dụng giá mới cho các sản phẩm được chọn."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction type="submit" form="promotion-form">
                  Xác nhận
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
