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
    <footer className="bg-[#2C2C2C] text-white">
      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10">

          {/* Col 1: Brand + contact + social */}
          <div>
            <Link to="/" className="inline-block mb-5 bg-white p-2">
              <img
                src="/kaizenlogo.png"
                alt="Kaizen Art & Craft"
                className="h-24 w-auto object-contain"
                draggable={false}
              />
            </Link>
            <p className="text-white/50 text-[13px] leading-relaxed mb-6 max-w-[220px]">
              Authentic Indian handcraft — celebrating artisans and their timeless traditions.
            </p>

            <div className="space-y-3">
              <a href="tel:+919828066098"
                 className="flex items-center gap-3 text-[13px] text-white/50 hover:text-[#FF6E31] transition-colors">
                <Phone size={14} className="shrink-0" />
                +91 98280 66098
              </a>
              <a href="mailto:hi.himanshu21@gmail.com"
                 className="flex items-center gap-3 text-[13px] text-white/50 hover:text-[#FF6E31] transition-colors">
                <Mail size={14} className="shrink-0" />
                hi.himanshu21@gmail.com
              </a>
              <div className="flex items-start gap-3 text-[13px] text-white/50">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                Jodhpur, Rajasthan, India
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 mt-6">
              {[
                { label: "F", title: "Facebook" },
                { label: "I", title: "Instagram" },
                { label: "Y", title: "YouTube" },
                { label: "P", title: "Pinterest" },
              ].map(({ label, title }) => (
                <a
                  key={title}
                  href="#"
                  aria-label={title}
                  className="w-8 h-8 rounded-full bg-[#FF6E31] flex items-center justify-center
                             text-white text-[11px] font-bold hover:bg-[#E55F20] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4 className="font-bold text-white text-[12px] mb-5 uppercase tracking-wider">{col}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-[13px] text-white/50 hover:text-white transition-colors"
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
        <div className="mt-10 pt-8 border-t border-[#444444]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Stay Updated</h3>
              <p className="text-white/40 text-[12px]">
                Get new arrivals, artisan stories and exclusive offers in your inbox.
              </p>
            </div>
            <div>
              {sent ? (
                <p className="text-[#FF6E31] font-bold text-sm">Subscribed! Thank you.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5
                               text-sm text-white placeholder:text-white/30 outline-none
                               focus:border-[#FF6E31] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF6E31] hover:bg-[#E55F20] text-white font-bold
                               px-5 py-2.5 transition-colors text-sm whitespace-nowrap"
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
      <div className="border-t border-[#444444]">
        <div className="max-w-[1400px] mx-auto px-6 py-4
                        flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} Kaizen Art & Craft. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {paymentMethods.map((pay) => (
              <span
                key={pay}
                className="border border-white/15 px-2 py-0.5 text-[10px] font-bold text-white/30"
              >
                {pay}
              </span>
            ))}
          </div>

          <div className="flex gap-5">
            {["Privacy Policy", "Terms", "Shipping"].map((p) => (
              <a
                key={p}
                href="#"
                className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
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
