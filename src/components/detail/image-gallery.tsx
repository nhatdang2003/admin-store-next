"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main image */}
      <div className="flex-1 order-1 md:order-2">
        <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={images[selectedImage]}
            alt={`${alt} - View ${selectedImage + 1}`}
            fill
            className="object-cover"
            quality={100}
          />
        </div>
      </div>

      {/* Thumbnails - horizontal on mobile, vertical on desktop */}
      <div className="flex md:flex-col order-2 md:order-1 gap-2 overflow-x-auto md:overflow-x-visible p-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 rounded-md overflow-hidden ${
              selectedImage === index
                ? "ring-2 ring-black"
                : "ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            <div className="relative w-14 h-20 lg:w-16 lg:h-24">
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-sm"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
