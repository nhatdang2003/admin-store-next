"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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
import type { Category } from "@/types/category";
import { ImageUpload } from "../ui/image-upload";
import { toast } from "@/hooks/use-toast";
import { imageApi } from "@/services/image.api";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(50, "Tên danh mục không được vượt quá 50 ký tự"),
  imageFile: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSave: (data: { name: string; imageUrl: string }) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  category,
  onSave,
  onCancel,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      imageFile: null,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);

      let imageUrl = category?.imageUrl || "";

      // Upload image if there's a new file
      if (data.imageFile) {
        // 1. Get presigned URL
        const response = await imageApi.getPresignedUrl(data.imageFile.name);
        console.log(response);

        const { signedUrl } = response;
        console.log(signedUrl);

        // 2. Upload to Google Cloud Storage
        const uploadResponse = await imageApi.uploadImage(
          signedUrl,
          data.imageFile
        );
        console.log(uploadResponse);

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        imageUrl = uploadResponse.url.split("?")[0];
      }

      // Call the parent's onSave with both name and image URL
      await onSave({
        name: data.name,
        imageUrl,
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra khi lưu danh mục",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên danh mục" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  preview={category?.imageUrl}
                  onChange={(file) => field.onChange(file)}
                  onRemove={() => field.onChange(null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : category ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
