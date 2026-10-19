import Link from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

function PageHeader({
  title,
  subtitle,
  actions,
  className,
  asChild = false,
}: PageHeaderProps) {
  const Comp = asChild ? "header" : "header";
  return (
    <Comp className={cn("mb-8", className)} >
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
        <div>
          <h1 className="font-display text-[2xl] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[111111] mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-[15px] text-[555555] leading-[1.8] mb-4">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="mt-4 sm:mt-0 auto-start sm:auto-start">{actions}</div>}
      </div>
    </Comp>
  );
}

export { PageHeader };