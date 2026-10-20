import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideData {
  tag: string;
  headline: string;
  subline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaHref: string;
  image: string;
  badgeColor?: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    tag: "Mega Furniture Sale",
    headline: "Living Room Luxury &\nContemporary Sofas",
    subline: "Handcrafted 3-seater fabric lounges, chesterfields, and solid wood recliners engineered for enduring comfort.",
    ctaPrimary: "Shop Sofas",
    ctaSecondary: "View Range",
    ctaHref: "/shop?category=sofas",
    image: "/images/banners/hero-sofa.jpg",
  },
  {
    tag: "Master Bedroom Comfort",
    headline: "Solid Teak Wood Beds &\nPlatform Storage",
    subline: "King & Queen size beds in warm honey and walnut finishes, featuring silent acoustic slats and durable joinery.",
    ctaPrimary: "Explore Beds",
    ctaSecondary: "Bedroom Decor",
    ctaHref: "/shop?category=beds",
    image: "/images/banners/hero-bed.jpg",
  },
  {
    tag: "Family Feasts & Dining",
    headline: "Solid Wood Slab &\nMarble Dining Sets",
    subline: "Hand-finished 6-seater dining tables, solid wood benches, and sculpted dining chairs crafted from seasoned timber.",
    ctaPrimary: "Shop Dining Sets",
    ctaSecondary: "Browse Dining",
    ctaHref: "/shop?category=dining",
    image: "/images/banners/hero-dining.jpg",
  },
  {
    tag: "Modern Entertainment",
    headline: "Sleek Media Consoles &\nWall TV Units",
    subline: "Contemporary lowline TV stands with fluted facades and integrated wire management for clean living rooms.",
    ctaPrimary: "Discover TV Units",
    ctaSecondary: "Explore Living",
    ctaHref: "/shop?category=tv-units",
    image: "/images/banners/hero-tv-unit.jpg",
  },
];


export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 25 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Auto-advance every 5 seconds
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5500);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full overflow-hidden bg-[#F5F5F5] border-b border-[#E0E0E0] font-sans">
      <div className="relative w-full" ref={emblaRef}>
        <div className="flex">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] overflow-hidden"
            >
              {/* Background Banner Image */}
              <img
                src={slide.image}
                alt={slide.headline}
                width={1400}
                height={580}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding={index === 0 ? "sync" : "async"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out"
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Gradient Overlay for high readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent sm:to-black/20" />

              {/* Slide Content (Left-aligned Kaizen Livings layout) */}
              <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center">
                <div className="max-w-xl text-white py-8">
                  {/* Category Pill Tag */}
                  <span className="inline-block bg-[#DF6B3B] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-[2px] shadow-xs">
                    {slide.tag}
                  </span>

                  {/* Headline */}
                  <h1 className="text-[28px] sm:text-[38px] md:text-[46px] lg:text-[52px] font-bold text-white leading-[1.15] tracking-tight mb-3 sm:mb-4 whitespace-pre-line">
                    {slide.headline}
                  </h1>

                  {/* Subline */}
                  <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-lg line-clamp-2 sm:line-clamp-3">
                    {slide.subline}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={slide.ctaHref}
                      className="bg-[#DF6B3B] hover:bg-[#C85A2E] active:bg-[#A8441F] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-[2px] shadow-sm transition-all flex items-center gap-2 uppercase tracking-wider"
                    >
                      <span>{slide.ctaPrimary}</span>
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      to="/shop"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs font-semibold text-xs sm:text-sm px-6 py-3 rounded-[2px] transition-all"
                    >
                      {slide.ctaSecondary}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Prev / Next Navigation Arrows (Kaizen Livings ._rrED) ── */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[2px] bg-white/90 hover:bg-white text-[#323232] hover:text-[#DF6B3B] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer border border-[#E0E0E0]/80"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={22} className="stroke-[2]" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[2px] bg-white/90 hover:bg-white text-[#323232] hover:text-[#DF6B3B] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer border border-[#E0E0E0]/80"
        aria-label="Next Slide"
      >
        <ChevronRight size={22} className="stroke-[2]" />
      </button>

      {/* ── Slide Indicator Dots/Pills ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={cn(
              "transition-all duration-300 rounded-full cursor-pointer",
              idx === selectedIndex
                ? "w-7 h-2 bg-[#DF6B3B]"
                : "w-2 h-2 bg-white/60 hover:bg-white"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}