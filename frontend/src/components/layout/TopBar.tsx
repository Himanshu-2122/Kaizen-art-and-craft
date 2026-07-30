export default function TopBar() {
  return (
    <div className="bg-[#212121] text-white h-9 flex items-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between">
        {/* Left links */}
        <div className="hidden md:flex items-center gap-4 text-[11px] shrink-0">
          <a href="/shop" className="hover:text-[#FF6E31] transition-colors whitespace-nowrap">Offers</a>
          <span className="text-white/30">|</span>
          <a href="#" className="hover:text-[#FF6E31] transition-colors whitespace-nowrap">Blog</a>
          <span className="text-white/30">|</span>
          <a href="#" className="hover:text-[#FF6E31] transition-colors whitespace-nowrap">Store Locator</a>
          <span className="text-white/30">|</span>
          <a href="#" className="hover:text-[#FF6E31] transition-colors whitespace-nowrap">EMI Available</a>
        </div>

        {/* Center marquee */}
        <div className="flex-1 overflow-hidden text-[11px] text-white/75 mx-4">
          <div
            className="inline-flex whitespace-nowrap"
            style={{ animation: "topbar-marquee 25s linear infinite" }}
          >
            <span className="mx-8">Free Delivery on All Orders</span>
            <span className="mx-2 text-[#FF6E31]">✦</span>
            <span className="mx-8">100% Handcrafted</span>
            <span className="mx-2 text-[#FF6E31]">✦</span>
            <span className="mx-8">Easy Returns within 7 Days</span>
            <span className="mx-2 text-[#FF6E31]">✦</span>
            <span className="mx-8">Free Delivery on All Orders</span>
            <span className="mx-2 text-[#FF6E31]">✦</span>
            <span className="mx-8">100% Handcrafted</span>
            <span className="mx-2 text-[#FF6E31]">✦</span>
            <span className="mx-8">Easy Returns within 7 Days</span>
            <span className="mx-2 text-[#FF6E31]">✦</span>
          </div>
          <style>{`
            @keyframes topbar-marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* Right links */}
        <div className="hidden md:flex items-center gap-4 text-[11px] shrink-0">
          <a href="tel:+919828066098" className="hover:text-[#FF6E31] transition-colors whitespace-nowrap">
            📞 +91 98280 66098
          </a>
        </div>
      </div>
    </div>
  );
}
