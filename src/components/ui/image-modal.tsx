"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
    src: string;
    alt: string;
    children: React.ReactNode;
    className?: string;
}

export function ImageModal({ src, alt, children, className }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className={className}>
                {children}
            </DialogTrigger>
            <DialogContent
                className="max-w-screen max-h-screen w-screen h-screen p-0 border-0 bg-transparent shadow-none"
            >
                <div className="relative w-full h-full flex items-center justify-center bg-black/60">
                    {/* Close Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-white/70 text-white border-0"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-10 w-10" />
                    </Button>

                    {/* Image */}
                    <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
                        <Image
                            src={src}
                            alt={alt}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-full object-contain z-50"
                            priority
                        />
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
} 