import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "green" | "yellow" | "gray" | "blue" | "red" | "stone" | "text";
  disabled?: boolean;
  className?: string;
  icon?: boolean;
}

export function Button({ children, variant, disabled = false, className = "", icon = false, ...props }: ButtonProps) {
  const variantClasses = {
    green: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
    gray: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white",
    yellow: "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white",
    red: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
    stone: "bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-800",
    text: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700",
  };

  let baseClassName = "";
  if (variant === "text" || icon) {
    baseClassName = "cursor-pointer transition-colors duration-200 inline-flex items-center justify-center p-1 rounded";
  } else {
    baseClassName = "cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-200";
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const combinedClassName = [baseClassName, disabledClasses, variant ? variantClasses[variant] : "", className].filter(Boolean).join(" ");

  return (
    <button className={combinedClassName} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
