export default function TopBar() {
  return (
    <div className="bg-[#121212] text-white h-9 flex items-center overflow-hidden border-b border-white/10 text-xs">
      <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between">
        {/* Left links */}
        <div className="hidden md:flex items-center gap-4 text-[11px] shrink-0 font-medium tracking-wide">
          <a href="/shop" className="hover:text-[#ec7744] transition-colors whitespace-nowrap">Offers</a>
          <span className="text-white/20">|</span>
          <a href="/collections" className="hover:text-[#ec7744] transition-colors whitespace-nowrap">Collections</a>
          <span className="text-white/20">|</span>
          <a href="/about" className="hover:text-[#ec7744] transition-colors whitespace-nowrap">About Us</a>
          <span className="text-white/20">|</span>
          <a href="/contact" className="hover:text-[#ec7744] transition-colors whitespace-nowrap">Support</a>
        </div>

        {/* Center marquee */}
        <div className="flex-1 overflow-hidden text-[11px] text-white/80 mx-4 font-normal">
          <div
            className="inline-flex whitespace-nowrap"
            style={{ animation: "topbar-marquee 25s linear infinite" }}
          >
            <span className="mx-6">Free Pan-India Delivery on Orders Above ₹500</span>
            <span className="text-[#ec7744]">✦</span>
            <span className="mx-6">100% Handcrafted by Master Artisans</span>
            <span className="text-[#ec7744]">✦</span>
            <span className="mx-6">Authentic Indian Handicrafts</span>
            <span className="text-[#ec7744]">✦</span>
            <span className="mx-6">Free Pan-India Delivery on Orders Above ₹500</span>
            <span className="text-[#ec7744]">✦</span>
            <span className="mx-6">100% Handcrafted by Master Artisans</span>
            <span className="text-[#ec7744]">✦</span>
            <span className="mx-6">Authentic Indian Handicrafts</span>
            <span className="text-[#ec7744]">✦</span>
          </div>
          <style>{`
            @keyframes topbar-marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* Right links */}
        <div className="hidden md:flex items-center gap-4 text-[11px] shrink-0 font-medium">
          <a href="tel:+919828066098" className="hover:text-[#ec7744] transition-colors whitespace-nowrap">
            📞 +91 98280 66098
          </a>
        </div>
      </div>
    </div>
  );
}
