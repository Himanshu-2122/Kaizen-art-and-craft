import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  className?: string;
}

function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  disabled = false,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={onDecrement}
        disabled={disabled || value <= 1}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-md border border-[E3D6C3] bg-white hover:border-[B5533C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled && "pointer-events-none"
        )}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span className="w-10 text-center font-bold text-[111111]">{value}</span>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-md border border-[E3D6C3] bg-white hover:border-[B5533C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled && "pointer-events-none"
        )}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M18 9l-6 6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export { QuantityStepper };