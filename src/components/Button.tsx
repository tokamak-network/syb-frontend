import React from "react";
import { cn } from "@/utils/cn";
import { ImSpinner2 } from "react-icons/im";
import { IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundImage?: string;
  isLoading?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  backgroundImage,
  children,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center px-4 py-2 font-medium rounded shadow-sm hover:bg-opacity-80 transition-colors duration-200",
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
        <ImSpinner2 className="animate-spin text-white" />
      ) : (
        <>
          {LeftIcon && <LeftIcon className="mr-2 flex-shrink-0" size={20} />}{" "}
          <span className="flex-grow">{children}</span>{" "}
          {RightIcon && <RightIcon className="ml-2 flex-shrink-0" size={20} />}{" "}
        </>
      )}
    </button>
  );
};

export default Button;
