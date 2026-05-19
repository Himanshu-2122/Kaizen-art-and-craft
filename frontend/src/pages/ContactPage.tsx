import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/contact", form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#EEEEEE] px-4 py-3 text-sm outline-none transition-colors resize-none " +
    "bg-white text-[#111111] placeholder:text-[#999999] " +
    "focus:border-[#FF6E31] focus:ring-1 focus:ring-[#FF6E31]";

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-[#EEEEEE] py-5 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#555555] mb-2">
            <Link to="/" className="hover:text-[#FF6E31] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111] font-medium">Contact</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#111111]">Contact Us</h1>
          <p className="text-[#555555] text-sm mt-1">
            We'd love to hear from you. Send us a message anytime.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-[340px_1fr] gap-10 items-start">

          {/* ── Info ── */}
          <div className="space-y-5">

            <div className="shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white p-6">
              <h2 className="font-bold text-[#111111] text-lg mb-5">Get In Touch</h2>
              <div className="space-y-5">

                {/* Email */}
                <a href="mailto:hi.himanshu21@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-[#FFF4EE] flex items-center justify-center shrink-0 group-hover:bg-[#FF6E31] transition-colors">
                    <Mail size={18} className="text-[#FF6E31] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">Email</p>
                    <p className="text-sm text-[#111111] font-semibold group-hover:text-[#FF6E31] transition-colors mt-0.5">
                      hi.himanshu21@gmail.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a href="tel:+919828066098" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-[#FFF4EE] flex items-center justify-center shrink-0 group-hover:bg-[#FF6E31] transition-colors">
                    <Phone size={18} className="text-[#FF6E31] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">Phone / WhatsApp</p>
                    <p className="text-sm text-[#111111] font-semibold group-hover:text-[#FF6E31] transition-colors mt-0.5">
                      +91 98280 66098
                    </p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF4EE] flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#FF6E31]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">Address</p>
                    <p className="text-sm text-[#111111] font-semibold mt-0.5">Jodhpur, Rajasthan, India</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF4EE] flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#FF6E31]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">Working Hours</p>
                    <p className="text-sm text-[#111111] font-semibold mt-0.5">Mon – Sat: 10 AM – 7 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-[#111111] p-6 text-center">
              <p className="text-[#FF6E31] font-bold text-lg mb-2">Need it faster?</p>
              <p className="text-white/70 text-sm mb-5">
                Call or WhatsApp us directly to place a custom order or get a quick reply.
              </p>
              <a
                href="tel:+919828066098"
                className="inline-flex items-center gap-2 bg-[#FF6E31] text-white font-bold
                           px-6 py-2.5 hover:bg-[#E55F20] transition-colors text-sm"
              >
                <Phone size={15} />
                Call Now
              </a>
            </div>
          </div>

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-8 space-y-5"
          >
            <h2 className="font-bold text-[#111111] text-xl mb-6">
              Send a Message
            </h2>

            <div>
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wide block mb-1.5">
                Your Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Rahul Sharma"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wide block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="rahul@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wide block mb-1.5">
                Message
              </label>
              <textarea
                rows={6}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your order, product query, or custom request..."
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6E31] text-white font-bold py-3
                         hover:bg-[#E55F20] transition-colors flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
