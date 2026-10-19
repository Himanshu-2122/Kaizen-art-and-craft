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
    <section className="bg-white border-t border-b border-[#dedede]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#dedede]">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 md:p-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 hover:bg-[#f8f1eb]/30 transition-colors">
                <div className="shrink-0 w-11 h-11 bg-[#fbe4da] rounded-[4px] flex items-center justify-center">
                  <Icon size={20} className="text-[#ec7744]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#121212] mb-1">{f.title}</h3>
                  <p className="text-[12.5px] text-[#7d7d7d] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
