import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface AnnouncementOffer {
  id: string;
  text: string;
  type: "success" | "info";
}

export const ANNOUNCEMENT_OFFERS: AnnouncementOffer[] = [
  { id: "free-shipping", text: "Free shipping on orders over ₹499", type: "success" },
  { id: "handmade", text: "Handmade in India – support artisans", type: "info" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const handler = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENT_OFFERS.length), 3000);
    return () => clearInterval(handler);
  }, [running]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-[13px]">{ANNOUNCEMENT_OFFERS[index].text}</span>
          <button onClick={() => setRunning(false)} className="text-sm text-gray-500 hover:text-gray-400 transition-colors" aria-label="Dismiss">
            <X className="h-4 w-4" /> Close
          </button>
        </div>
        <div className="flex items-center gap-3">
          {ANNOUNCEMENT_OFFERS.map((offer) => (
            <button key={offer.id} className="text-xs font-medium hover:text-blue-600">
              {offer.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}