import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    tag: "Living Room",
    headline: "Sofas Built\nTo Last",
    subline: "Premium quality sofas, coffee tables and TV units for your perfect living space.",
    ctaPrimary: "Shop Sofas",
    ctaSecondary: "All Categories",
    ctaHref: "/shop?category=sofa",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80",
  },
  {
    tag: "Dining Room",
    headline: "Dine With\nElegance",
    subline: "Handcrafted dining sets that transform every meal into a memorable experience.",
    ctaPrimary: "Shop Dining Sets",
    ctaSecondary: "All Categories",
    ctaHref: "/shop?category=dining-set",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1600&q=80",
  },
  {
    tag: "Work Space",
    headline: "Work Smarter,\nLive Better",
    subline: "Beautifully designed study tables, chest of drawers and workspace furniture.",
    ctaPrimary: "Shop Study Tables",
    ctaSecondary: "All Categories",
    ctaHref: "/shop?category=study-table",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current]);

  function go(idx: number) {
    if (animating || idx === current) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#1a1a1a]"
      style={{ height: "85vh", minHeight: 500 }}
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-14">
          <div
            key={current}
            className="max-w-xl"
            style={{ animation: "hero-slide-up 0.6s ease forwards" }}
          >
            {/* Orange tag label */}
            <span className="inline-block bg-[#FF6E31] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 mb-5">
              {slide.tag}
            </span>

            {/* Headline */}
            <h1 className="font-serif text-white text-[3.2rem] md:text-[4.5rem] lg:text-[5.5rem] font-bold leading-[1.1] tracking-tight mb-5 whitespace-pre-line">
              {slide.headline}
            </h1>

            {/* Subline */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              {slide.subline}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to={slide.ctaHref}
                className="inline-flex items-center gap-2 bg-[#FF6E31] hover:bg-[#E55F20]
                           text-white font-bold px-8 py-3.5 transition-colors text-sm"
              >
                {slide.ctaPrimary}
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border border-white/50
                           text-white font-medium px-8 py-3.5 hover:border-white hover:bg-white/10
                           transition-colors text-sm"
              >
                {slide.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Left/right arrows */}
      <button
        onClick={() => go((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                   w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                   w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot pagination at bottom-left */}
      <div className="absolute bottom-8 left-6 md:left-14 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`transition-all duration-300 ${
              i === current
                ? "bg-[#FF6E31] w-7 h-2"
                : "bg-white/40 hover:bg-white/70 w-2 h-2"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
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
