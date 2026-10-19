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
}

interface ProductCarouselProps {
  products: Product[];
  className?: string;
  autoplay?: boolean;
  interval?: number;
}

function ProductCarousel({ products, className }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full px-4 sm:px-12", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product._id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-10" />
        <CarouselNext className="hidden sm:flex -right-10" />
      </Carousel>
    </div>
  );
}

export { ProductCarousel };