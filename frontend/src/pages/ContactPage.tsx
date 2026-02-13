import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import api from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/contact", form);

      toast.success("Message sent successfully 🎉");

      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 max-w-5xl mx-auto">

      <h1 className="text-4xl font-display font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-12">
        We'd love to hear from you. Send us a message anytime.
      </p>

      <div className="grid md:grid-cols-2 gap-12">

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <Label>Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              rows={5}
              required
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {/* ================= INFO ================= */}
        <div className="space-y-6">

          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-accent mt-1" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">
                hi.himanshu21@gmail.com
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-accent mt-1" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-muted-foreground">
                +91 98280 66098
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-accent mt-1" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-muted-foreground">
                Jodhpur, Rajasthan, India
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
