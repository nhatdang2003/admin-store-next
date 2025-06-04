"use client";

import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface QuantitySelectorProps {
  initialQuantity: number;
  min: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({
  initialQuantity,
  min,
  max,
  value,
  onChange,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState<string>(
    initialQuantity.toString()
  );

  useEffect(() => {
    if (value) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Chỉ cho phép chuỗi rỗng hoặc số
    if (newValue === "" || /^\d+$/.test(newValue)) {
      const parsedValue = parseInt(newValue);

      if (newValue === "") {
        setInputValue(newValue);
      } else if (!isNaN(parsedValue)) {
        // Nếu giá trị vượt quá max, set về max
        if (max && parsedValue > max) {
          setInputValue(max.toString());
          onChange(max);
        } else {
          setInputValue(newValue);
          onChange(parsedValue);
        }
      }
    }
  };

  const handleBlur = () => {
    let newValue = parseInt(inputValue);

    if (isNaN(newValue) || newValue < min) {
      newValue = min;
    } else if (max && newValue > max) {
      newValue = max;
    }

    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleIncrement = () => {
    if (!max || value < max) {
      const newValue = value + 1;
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
      </button>

      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-20 text-center"
        inputMode="numeric"
        pattern="[0-9]*"
      />

      <button
        onClick={handleIncrement}
        disabled={max ? value >= max : false}
        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
