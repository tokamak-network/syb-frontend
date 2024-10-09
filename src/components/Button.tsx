import React from "react";
import { cn } from "@/utils/cn";
import { ImSpinner2 } from "react-icons/im";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundImage?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  backgroundImage,
  children,
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-white font-medium rounded shadow-sm hover:bg-opacity-80 transition-colors duration-200",
        backgroundImage
          ? "bg-cover bg-center bg-no-repeat"
          : "hover:bg-blue-500",
        isLoading && "cursor-wait",
        className
      )}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <ImSpinner2 className="animate-spin text-white"></ImSpinner2>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
