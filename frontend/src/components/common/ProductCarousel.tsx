import React from "react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrpPrice?: number;
  discountPercentage?: number;
  images?: string[];
  category?: string;
  stock?: number;
  averageRating?: number;
  numReviews?: number;
  materialType?: string;
  finishType?: string;
}

interface ProductCarouselProps {
  products: Product[];
  className?: string;
}

export function ProductCarousel({ products, className }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product._id}
              className="pl-3 md:pl-4 basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[2px] bg-white border border-[#E0E0E0] shadow-md text-[#323232] hover:text-[#DF6B3B] hover:bg-white transition-all cursor-pointer z-10" />
        <CarouselNext className="hidden md:flex -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[2px] bg-white border border-[#E0E0E0] shadow-md text-[#323232] hover:text-[#DF6B3B] hover:bg-white transition-all cursor-pointer z-10" />
      </Carousel>
    </div>
  );
}

export default ProductCarousel;