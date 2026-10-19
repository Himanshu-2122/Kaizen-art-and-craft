import Link from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  items: { label: string; href: string }[];
  className?: string;
}

function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className="flex flex-col sm:flex-row gap-2 text-sm text-[555555] mb-6 sm:mb-8" aria-label="breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-2 h-4 w-4 opacity-60" />
          )}
          {index > 0 ? (
            <span>{item.label}</span>
          ) : (
            <Link to={item.href} className="hover:text-[B5533C] transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

export { Breadcrumbs };