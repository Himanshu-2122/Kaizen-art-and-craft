import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  percentage: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function DiscountBadge({
  percentage,
  className,
  size = "md",
}: DiscountBadgeProps) {
  return (
    <span className={cn(
      `inline-flex items-center rounded-full bg-[B5533C] text-white text-xs font-bold px-3 py-1.5`,
      size === "sm" && "text-xs py-1",
      size === "lg" && "text-base px-5 py-2.5",
      className
    )}>
      {percentage}% OFF
    </span>
  );
}

export { DiscountBadge };