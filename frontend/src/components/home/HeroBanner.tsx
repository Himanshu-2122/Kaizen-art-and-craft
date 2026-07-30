import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    tag: "Handmade Wall Art",
    headline: "Handcrafted\nWall Masterpieces",
    subline: "Authentic Mandala canvas art, hand-carved Sheesham wooden panels, and Warli tribal frames.",
    ctaPrimary: "Explore Wall Art",
    ctaSecondary: "All Craft Categories",
    ctaHref: "/shop?category=wall-art",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1600&q=80",
  },
  {
    tag: "Jaipur Heritage",
    headline: "Royal Blue Pottery\n& Ceramics",
    subline: "Hand-painted Jaipur ceramic vases, glazed dinnerware sets, and eco-friendly terracotta planters.",
    ctaPrimary: "Explore Pottery",
    ctaSecondary: "All Craft Categories",
    ctaHref: "/shop?category=pottery",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&q=80",
  },
  {
    tag: "Traditional Decor",
    headline: "Decorative 3 & 6\nDaraz Racks",
    subline: "Handcrafted wooden 3-shelf and 6-shelf wall racks adorned with traditional Indian motifs.",
    ctaPrimary: "Shop Wall Racks",
    ctaSecondary: "All Craft Categories",
    ctaHref: "/shop?category=3-daraz",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1600&q=80",
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
    // Outer section: no background of its own — inherits the page/body background
    <section className="relative w-full px-4 sm:px-6 md:px-10 lg:px-14 pt-4 md:pt-6">
      {/* Inner framed box — medium height now instead of 85vh */}
      <div
        className="relative w-full mx-auto overflow-hidden rounded-xl"
        style={{ height: "56vh", minHeight: 380, maxHeight: 560, maxWidth: "1600px" }}
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
              <span className="inline-block bg-[#FF6E31] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 mb-4">
                {slide.tag}
              </span>

              {/* Headline — reduced size to fit the medium banner */}
              <h1 className="font-serif text-white text-[2.4rem] md:text-[3.2rem] lg:text-[3.8rem] font-bold leading-[1.1] tracking-tight mb-4 whitespace-pre-line">
                {slide.headline}
              </h1>

              {/* Subline */}
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                {slide.subline}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={slide.ctaHref}
                  className="inline-flex items-center gap-2 bg-[#FF6E31] hover:bg-[#E55F20]
                             text-white font-bold px-6 py-3 transition-colors text-sm"
                >
                  {slide.ctaPrimary}
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 border border-white/50
                             text-white font-medium px-6 py-3 hover:border-white hover:bg-white/10
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
        <div className="absolute bottom-6 left-6 md:left-14 flex gap-2.5 z-20">
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