import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    tag: "Artisan Wooden Living",
    headline: "Handcrafted Solid\nWood Masterpieces",
    subline: "Artisan Sheesham & Teak wood furniture, ergonomic lounge chairs, and carved living room storage.",
    ctaPrimary: "Explore Furniture",
    ctaSecondary: "All Craft Categories",
    ctaHref: "/shop?category=3-daraz",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
  },
  {
    tag: "Designer Craft",
    headline: "Timeless Dining &\nCoffee Tables",
    subline: "Solid oak & elm handcrafted dining sets, carved coffee tables, and contemporary wooden consoles.",
    ctaPrimary: "Shop Tables & Seating",
    ctaSecondary: "All Craft Categories",
    ctaHref: "/shop",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80",
  },
  {
    tag: "Heritage Storage",
    headline: "Decorative 3 & 6\nDaraz Wooden Racks",
    subline: "Handcrafted Sheesham & Teak wood multi-shelf wall racks, cabinets, and artisan storage units.",
    ctaPrimary: "Shop Wooden Racks",
    ctaSecondary: "All Craft Categories",
    ctaHref: "/shop?category=3-daraz",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1600&q=80",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, current]);

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current, go]);

  const slide = slides[current];

  return (
    // Outer section: no background of its own — inherits the page/body background
    <section className="relative w-full px-4 sm:px-6 md:px-10 lg:px-14 pt-3 md:pt-5 pb-2">
      {/* Inner framed box */}
      <div
        className="relative w-full mx-auto overflow-hidden rounded-[4px] border border-[#dedede] shadow-sm"
        style={{
          minHeight: 480,
          maxWidth: "1400px",
        }}
      >
        {/* Slide images */}
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt={s.headline}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Dark gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center py-12 sm:py-0" style={{ minHeight: 480 }}>
          <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 md:px-14">
            <div
              key={current}
              className="max-w-xl"
              style={{ animation: "hero-slide-up 0.6s ease forwards" }}
            >
              {/* Orange tag label: reference #ec7744 badge */}
              <span className="inline-block bg-[#ec7744] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 mb-4 rounded-[2px]">
                {slide.tag}
              </span>

              {/* Headline */}
              <h1 className="text-white text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem] font-bold leading-[1.12] tracking-tight mb-4 whitespace-pre-line">
                {slide.headline}
              </h1>

              {/* Subline */}
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 max-w-md line-clamp-2">
                {slide.subline}
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={slide.ctaHref}
                  className="bg-[#ec7744] hover:bg-[#f09269] active:bg-[#8e4729] text-white font-bold text-sm px-7 py-3 rounded-[4px] shadow-sm transition-all flex items-center gap-2"
                >
                  {slide.ctaPrimary}
                  <span>→</span>
                </Link>
                <Link
                  to="/shop"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-semibold text-sm px-6 py-3 rounded-[4px] transition-all"
                >
                  {slide.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows: reference .rINTw / .uAauI */}
        <button
          onClick={() => go((current - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[4px] bg-white/80 hover:bg-white text-[#121212] flex items-center justify-center shadow-md transition-all z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go((current + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[4px] bg-white/80 hover:bg-white text-[#121212] flex items-center justify-center shadow-md transition-all z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide indicators: reference .Mkr8h / .iVvPI */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={cn(
                "transition-all duration-200 rounded-full",
                i === current ? "w-6 h-2 bg-[#ec7744]" : "w-2 h-2 bg-white/60 hover:bg-white"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hero-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}