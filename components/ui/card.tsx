import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/90 p-5 shadow-glow backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
