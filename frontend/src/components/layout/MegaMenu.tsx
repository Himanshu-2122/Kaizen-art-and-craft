import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export type NavChild = { label: string; href: string };
export type MegaMenuItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export type MegaMenuProps = {
  item?: MegaMenuItem;
  items?: MegaMenuItem | MegaMenuItem[];
  className?: string;
};

export function MegaMenu({ item, items, className }: MegaMenuProps) {
  const currentItem = item || (Array.isArray(items) ? items[0] : items);
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

  if (!currentItem) return null;

  return (
    <div
      ref={menuRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center">
        <Link
          to={currentItem.href}
          className="flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium text-[#121212] hover:text-[#ec7744] hover:bg-[#f8f1eb] rounded-[2px] transition-colors whitespace-nowrap"
        >
          {currentItem.label}
          <ChevronDown
            size={13}
            className={cn(
              "transition-transform duration-200",
              open ? "rotate-180 text-[#ec7744]" : "text-[#7d7d7d]"
            )}
          />
        </Link>
      </div>

      {open && currentItem.children && currentItem.children.length > 0 && (
        <div
          className="absolute top-full left-0 w-64 bg-white rounded-[4px] border border-[#dedede] shadow-md z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {currentItem.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-[13px] text-[#121212] hover:bg-[#f8f1eb] hover:text-[#ec7744] transition-colors"
            >
              {child.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-[#f1f1f1] px-4 py-1.5">
            <Link
              to={currentItem.href}
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-[#ec7744] hover:underline flex items-center justify-between"
            >
              <span>View All {currentItem.label}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MegaMenu;