import { Link } from "react-router-dom";
import { ChevronDown, Phone, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const TopBar = () => {
  return (
    <div className="hidden border-b bg-gray-100 lg:block dark:bg-gray-800">
      <div className="container flex h-10 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link
            className="text-xs font-medium hover:underline"
            to="#"
            style={{ textDecoration: "none" }}
          >
            About
          </Link>
          <Link
            className="text-xs font-medium hover:underline"
            to="#"
            style={{ textDecoration: "none" }}
          >
            Contact
          </Link>
          <Link
            className="text-xs font-medium hover:underline"
            to="#"
            style={{ textDecoration: "none" }}
          >
            Help
          </Link>
          <Link
            className="text-xs font-medium hover:underline"
            to="#"
            style={{ textDecoration: "none" }}
          >
            FAQs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 gap-1" variant="ghost">
                <img
                  alt="Flag of United States"
                  className="h-3.5 w-3.5 rounded-full"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "14/9",
                    objectFit: "cover",
                  }}
                  width="14"
                />
                <span className="text-xs">English</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>French</DropdownMenuItem>
              <DropdownMenuItem>German</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 gap-1" variant="ghost">
                <span className="text-xs">USD</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>USD</DropdownMenuItem>
              <DropdownMenuItem>EUR</DropdownMenuItem>
              <DropdownMenuItem>GBP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator className="h-4" orientation="vertical" />
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-xs">+1 234 567 890</span>
          </div>
          <Separator className="h-4" orientation="vertical" />
          <Link
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 gap-1 px-3"
            )}
            to="#"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-xs">Cart (0)</span>
          </Link>
          <Button className="h-8" variant="ghost">
            Sign In
          </Button>
          <Button className="h-8" variant="ghost">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

