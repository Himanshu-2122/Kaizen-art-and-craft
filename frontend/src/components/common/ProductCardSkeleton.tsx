import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  hasImage?: boolean;
  className?: string;
}

function ProductCardSkeleton({ hasImage = true, className }: ProductCardSkeletonProps) {
  return (
    <div className={cn(
      "rounded-2xl overflow-hidden bg-[F5F5F5]",
      className
    )}>
      {hasImage && (
        <div className="h-48 w-full bg-[E3D6C3] rounded-t-2xl animate-pulse" />
      )}
      <div className="p-4">
        <div className="h-6 w-full rounded bg-[E3D6C3] margin-y-1.5 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-[E3D6C3] mb-2 animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-[E3D6C3] mb-2 animate-pulse" />
      </div>
    </div>
  );
}

export { ProductCardSkeleton };