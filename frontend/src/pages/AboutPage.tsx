import { Truck, ShieldCheck, Paintbrush, RotateCcw, Heart, Target, Eye, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Paintbrush,  title: "100% Handcrafted", desc: "Every piece is made by skilled Indian artisans using traditional techniques passed down through generations." },
  { icon: Truck,       title: "Free Delivery",     desc: "Complimentary shipping on all orders across India. Your handcrafted items are carefully packed and insured." },
  { icon: ShieldCheck, title: "Quality Assured",   desc: "Each product is inspected before dispatch. We guarantee authentic materials and genuine handcraft workmanship." },
  { icon: RotateCcw,   title: "Easy Returns",      desc: "Not satisfied? Return within 7 days for a full refund. Shop with complete confidence." },
];

const pillars = [
  {
    icon: Heart,
    title: "What We Offer",
    text: "A curated selection of authentic Indian handcraft — Mandala wall art, Jaipur blue pottery, Phulkari embroidery, Kantha stitch throws, and much more. Each piece is sourced directly from the artisans who made it.",
  },
  {
    icon: Target,
    title: "Our Commitment",
    text: "We are committed to fair trade practices, ethical sourcing, and preserving India's intangible cultural heritage. Every purchase directly supports the artisan who created it.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To become India's most trusted destination for authentic handcrafted art — making traditional Indian craftsmanship accessible to homes and collectors worldwide.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582585758449-75c99c5c4e2c?w=1920&q=80"
          alt="Indian artisan crafting wall art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white max-w-2xl px-6">
          <span className="inline-block bg-[#FF6E31] text-white text-[10px] font-bold tracking-[3px] uppercase px-3 py-1 mb-4">
            Our Story
          </span>
          <h1 className="font-serif text-5xl font-bold mb-4">About Kaizen Art & Craft</h1>
          <p className="text-white/80 text-lg">
            Celebrating India's rich handcraft heritage — one artisan piece at a time.
          </p>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-[11px] font-bold tracking-[3px] text-[#FF6E31] uppercase block mb-3">Who We Are</span>
            <h2 className="font-serif text-4xl text-[#111111] mb-6 leading-snug">
              Bringing India's Craft Heritage to Your Home
            </h2>
            <p className="text-[15px] text-[#555555] leading-[1.9] mb-4">
              Kaizen Art & Craft is a curated marketplace of authentic Indian handcraft products. We
              source directly from artisans across Rajasthan, Punjab, Bengal, and Odisha — ensuring
              fair wages and preserving traditional art forms.
            </p>
            <p className="text-[15px] text-[#555555] leading-[1.9]">
              Our three core categories — Wall Art, Pottery, and Textile Crafts — represent the breadth
              and beauty of India's living craft traditions. Each piece tells a story of skill, culture,
              and generations of artistry.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-[#EEEEEE]">
              {[
                { value: "100%", label: "Handmade" },
                { value: "5",    label: "Craft Traditions" },
                { value: "12+",  label: "Unique Products" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-[#FF6E31]">{value}</div>
                  <div className="text-xs text-[#555555] font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80"
              alt="Blue pottery artisan at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Features / Why Choose Kaizen ── */}
      <section className="bg-[#F8F8F8] py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[3px] text-[#FF6E31] uppercase block mb-2">Why Us</span>
            <h2 className="font-serif text-4xl text-[#111111]">Why Choose Kaizen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="text-center p-6 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all"
              >
                <div className="w-14 h-14 bg-[#FFF4EE] flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-7 w-7 text-[#FF6E31]" />
                </div>
                <h3 className="font-bold text-[#111111] mb-2">{f.title}</h3>
                <p className="text-sm text-[#555555] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision / Commitment / Offering ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="text-center bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all"
            >
              <div className="w-14 h-14 bg-[#FFF4EE] flex items-center justify-center mx-auto mb-5">
                <item.icon className="h-7 w-7 text-[#FF6E31]" />
              </div>
              <h3 className="font-bold text-xl text-[#111111] mb-3">{item.title}</h3>
              <p className="text-sm text-[#555555] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section className="bg-[#111111] text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl text-white mb-3">Get In Touch</h2>
          <p className="text-white/50 text-sm mb-10">We'd love to hear from you</p>
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
            <a
              href="mailto:hi.himanshu21@gmail.com"
              className="flex items-center gap-3 hover:text-[#FF6E31] transition-colors"
            >
              <Mail size={18} className="text-[#FF6E31]" />
              <span>hi.himanshu21@gmail.com</span>
            </a>
            <a
              href="tel:+919828066098"
              className="flex items-center gap-3 hover:text-[#FF6E31] transition-colors"
            >
              <Phone size={18} className="text-[#FF6E31]" />
              <span>+91 98280 66098</span>
            </a>
            <div className="flex items-center gap-3 text-white/70">
              <MapPin size={18} className="text-[#FF6E31]" />
              <span>Jodhpur, Rajasthan, India</span>
            </div>
          </div>
          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-block bg-[#FF6E31] text-white font-bold px-8 py-3
                         hover:bg-[#E55F20] transition-colors"
            >
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
