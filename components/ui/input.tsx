import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: "standard" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "filled",
      size = "medium",
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      standard:
        "border-b border-neutral-300 bg-transparent !rounded-none focus:border-primary focus:ring-offset-0 focus:ring-0 focus-visible:!ring-0 focus-visible:!outline-none",
      outlined:
        "border border-foreground rounded-lg bg-transparent focus:border-primary focus:ring-offset-0 focus:ring-0 focus-visible:!ring-0 focus-visible:!outline-none",
      filled:
        "bg-sidebar border-none focus:ring-1 focus:ring-neutral-350 dark:bg-neutral-700",
    };

    const sizeClasses = {
      small: "h-8 text-sm px-2 py-1 rounded-sm",
      medium: "h-12 text-base px-3 py-2 rounded-[12px]",
      large: "h-16 !text-desc2 px-12 py-3 rounded-[16px]",
    };

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <div className="relative w-full">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          {...props}
          className={cn(
            "dark:bg-input/30 border-[#F1EFEF]  h-11.25 rounded-[2px] border bg-white px-2.5 py-1 text-base transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-[1px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        />

        {hasRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
