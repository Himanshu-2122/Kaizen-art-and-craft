import { Link } from "react-router-dom";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  const popularSearches = [
    { label: "Beds", href: "/shop" },
    { label: "King Size Bed", href: "/shop" },
    { label: "King Size Bed", href: "/shop?category=beds" },
    { label: "Queen Size Bed", href: "/shop?category=beds" },
    { label: "3 Seater Sofa", href: "/shop?category=sofas" },
    { label: "Lounge Chairs", href: "/shop?category=chairs" },
    { label: "Coffee Table", href: "/shop?category=coffee-tables" },
    { label: "Dining Tables", href: "/shop?category=dining" },
    { label: "TV Entertainment Units", href: "/shop?category=tv-units" },
    { label: "Solid Wood Bookshelves", href: "/shop?category=bookshelves" },
    { label: "Chest of Drawers", href: "/shop?category=chest-of-drawers" },
    { label: "Dressing Vanity Tables", href: "/shop?category=dressing-tables" },
    { label: "Sheesham Wood Furniture", href: "/shop?search=sheesham" },
    { label: "Teak Wood Dining Sets", href: "/shop?category=dining&search=teak" },
    { label: "Accent Dining Chairs", href: "/shop?category=chairs" },
    { label: "Platform Beds with Storage", href: "/shop?category=beds" },
  ];


  const paymentBadges = [
    "VISA",
    "Mastercard",
    "RuPay",
    "UPI / GPay",
    "Net Banking",
    "Cash on Delivery",
  ];

  return (
    <footer className="bg-[#F8F1EB] text-[#323232] border-t border-[#E0E0E0] mt-auto font-sans">
      {/* ── TOP VALUE PROPOSITION BAR (Kaizen Livings Hallmark) ── */}
      <div className="border-b border-[#E0E0E0] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#FBE4DA] text-[#DF6B3B] flex items-center justify-center shrink-0">
                <Award size={20} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#323232]">100% Solid Wood</h4>
                <p className="text-[11px] text-[#666666]">Genuine Sheesham & Teak</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#FBE4DA] text-[#DF6B3B] flex items-center justify-center shrink-0">
                <Truck size={20} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#323232]">Free Pan-India Delivery</h4>
                <p className="text-[11px] text-[#666666]">On all orders above ₹499</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#FBE4DA] text-[#DF6B3B] flex items-center justify-center shrink-0">
                <RefreshCw size={20} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#323232]">Easy 7-Day Returns</h4>
                <p className="text-[11px] text-[#666666]">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#FBE4DA] text-[#DF6B3B] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#323232]">1 Year Warranty</h4>
                <p className="text-[11px] text-[#666666]">Against manufacturing defects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER STRIP ── */}
      <div className="border-b border-[#E0E0E0] bg-[#FFFFFF]/70">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-center">
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#323232]">
                Sign up for exclusive offers and artisan stories
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Receive new collection launches, handcrafted design insights, and member-only discounts.
              </p>
            </div>

            <div>
              {subscribed ? (
                <div className="p-3 bg-[#E9F9ED] border border-[#0FB67E] rounded-[2px] text-xs font-semibold text-[#0FB67E] flex items-center gap-2">
                  <span>✓</span> Thank you for subscribing to Kaizen Livings!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-white border border-[#E0E0E0] px-4 py-2.5 rounded-[2px] text-xs text-[#323232] placeholder:text-[#999999] outline-none focus:border-[#DF6B3B] focus:ring-1 focus:ring-[#DF6B3B] transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-[#DF6B3B] hover:bg-[#C85A2E] active:bg-[#A8441F] text-white px-6 py-2.5 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN MULTI-COLUMN NAVIGATION SECTION (Kaizen Livings) ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Column 1: The Company */}
          <div>
            <h4 className="text-[13px] font-bold text-[#323232] uppercase tracking-wider mb-4 pb-1 border-b border-[#E0E0E0]">
              The Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Our Heritage & Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Master Craftsmen of Jodhpur
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Custom Orders & Bulk Supply
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Careers at Kaizen Livings
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Experience Centers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Useful Links & Support */}
          <div>
            <h4 className="text-[13px] font-bold text-[#323232] uppercase tracking-wider mb-4 pb-1 border-b border-[#E0E0E0]">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/profile" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Solid Wood Care Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop Furniture & Crafts */}
          <div>
            <h4 className="text-[13px] font-bold text-[#323232] uppercase tracking-wider mb-4 pb-1 border-b border-[#E0E0E0]">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=sofas" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Sofas & Recliners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beds" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Beds & Mattresses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dining" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Dining Tables & Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=coffee-tables" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Living Coffee Tables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tv-units" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  TV & Media Consoles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chest-of-drawers" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Chest of Drawers & Storage
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-[#666666] hover:text-[#DF6B3B] transition-colors font-bold text-[#DF6B3B]">
                  Explore All 9 Categories →
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 4: Customer Account */}
          <div>
            <h4 className="text-[13px] font-bold text-[#323232] uppercase tracking-wider mb-4 pb-1 border-b border-[#E0E0E0]">
              My Account
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/profile" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Order History & Status
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  My Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-[#666666] hover:text-[#DF6B3B] transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Head Office */}
          <div>
            <h4 className="text-[13px] font-bold text-[#323232] uppercase tracking-wider mb-4 pb-1 border-b border-[#E0E0E0]">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-[#666666]">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#DF6B3B] shrink-0 mt-0.5" />
                <span>Near Artisan Cluster, Pal Road, Jodhpur, Rajasthan 342001, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#DF6B3B] shrink-0" />
                <a href="tel:+918090926023" className="hover:text-[#DF6B3B] transition-colors">
                  +91 80909 26023
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#DF6B3B] shrink-0" />
                <a href="mailto:kaizenartandcraft2025@gmail.com" className="hover:text-[#DF6B3B] transition-colors truncate">
                  kaizenartandcraft2025@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-[#6B6B6B] pt-1">
                Mon - Sat: 10:00 AM – 7:00 PM IST
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2 pt-2">
                {[
                  { name: "Facebook", code: "FB", href: "https://facebook.com" },
                  { name: "Instagram", code: "IG", href: "https://instagram.com" },
                  { name: "Pinterest", code: "PIN", href: "https://pinterest.com" },
                  { name: "YouTube", code: "YT", href: "https://youtube.com" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-7 h-7 bg-white border border-[#E0E0E0] rounded-[2px] flex items-center justify-center text-[10px] font-bold text-[#666666] hover:bg-[#DF6B3B] hover:text-white hover:border-[#DF6B3B] transition-colors cursor-pointer"
                    title={s.name}
                  >
                    {s.code}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── POPULAR SEARCHES / CATEGORIES (Kaizen Livings) ── */}
        <div className="mt-10 pt-8 border-t border-[#E0E0E0]">
          <h5 className="text-[11px] font-bold text-[#323232] uppercase tracking-wider mb-2.5">
            Popular Furniture & Decor Searches:
          </h5>
          {/* Popular Searches */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#666666] leading-relaxed">
            {popularSearches.map((item, idx) => (
              <span key={`${item.label}-${idx}`} className="inline-flex items-center">
                <Link
                  to={item.href}
                  className="hover:text-[#DF6B3B] transition-colors underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
                {idx < popularSearches.length - 1 && (
                  <span className="text-[#D6DADE] ml-2">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM LEGAL & PAYMENT STRIP (.YgMfd) ── */}
      <div className="border-t border-[#E0E0E0] bg-[#FFFFFF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Kaizen Livings. All rights reserved. Handcrafted Solid Wood Furniture.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {paymentBadges.map((badge) => (
              <span
                key={badge}
                className="bg-[#F5F5F5] border border-[#E0E0E0] px-2 py-0.5 rounded-[2px] text-[10px] font-bold text-[#666666]"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Policy Links */}
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/contact" className="hover:text-[#DF6B3B] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#DF6B3B] transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#DF6B3B] transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
