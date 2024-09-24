import React from "react";
import { cn } from "@/utils/cn"; // Assuming you have a utility function for class names

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundImage?: string; // Prop for the background image URL
}

const Button: React.FC<ButtonProps> = ({
  backgroundImage,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-white font-medium rounded shadow-sm hover:bg-opacity-80 transition-colors duration-200",
        !backgroundImage && "hover:bg-blue-500",
        className
      )}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
