import { Paintbrush, Truck, ShieldCheck, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Paintbrush,
    title: "100% Handcrafted",
    desc: "Every piece made by skilled Indian artisans using traditional techniques.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "Complimentary pan-India shipping on all orders, packed with care.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    desc: "Each product inspected before dispatch. Authentic materials guaranteed.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day hassle-free returns. Shop with complete confidence.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white border-t border-[#EEEEEE] border-b border-b-[#EEEEEE]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#EEEEEE]">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="px-8 py-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
                <div className="shrink-0 w-10 h-10 bg-[#FFF4EE] flex items-center justify-center">
                  <Icon size={20} className="text-[#FF6E31]" />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-bold text-[#111111] mb-1">{f.title}</h3>
                  <p className="text-[13px] text-[#555555] leading-snug">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
