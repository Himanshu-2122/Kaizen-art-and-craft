import { Link } from "react-router-dom";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  "Company": [
    { label: "About Us",    href: "/about" },
    { label: "Our Story",   href: "/about" },
    { label: "Contact Us",  href: "/contact" },
    { label: "Careers",     href: "/contact" },
  ],
  "Shop": [
    { label: "Wall Art",        href: "/shop?category=wall-art" },
    { label: "Pottery",         href: "/shop?category=pottery" },
    { label: "Textile Crafts",  href: "/shop?category=textile-crafts" },
    { label: "All Products",    href: "/shop" },
    { label: "Collections",     href: "/collections" },
  ],
  "Help": [
    { label: "Track Order",      href: "/profile" },
    { label: "Returns",          href: "/contact" },
    { label: "Shipping Policy",  href: "/contact" },
    { label: "Bulk Orders",      href: "/contact" },
    { label: "Custom Orders",    href: "/contact" },
  ],
  "Account": [
    { label: "My Profile",  href: "/profile" },
    { label: "My Orders",   href: "/profile" },
    { label: "My Wishlist", href: "/wishlist" },
    { label: "My Cart",     href: "/cart" },
  ],
};

const paymentMethods = ["RuPay", "UPI", "VISA", "Mastercard", "PhonePe"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  }

  return (
    <footer className="bg-[#121212] text-white border-t border-[#dedede]/10">
      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10">

          {/* Col 1: Brand + contact + social */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-6 bg-white/10 border border-white/10 p-3 rounded-[4px] hover:border-[#ec7744]/40 transition-colors">
              <img
                src="/kaizenlogo.png"
                alt="Kaizen Livings"
                className="h-12 w-auto object-contain rounded-[2px]"
                draggable={false}
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-[0.2em] text-white leading-none uppercase">
                  Kaizen
                </span>
                <span className="text-[10px] tracking-[0.3em] font-medium text-[#ec7744] uppercase leading-tight mt-0.5">
                  Livings
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-[13px] leading-relaxed mb-6 max-w-[240px]">
              Timeless solid wood furniture and authentic Indian artisan handicrafts designed to elevate modern living.
            </p>

            <div className="space-y-3">
              <a href="tel:+918090926023"
                 className="flex items-center gap-3 text-[13px] text-white/60 hover:text-[#ec7744] transition-colors">
                <Phone size={14} className="shrink-0 text-[#ec7744]" />
                +91 80909 26023
              </a>
              <a href="mailto:hi.kaizenartandcraft2025@gmail.com"
                 className="flex items-center gap-3 text-[13px] text-white/60 hover:text-[#ec7744] transition-colors">
                <Mail size={14} className="shrink-0 text-[#ec7744]" />
                kaizenartandcraft2025@gmail.com
              </a>
              <div className="flex items-start gap-3 text-[13px] text-white/60">
                <MapPin size={14} className="shrink-0 mt-0.5 text-[#ec7744]" />
                Jodhpur, Rajasthan, India
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { label: "Facebook", icon: "FB" },
                { label: "Instagram", icon: "IG" },
                { label: "YouTube", icon: "YT" },
                { label: "Pinterest", icon: "PIN" },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-[4px] bg-white/10 hover:bg-[#ec7744] flex items-center justify-center
                             text-white text-[10px] font-bold transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4 className="font-bold text-white text-[13px] mb-5 uppercase tracking-wider">{col}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-[13px] text-white/60 hover:text-[#ec7744] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-bold text-white text-base mb-1">Stay Inspired with Kaizen</h3>
              <p className="text-white/60 text-xs">
                Subscribe for newly released artisan woodwork, collections, and exclusive private offers.
              </p>
            </div>
            <div>
              {sent ? (
                <div className="p-3 bg-[#fbe4da]/20 border border-[#ec7744]/40 rounded-[4px]">
                  <p className="text-[#ec7744] font-bold text-sm">Thank you for subscribing to Kaizen updates!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-white/5 border border-white/15 px-4 py-2.5 rounded-[4px]
                               text-sm text-white placeholder:text-white/30 outline-none
                               focus:border-[#ec7744] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#ec7744] hover:bg-[#bd5f37] text-white font-medium
                               px-6 py-2.5 rounded-[4px] transition-colors text-sm whitespace-nowrap shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-6 py-5
                        flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Kaizen Art & Craft. All rights reserved. Handcrafted in India.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {paymentMethods.map((pay) => (
              <span
                key={pay}
                className="border border-white/15 px-2.5 py-0.5 rounded-[2px] text-[10px] font-semibold text-white/60 bg-white/5"
              >
                {pay}
              </span>
            ))}
          </div>

          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Shipping & Delivery"].map((p) => (
              <a
                key={p}
                href="#"
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                {p}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
