"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  colors: string[];
  value: string | null;
  setValue: (value: string | null) => void;
}

export default function ColorSelector({
  colors,
  value,
  setValue,
}: ColorSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Chọn màu</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 relative ${
              value === color ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: color.toLowerCase() }}
            onClick={() => setValue(color)}
            aria-label={color}
          >
            {value === color && (
              <Check
                className={`absolute inset-0 m-auto stroke-2 ${
                  color.toLowerCase() === "white" ||
                  color.toLowerCase() === "#ffffff"
                    ? "text-black"
                    : "text-white"
                }`}
                size={16}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
