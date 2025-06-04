"use client";

import SizeGuideModal from "@/components/modal/size-guide-dialog";

export default function SizeSelector({
  sizes,
  value,
  setValue,
}: {
  sizes: string[];
  value: string | null;
  setValue: (size: string) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Chọn kích thước</h3>
        <SizeGuideModal />
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`px-4 py-2 border rounded-md ${
              value === size
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            onClick={() => setValue(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
