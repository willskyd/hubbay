"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-gold bg-[length:200%_200%] px-5 py-2.5 text-white shadow-[0_8px_24px_rgba(0,109,79,0.22)] hover:bg-[position:100%_50%] hover:shadow-[0_12px_30px_rgba(212,175,55,0.28)]",
        outline:
          "border border-hubbay-gold/60 bg-hubbay-surface px-5 py-2.5 text-hubbay-text hover:border-hubbay-gold hover:bg-hubbay-emerald/10",
        ghost:
          "px-4 py-2 text-hubbay-secondary hover:bg-hubbay-surface hover:text-hubbay-text",
        danger:
          "border border-hubbay-gold/40 bg-hubbay-emerald/35 px-5 py-2.5 text-hubbay-text hover:bg-hubbay-emerald/55",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
