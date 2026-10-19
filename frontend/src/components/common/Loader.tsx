import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

function Loader({ className, size = "md" }: LoaderProps) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn(
      "rounded-md bg-[F5F5F5] animate-spin flex items-center justify-center",
      sizeMap[size],
      className
    )} />
  );
}

export { Loader };