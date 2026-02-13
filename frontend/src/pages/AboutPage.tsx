import { Truck, Shield, Hammer, Headphones, Heart, Eye, Target } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "Complimentary shipping on all orders over $500. We deliver furniture safely to your doorstep." },
  { icon: Shield, title: "Secure Payment", desc: "Your transactions are protected with industry-leading 256-bit SSL encryption." },
  { icon: Hammer, title: "Handcrafted Quality", desc: "Each piece is crafted by skilled artisans using premium, sustainably sourced materials." },
  { icon: Headphones, title: "24/7 Support", desc: "Our dedicated team is available around the clock to assist you with any questions." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-primary">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1920&q=80" alt="Workshop" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 text-center text-primary-foreground max-w-2xl px-4">
          <h1 className="text-5xl font-display font-bold mb-4">About Kaizen Art and Craft</h1>
          <p className="text-lg text-primary-foreground/80">Crafting modern furniture with timeless design since 2020.</p>
        </div>
      </section>

      {/* Company Summary */}
      <section className="container py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold mb-6">Who We Are</h2>
        <p className="text-muted-foreground leading-relaxed">
          Kaizen Art and Craft is a modern furniture company dedicated to bringing Scandinavian-inspired design into homes around the world.
          We believe furniture should be beautiful, functional, and accessible. Every piece in our collection is carefully curated
          to blend seamlessly into your lifestyle while making a bold design statement.
        </p>
      </section>

      {/* Features */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-md border bg-card">
              <f.icon className="h-10 w-10 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What We Offer / Commitment / Vision */}
      <section className="bg-secondary py-16">
        <div className="container grid md:grid-cols-3 gap-10">
          {[
            { icon: Heart, title: "What We Offer", text: "A curated selection of premium, design-forward furniture for every room. From sofas to standing desks, each piece is chosen for quality and aesthetics." },
            { icon: Target, title: "Our Commitment", text: "We are committed to sustainable practices, ethical sourcing, and creating products that last. Quality is never compromised." },
            { icon: Eye, title: "Our Vision", text: "To become the leading destination for modern, affordable luxury furniture—making great design accessible to everyone." },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
              <item.icon className="h-8 w-8 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="container py-16 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Get In Touch</h2>
        <p className="text-muted-foreground">Email: hi.himanshu21@gmail.com · Phone: +1 (555) 123-4567</p>
        <p className="text-muted-foreground">123 Design Street, Stockholm, Sweden</p>
      </section>
    </div>
  );
}
