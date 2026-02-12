import { Link } from "react-router-dom";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-display font-bold mb-4">{SITE_NAME}</h3>
          <p className="text-sm text-primary-foreground/70">Modern furniture for modern living. Crafted with care, designed for you.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
            <li><Link to="/collections" className="hover:text-primary-foreground transition-colors">Collections</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>Free Shipping on orders over $500</li>
            <li>30-day return policy</li>
            <li>support@Kaizen Art and Craft.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
