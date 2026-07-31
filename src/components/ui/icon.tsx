import type { ComponentProps } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const iconVariants = cva("shrink-0 [stroke-width:var(--icon-stroke-width)]", {
  variants: {
    size: {
      sm: "size-[var(--icon-size-sm)]",
      md: "size-[var(--icon-size-md)]",
      lg: "size-[var(--icon-size-lg)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type IconProps = Omit<ComponentProps<LucideIcon>, "ref" | "size"> &
  VariantProps<typeof iconVariants> & {
    icon: LucideIcon;
  };

function Icon({ icon: IconComponent, size, className, ...props }: IconProps) {
  return (
    <IconComponent
      data-slot="icon"
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn(iconVariants({ size }), className)}
      {...props}
    />
  );
}

export { Icon };
