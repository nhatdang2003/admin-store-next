"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Image, Loader2, Pencil, PlusCircle } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { imageApi } from "@/services/image.api";
import { ProductData } from "@/types/product";
import { toast, useToast } from "@/hooks/use-toast";
import { Size, COLOR } from "@/constants/product";
import { categoryApi } from "@/services/category.api";
import { cn } from "@/lib/utils";

interface Category {
    id: number;
    name: string;
}

interface Variant {
    id?: number;
    color: string;
    size: string;
    quantity: number;
    differencePrice: number;
    images: string[];
}

interface ProductFormData {
    id?: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    featured: boolean;
    images: string[];
    variants: Variant[];
}

// Assume we have a list of categories from an API or context
// const categories: Category[] = [
//     {
//         id: 1,
//         name: "Áo Cardigan & Áo len",
//     },
//     {
//         id: 2,
//         name: "Áo khoác & Áo khoác dài",
//     },
//     {
//         id: 3,
//         name: "Áo sơ mi & Áo kiểu",
//     },
//     {
//         id: 4,
//         name: "Quần Jeans",
//     },
//     {
//         id: 5,
//         name: "Chân váy",
//     },
//     {
//         id: 6,
//         name: "Áo nỉ & Áo hoodie",
//     },
//     {
//         id: 7,
//         name: "Blazer & Áo Ghile Nữ",
//     },
//     {
//         id: 8,
//         name: "Quần Short",
//     },
//     {
//         id: 9,
//         name: "Quần áo Basic",
//     },
//     {
//         id: 10,
//         name: "Đồ ngủ",
//     },
// ];

// Chuyển đổi enum Size thành array options
const sizeOptions = Object.keys(Size)
    .filter((key) => isNaN(Number(key))) // Lọc bỏ các key là số
    .map((key) => ({
        value: key,
        label: key,
    }));

interface ProductFormDialogProps {
    mode: "add" | "edit";
    product?: ProductData;
    categories: Category[];
    onSubmit: (data: ProductData) => Promise<void>;
    addProductMutation: any;
    updateProductMutation: any;
}

// Thêm interface cho uploaded image
interface UploadedImage {
    file?: File;
    preview: string;
    url?: string;
}

export function ProductFormDialog({
    mode,
    product,
    categories,
    onSubmit,
    addProductMutation,
    updateProductMutation,
}: ProductFormDialogProps) {
    console.log("product", product);
    const [isOpen, setIsOpen] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
        product?.images.map((url) => ({ preview: url, url })) || []
    );
    const { toast } = useToast();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm<ProductData>({
        defaultValues: product || {
            id: 0,
            name: "",
            description: "",
            price: 0,
            categoryId: 0,
            featured: false,
            images: [],
            variants: [
                { color: "", size: "", quantity: 0, differencePrice: 0, images: [] },
            ],
        },
    });

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control,
        name: "variants",
    });

    const handleImagesUploaded = (newImages: UploadedImage[]) => {
        setUploadedImages(newImages);
        // Chỉ lấy URL hoặc preview string
        setValue(
            "images",
            newImages.map((img) => img.url || img.preview)
        );
    };

    const handleFormSubmit = async (data: ProductData) => {
        try {
            // Upload new images if they have file property
            const newImageUrls = await Promise.all(
                uploadedImages
                    .filter((img) => img.file) // Chỉ upload những ảnh mới
                    .map(async (img) => {
                        const fileName = `${img.file!.name}`;
                        const { signedUrl } = await imageApi.getPresignedUrl(fileName);
                        await imageApi.uploadImage(signedUrl, img.file!);
                        return signedUrl.split("?")[0]; // Lấy URL không có query params
                    })
            );

            // Combine existing URLs with new URLs
            const finalImages = [
                ...uploadedImages
                    .filter((img) => !img.file) // Giữ lại những ảnh cũ
                    .map((img) => img.url!),
                ...newImageUrls,
            ];

            // Xử lý variants
            const processedVariants = data.variants.map((variant) => ({
                ...variant,
                id: mode === "edit" ? variant.id || 0 : 0, // Giữ id cũ nếu là edit mode
                images: variant.images.map((img: any) => {
                    if (typeof img === "string") return img;
                    return img.url || img.preview;
                }),
            }));

            const finalProductData = {
                ...data,
                id: mode === "edit" ? data.id : 0,
                images: finalImages,
                variants: processedVariants,
            };

            if (mode === "edit") {
                await updateProductMutation.mutateAsync({
                    id: data.id,
                    data: finalProductData,
                });
            } else {
                await addProductMutation.mutateAsync({
                    data: finalProductData,
                });
            }

            setIsOpen(false);
            reset();
            setUploadedImages([]); // Reset uploaded images
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.message || "Đã có lỗi xảy ra",
            });
        }
    };

    useEffect(() => {
        if (mode === "edit" && product) {
            console.log("product", product);
            // Set uploaded images from existing product
            setUploadedImages(
                // @ts-ignore
                product.images.map((url) => ({
                    url,
                    preview: url,
                    file: null,
                }))
            );

            // Reset form with product data
            reset({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                categoryId: product.categoryId,
                featured: product.featured,
                images: product.images,
                // @ts-ignore
                variants: product.variants.map((variant) => ({
                    ...variant,
                    images: variant.images.map((url) => ({
                        url,
                        preview: url,
                        file: null,
                    })),
                })),
            });
        }
    }, [mode, product, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={mode === "add" ? "default" : "ghost"}
                    className={mode === "add" ? "" : "w-full"}
                >
                    {mode === "add" ? (
                        <PlusCircle className="mr-2 h-4 w-4" />
                    ) : (
                        <Pencil className="mr-2 h-4 w-4" />
                    )}
                    {mode === "add" ? "Thêm sản phẩm" : "Chỉnh sửa"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4 py-3"
                >
                    <div>
                        <Label htmlFor="name">Tên sản phẩm</Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Vui lòng nhập tên sản phẩm" })}
                        />
                        {errors.name && (
                            <p className="text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            {...register("description", {
                                required: "Vui lòng nhập mô tả sản phẩm",
                            })}
                        />
                        {errors.description && (
                            <p className="text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="price">Giá</Label>
                        <Input
                            id="price"
                            type="number"
                            {...register("price", { required: "Vui lòng nhập giá", min: 0 })}
                        />
                        {errors.price && (
                            <p className="text-red-500">{errors.price.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="category">Danh mục</Label>
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: "Vui lòng chọn danh mục" }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.categoryId && (
                            <p className="text-red-500">{errors.categoryId.message}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Controller
                            name="featured"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="featured"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor="featured">Sản phẩm nổi bật</Label>
                    </div>

                    <div>
                        <Label>Hình ảnh sản phẩm</Label>
                        <ImageUpload
                            onImagesUploaded={handleImagesUploaded}
                            existingImages={product?.images || []}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label>Biến thể</Label>
                        {variantFields.map((field, index) => (
                            <div key={field.id} className="border p-4 mt-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`variants.${index}.color`}>Màu sắc</Label>
                                        <Controller
                                            name={`variants.${index}.color`}
                                            control={control}
                                            rules={{ required: "Vui lòng chọn màu sắc" }}
                                            render={({ field: { onChange, value } }) => (
                                                <Select value={value || ""} onValueChange={onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn màu sắc" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COLOR.map((color) => (
                                                            <SelectItem key={color.id} value={color.id}>
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className="w-4 h-4 rounded-full mr-2"
                                                                        style={{ backgroundColor: color.hex }}
                                                                    />
                                                                    {color.name}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.variants?.[index]?.color && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.variants[index]?.color?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor={`variants.${index}.size`}>Kích thước</Label>
                                        <Controller
                                            name={`variants.${index}.size`}
                                            control={control}
                                            rules={{ required: "Vui lòng chọn kích thước" }}
                                            render={({ field: { onChange, value } }) => (
                                                <Select value={value || ""} onValueChange={onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn kích thước" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sizeOptions.map((size) => (
                                                            <SelectItem key={size.value} value={size.value}>
                                                                {size.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.variants?.[index]?.size && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.variants[index]?.size?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor={`variants.${index}.quantity`}>
                                            Số lượng
                                        </Label>
                                        <Input
                                            type="number"
                                            {...register(`variants.${index}.quantity`, {
                                                required: "Vui lòng nhập số lượng",
                                                min: { value: 0, message: "Số lượng không được âm" },
                                            })}
                                        />
                                        {errors.variants?.[index]?.quantity && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.variants[index]?.quantity?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor={`variants.${index}.differencePrice`}>
                                            Chênh lệch giá
                                        </Label>
                                        <Input
                                            type="number"
                                            {...register(`variants.${index}.differencePrice`, {
                                                required: "Vui lòng nhập chênh lệch giá",
                                            })}
                                        />
                                        {errors.variants?.[index]?.differencePrice && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.variants[index]?.differencePrice?.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Label>Hình ảnh</Label>
                                    <Controller
                                        name={`variants.${index}.images`}
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start"
                                                    >
                                                        <Image className="mr-2 h-4 w-4" />
                                                        {field.value.length > 0
                                                            ? `Đã chọn ${field.value.length} ảnh`
                                                            : "Chọn ảnh"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {uploadedImages.map((image: any, imgIndex) => {
                                                            const isSelected = field.value.some(
                                                                (img: any) => {
                                                                    return (
                                                                        (img.url || img.preview || img) ===
                                                                        (image.url || image.preview)
                                                                    );
                                                                }
                                                            );

                                                            return (
                                                                <div
                                                                    key={imgIndex}
                                                                    className={cn(
                                                                        `cursor-pointer relative p-1 rounded-md
                                    transition-all duration-200 ease-in-out`,
                                                                        isSelected
                                                                            ? "border-2 border-primary ring-2 ring-primary/20"
                                                                            : "border border-gray-200 hover:border-gray-300"
                                                                    )}
                                                                    onClick={() => {
                                                                        const newImages = isSelected
                                                                            ? field.value.filter(
                                                                                (img: any) =>
                                                                                    (img.url || img.preview) !==
                                                                                    (image.url || image.preview)
                                                                            )
                                                                            : [...field.value, image];
                                                                        field.onChange(newImages);
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={image.preview}
                                                                        alt={`Ảnh biến thể ${imgIndex + 1}`}
                                                                        className="w-full aspect-[2/3] object-cover rounded"
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeVariant(index)}
                                    className="mt-4"
                                >
                                    Xóa
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={() =>
                                appendVariant({
                                    id: 0,
                                    color: "",
                                    size: "",
                                    quantity: 0,
                                    differencePrice: 0,
                                    images: [],
                                })
                            }
                            className="mt-4"
                        >
                            Thêm
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            addProductMutation.isPending || updateProductMutation.isPending
                        }
                    >
                        {addProductMutation.isPending || updateProductMutation.isPending ? (
                            <span className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </span>
                        ) : mode === "add" ? (
                            "Tạo sản phẩm"
                        ) : (
                            "Cập nhật"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
