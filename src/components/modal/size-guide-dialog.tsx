"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  const sizeGuide = [
    { size: "S", chest: "32-34", waist: "26-28", hips: "34-36" },
    { size: "M", chest: "35-37", waist: "29-31", hips: "37-39" },
    { size: "L", chest: "38-40", waist: "32-34", hips: "40-42" },
    { size: "XL", chest: "41-43", waist: "35-37", hips: "43-45" },
    { size: "XXL", chest: "44-46", waist: "38-40", hips: "46-48" },
    { size: "XXXL", chest: "47-49", waist: "41-43", hips: "49-51" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="text-primary hover:text-primary-dark underline cursor-pointer transition-colors">
          Hướng dẫn
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-primary">
            Hướng dẫn chọn kích thước
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Sử dụng hướng dẫn này để tìm kích thước phù hợp nhất cho bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-primary">
            <div>Kích Thước</div>
            <div>Ngực</div>
            <div>Eo</div>
            <div>Hông</div>
          </div>
          {sizeGuide.map((item, index) => (
            <div
              key={item.size}
              className={`grid grid-cols-4 gap-4 text-sm p-2 rounded-md transition-colors ${
                index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
              } hover:bg-primary/10`}
            >
              <div className="font-medium">{item.size}</div>
              <div>{item.chest}</div>
              <div>{item.waist}</div>
              <div>{item.hips}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-xs text-muted-foreground text-center">
          Đơn vị đo là inch
        </div>
        <DialogClose asChild>
          <button
            type="button"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
