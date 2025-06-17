"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PromotionBannerProps {
    bannerUrl?: string;
    promotionName: string;
    className?: string;
    width?: number;
    height?: number;
    aspectRatio?: string;
}

export function PromotionBanner({
    bannerUrl,
    promotionName,
    className = "",
    width = 64,
    height = 36,
    aspectRatio = "aspect-[16/9]",
}: PromotionBannerProps) {
    return (
        <div
            className={cn(
                "rounded-md overflow-hidden bg-muted flex items-center justify-center",
                aspectRatio,
                className
            )}
            style={{ width, height }}
        >
            {bannerUrl ? (
                <Image
                    src={bannerUrl}
                    alt={`Banner ${promotionName}`}
                    width={width}
                    height={height}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                        // Fallback khi ảnh lỗi
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                            parent.innerHTML = `<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
                        }
                    }}
                />
            ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
            )}
        </div>
    );
} 