import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  mrpPrice?: number;
  discountPercentage?: number;
  className?: string;
  showPercentage?: boolean;
}

function PriceTag({
  price,
  mrpPrice,
  discountPercentage,
  className,
  showPercentage = true,
}: PriceTagProps) {
  const hasDiscount = mrpPrice && mrpPrice > price;
  const computedDiscount = discountPercentage ?? (hasDiscount ? Math.round(((mrpPrice - price) / mrpPrice) * 100) : 0);

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-3xl font-bold text-[111111]">
        ₹{price.toLocaleString("en-IN")}
      </span>
      {hasDiscount && (
        <>
          <span className="text-lg text-[999999] line-through mr-2">
            ₹{mrpPrice.toLocaleString("en-IN")}
          </span>
          {showPercentage && (
            <span className="text-sm font-bold text-[2E7D32]">
              {computedDiscount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}

export { PriceTag };