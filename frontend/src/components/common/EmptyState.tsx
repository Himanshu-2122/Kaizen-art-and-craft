import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionOnClick?: () => void;
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionOnClick,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-16 sm:py-20", className)}>
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[F5F5F5] flex items-center justify-center">
        <icon />
      </div>
      <h2 className="font-display text-[2xl] sm:text-[26px] font-bold text-[111111] mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-[15px] text-[555555] leading-[1.8] mb-6">
          {description}
        </p>
      )}
      {actionLabel && (
        <button
          onClick={actionOnClick}
          className={cn(
            "inline-flex items-center gap-2 rounded-md bg-[B5533C] text-white px-4 py-2 text-sm font-medium hover:bg-[E55F20] transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allow"
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export { EmptyState };