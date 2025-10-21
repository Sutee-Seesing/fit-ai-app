"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

function Dialog({ children, ...props }: Readonly<React.ComponentProps<typeof DialogPrimitive.Root>>) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = ({ children, ...props }: any) => (
  <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>
);

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={"fixed inset-0 bg-black/30" + (className ? ` ${className}` : "")}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={`fixed left-1/2 top-1/2 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg ${className || ''}`}
    {...props}
  >
    {children}
    <DialogPrimitive.Close className="absolute right-3 top-3 rounded opacity-70 hover:opacity-100">
      <X className="w-4 h-4" />
    </DialogPrimitive.Close>
  </DialogPrimitive.Content>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ children, className }: any) => (
  <div className={"flex flex-col " + (className || "")}>{children}</div>
);

const DialogFooter = ({ children, className }: any) => (
  <div className={"flex items-center justify-end gap-2 mt-4 " + (className || "")}>{children}</div>
);

const DialogTitle = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={("text-lg font-medium " + (className || ""))} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<any, any>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={("text-sm text-muted-foreground " + (className || ""))} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

// provide a Close export for convenience
export const DialogClose = DialogPrimitive.Close;

export default Dialog;
