"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UploadedImage {
  file?: File;
  preview: string;
  url?: string;
}

interface ImageUploadProps {
  onImagesUploaded: (newImages: UploadedImage[]) => void;
  existingImages: string[];
}

export function ImageUpload({
  onImagesUploaded,
  existingImages = [],
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() =>
    existingImages.map((url) => ({ preview: url, url }))
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      onImagesUploaded(updatedImages);
    },
    [uploadedImages, onImagesUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  });

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    // Revoke object URL if it's a new image (has file but no url)
    if (newImages[index].file && !newImages[index].url) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Kéo thả ảnh vào đây, hoặc nhấp để chọn ảnh</p>
      </div>
      <div className="mt-4 grid grid-cols-6 gap-4">
        {uploadedImages.map((image, index) => {
          return (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt={`Uploaded ${index + 1}`}
                className="w-full aspect-[2/3] object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 text-red-500 hover:text-red-600 hover:bg-transparent"
                onClick={() => removeImage(index)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
