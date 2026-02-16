// import { Link } from "react-router-dom";
// import { SITE_NAME } from "@/lib/constants";

// export default function Footer() {
//   return (
//     <footer className="bg-primary text-primary-foreground mt-20">
//       <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
//         <div>
//           <h3 className="text-xl font-display font-bold mb-4">{SITE_NAME}</h3>
//           <p className="text-sm text-primary-foreground/70">Modern furniture for modern living. Crafted with care, designed for you.</p>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
//           <ul className="space-y-2 text-sm text-primary-foreground/70">
//             <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
//             <li><Link to="/collections" className="hover:text-primary-foreground transition-colors">Collections</Link></li>
//           </ul>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Company</h4>
//           <ul className="space-y-2 text-sm text-primary-foreground/70">
//             <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
//             <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
//           </ul>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Support</h4>
//           <ul className="space-y-2 text-sm text-primary-foreground/70">
//             <li>Free Shipping on orders over $500</li>
//             <li>30-day return policy</li>
//             <li>hi.himanshu21@gmail.com</li>
//           </ul>
//         </div>
//       </div>
//       <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/50">
//         © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
//       </div>
//     </footer>
//   );
// }
import { Link } from "react-router-dom";
import { SITE_NAME } from "@/lib/constants";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  ArrowRight,
  Heart
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubscribing(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Thanks for subscribing! 🎉");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#E67235] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#E67235]/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#E67235] mb-4">
              <Send className="h-4 w-4" />
              <span>Stay Updated</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Get exclusive deals, latest products, and design inspiration delivered to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full pl-12 pr-4 py-4 outline-none focus:bg-white/20 focus:border-[#E67235] transition-all duration-300 text-white placeholder:text-gray-400"
                  disabled={isSubscribing}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-gradient-to-r from-[#E67235] to-amber-500 hover:from-[#E67235]/90 hover:to-amber-500/90 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#E67235]/50 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubscribing ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div>
              <img
                src="/images/logo2.png"
                alt={SITE_NAME}
                className="h-16 w-auto object-contain mb-4 brightness-0 invert"
              />
              <h3 className="text-2xl font-bold mb-3">{SITE_NAME}</h3>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              Modern furniture for modern living. Crafted with care, designed for you. Transform your space with our curated collection.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#E67235] transition-all duration-300 hover:scale-110 group"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Shop
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#E67235] to-transparent"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/shop", label: "All Products" },
                { to: "/collections", label: "Collections" },
                { to: "/shop?category=living", label: "Living Room" },
                { to: "/shop?category=bedroom", label: "Bedroom" },
                { to: "/shop?category=dining", label: "Dining" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#E67235] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Company
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#E67235] to-transparent"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/careers", label: "Careers" },
                { to: "/blog", label: "Blog" },
                { to: "/press", label: "Press Kit" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#E67235] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Contact & Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#E67235] to-transparent"></span>
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-[#E67235] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">
                  Jodhpur, Rajasthan, India
                </span>
              </li>
              
              <li className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 text-[#E67235] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="tel:+919828066098"
                  className="hover:text-white transition-colors"
                >
                  +91 98280 66098
                </a>
              </li>
              
              <li className="flex items-center gap-3 group">
                <Mail className="h-5 w-5 text-[#E67235] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:hi.himanshu21@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  hi.himanshu21@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-sm font-semibold text-white mb-2">Business Hours</p>
              <p className="text-sm text-gray-400">Monday - Saturday</p>
              <p className="text-sm text-gray-400">9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="relative border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { text: "Free Shipping", subtext: "On orders over ₹500" },
              { text: "30-Day Returns", subtext: "Money back guarantee" },
              { text: "Secure Payment", subtext: "100% secure checkout" },
              { text: "24/7 Support", subtext: "Dedicated support team" },
            ].map((feature, idx) => (
              <div key={idx} className="group">
                <p className="font-semibold text-white group-hover:text-[#E67235] transition-colors">
                  {feature.text}
                </p>
                <p className="text-sm text-gray-400 mt-1">{feature.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} {SITE_NAME}. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Made with</span>
              <Heart className="h-4 w-4 text-[#E67235] fill-current animate-pulse hidden md:inline" />
              <span className="hidden md:inline">in India</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}