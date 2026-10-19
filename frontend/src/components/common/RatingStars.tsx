import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  averageRating?: number;
  numReviews?: number;
  size?: number;
  className?: string;
}

function RatingStars({
  averageRating = 0,
  numReviews,
  size = 15,
  className,
}: RatingStarsProps) {
  const roundedRating = Math.round(averageRating);
  const stars: React.ReactNode[] = [];

  for (let i = 1; i <= 5; i++) {
    if (averageRating >= i) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-[D9A441]"
        />
      );
    } else if (averageRating >= i - 0.5) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-[F2D5C7]"
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-[E3D6C3]"
        />
      );
    }
  }

  return (
    <div className="flex gap-0.5">
      {stars}
    </div>
  );
}

export { RatingStars };