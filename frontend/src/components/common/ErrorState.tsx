import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title: string;
  description?: string;
  retryLabel?: string;
  retryOnClick?: () => void;
  className?: string;
}

function ErrorState({
  title,
  description,
  retryLabel,
  retryOnClick,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("text-center py-16 sm:py-20", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[F5F5F5] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[B5533C]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="font-display text-[2xl] font-bold text-[111111] mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-[555555] mb-6">
          {description}
        </p>
      )}
      {retryLabel && retryOnClick && (
        <button
          onClick={retryOnClick}
          className={cn(
            "inline-flex items-center gap-2 rounded-md bg-[B5533C] text-white px-4 py-2 text-sm font-medium hover:bg-[E55F20] transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allow"
          )}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export { ErrorState };