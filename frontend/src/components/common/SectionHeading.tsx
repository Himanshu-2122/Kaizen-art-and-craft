import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  className?: string;
}

function SectionHeading({ className }: SectionHeadingProps) {
  const baseClass = "font-display text-[24px] sm:text-[28px] md:text-[32px] font-bold tracking-tight text-[111111] mb-4";
  return (
    <h2 className={cn(baseClass, className)} />
  );
}

export { SectionHeading };