import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";
import { Button } from "@/components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  title: string;
  content: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  className,
  children,
  title,
  content,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className={cn("fixed inset-0 bg-black bg-opacity-0")} />
      <Dialog.Content
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-6 rounded shadow-lg w-80",
          className
        )}
      >
        <Dialog.Title className="text-lg font-bold mb-4">{title}</Dialog.Title>
        <p className="mb-4">{content}</p>
        <div className="flex space-x-4">{children}</div>
        <Dialog.Close asChild>
          <Button
            className={cn("absolute top-2 right-2")}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};
