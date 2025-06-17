"use client";

import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (file: File | null) => void;
    onRemove: () => void;
    preview?: string;
    aspectRatio?: string;
    width?: string;
    height?: string;
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    preview,
    aspectRatio = "aspect-[2/3]",
    width = "w-[200px]",
    height,
    className = "",
}: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string>(preview || value);

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file không được vượt quá 5MB");
                return;
            }

            // Kiểm tra loại file
            if (!file.type.startsWith("image/")) {
                alert("Chỉ chấp nhận file hình ảnh");
                return;
            }

            // Tạo preview URL và lưu file
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            onChange(file);

            // Cleanup
            return () => URL.revokeObjectURL(objectUrl);
        },
        [onChange]
    );

    const handleRemove = () => {
        setPreviewUrl("");
        onRemove();
    };

    return (
        <div className={`space-y-4 w-full ${className}`}>
            <div className="flex items-center gap-4">
                {previewUrl && (
                    <div className={`${aspectRatio} relative ${width} ${height || ''} rounded-md overflow-hidden border`}>
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={handleRemove}
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover"
                            fill
                        />
                    </div>
                )}
            </div>
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => document.getElementById("imageInput")?.click()}
                >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {previewUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                </Button>
                <input
                    id="imageInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    );
}
