import React from "react";

interface ScalableStoreLogoProps {
  className?: string;
}

export default function ScalableStoreLogo({
  className = "",
}: ScalableStoreLogoProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {/* Main "EZSTORE" text */}
        <text
          x="50"
          y="23"
          fontSize="24"
          textAnchor="middle"
          fill="black"
          fontFamily="serif"
          fontWeight="bold"
          letterSpacing="-0.05em"
          mask="url(#textMask)"
        >
          EZSTORE
        </text>

        {/* "BY HCMUTE" overlay */}
        <rect
          x="25"
          y="12"
          width="50"
          height="6"
          fill="rgba(229, 229, 229, 0.8)"
        />
        <text
          x="50"
          y="16.5"
          fontSize="4"
          textAnchor="middle"
          fill="black"
          fontFamily="sans-serif"
          letterSpacing="0.5em"
        >
          BY HCMUTE
        </text>
      </svg>
    </div>
  );
}
