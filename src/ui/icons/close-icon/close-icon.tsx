import React from "react";

interface CloseIconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const CloseIcon: React.FC<CloseIconProps> = ({ className, size = "1.5rem", color = "white" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
};
