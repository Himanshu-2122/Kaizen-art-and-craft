import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaMenuColumn {
  title: string;
  items: { label: string; href: string; isNew?: boolean }[];
}

export interface MegaMenuFeatured {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  badge?: string;
}

export interface MegaMenuItem {
  label: string;
  href: string;
  isHighlight?: boolean;
  columns?: MegaMenuColumn[];
  children?: { label: string; href: string }[];
  featured?: MegaMenuFeatured;
}

export interface MegaMenuProps {
  item: MegaMenuItem;
  className?: string;
  align?: "left" | "right" | "center";
}

export function MegaMenu({ item, className, align = "left" }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Normalize columns
  const columns: MegaMenuColumn[] = item.columns
    ? item.columns
    : item.children && item.children.length > 0
    ? [
        {
          title: "All " + item.label,
          items: item.children,
        },
      ]
    : [];

  const hasSubmenu = columns.length > 0 || !!item.featured;

  return (
    <div
      ref={menuRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-3 text-[13px] font-semibold transition-all whitespace-nowrap border-b-2",
          open
            ? "text-[#DF6B3B] border-[#DF6B3B] bg-[#F5F5F5]/40"
            : item.isHighlight
            ? "text-[#DF6B3B] border-transparent hover:text-[#C85A2E]"
            : "text-[#323232] border-transparent hover:text-[#DF6B3B] hover:border-[#DF6B3B]"
        )}
      >
        <span>{item.label}</span>
        {hasSubmenu && (
          <ChevronDown
            size={12}
            className={cn(
              "transition-transform duration-200 stroke-[2.5]",
              open ? "rotate-180 text-[#DF6B3B]" : "text-[#757575]"
            )}
          />
        )}
      </Link>

      {/* ── UL MEGA MENU DROPDOWN ── */}
      {open && hasSubmenu && (
        <div
          className={cn(
            "absolute top-full z-[100] bg-white border border-[#E0E0E0] shadow-mega animate-in fade-in slide-in-from-top-1 duration-150 rounded-b-[2px]",
            align === "left" && "left-0",
            align === "right" && "right-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            // Width sizing
            columns.length >= 3 || item.featured ? "w-[760px] lg:w-[880px]" : "w-[300px]"
          )}
        >
          <div className="p-6">
            <div
              className={cn(
                "grid gap-6",
                item.featured
                  ? "grid-cols-[repeat(auto-fit,minmax(160px,1fr))_240px]"
                  : "grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
              )}
            >
              {/* Columns */}
              {columns.map((col, idx) => (
                <div key={idx} className="flex flex-col">
                  <h4 className="text-[12px] font-bold text-[#323232] uppercase tracking-wider pb-2 border-b border-[#E0E0E0] mb-3 flex items-center justify-between">
                    <span>{col.title}</span>
                  </h4>
                  <ul className="space-y-2">
                    {col.items.map((sub, sIdx) => (
                      <li key={sIdx}>
                        <Link
                          to={sub.href}
                          onClick={() => setOpen(false)}
                          className="text-[13px] text-[#666666] hover:text-[#DF6B3B] transition-colors block py-0.5 leading-relaxed group"
                        >
                          <span className="group-hover:translate-x-1 inline-block transition-transform duration-150">
                            {sub.label}
                          </span>
                          {sub.isNew && (
                            <span className="ml-2 text-[10px] bg-[#DF6B3B] text-white px-1.5 py-0.2 rounded-[2px] font-bold">
                              NEW
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Optional Featured Promo Card */}
              {item.featured && (
                <div className="border-l border-[#E0E0E0] pl-6 flex flex-col justify-between">
                  <Link
                    to={item.featured.href}
                    onClick={() => setOpen(false)}
                    className="group block bg-[#F8F1EB] rounded-[2px] p-3 border border-[#E0E0E0] hover:border-[#DF6B3B] transition-all overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] mb-3 bg-[#E0E0E0]/50">
                      <img
                        src={item.featured.image}
                        alt={item.featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.featured.badge && (
                        <span className="absolute top-2 left-2 bg-[#DF6B3B] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-[2px] shadow-xs">
                          {item.featured.badge}
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-[13px] text-[#323232] group-hover:text-[#DF6B3B] transition-colors truncate">
                      {item.featured.title}
                    </h5>
                    {item.featured.subtitle && (
                      <p className="text-[11px] text-[#666666] mt-0.5 truncate">
                        {item.featured.subtitle}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DF6B3B] mt-2 group-hover:underline">
                      Explore Range <ArrowRight size={12} />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Footer bar of MegaMenu */}
          <div className="bg-[#F5F5F5] px-6 py-2.5 border-t border-[#E0E0E0] flex items-center justify-between text-xs">
            <span className="text-[#666666] text-[11px]">
              Guaranteed 100% Solid Wood Craftsmanship
            </span>
            <Link
              to={item.href}
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] flex items-center gap-1 hover:underline"
            >
              <span>View All {item.label}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MegaMenu;