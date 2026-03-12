import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-hubbay-gold/40 bg-hubbay-gold/10 text-hubbay-gold shadow-sm",
        emerald:
          "border-hubbay-emerald/50 bg-hubbay-emerald/20 text-hubbay-text shadow-sm",
        muted:
          "border-hubbay-secondary/40 bg-hubbay-secondary/10 text-hubbay-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
