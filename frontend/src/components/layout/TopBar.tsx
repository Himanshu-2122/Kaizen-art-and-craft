import { MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full bg-[#E67235] text-[#2A2A2A] text-sm">
      <div className="container mx-auto flex items-center justify-between h-10 px-4">

        {/* Left side */}
        <div className="flex items-center gap-2">
          <MapPin size={16} />

          <span className="font-medium"></span>

          <button className="bg-white/60 hover:bg-white/80 transition px-3 py-1 rounded-full text-xs font-medium">
            UL Store Banjara Hills ✏️
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <button className="hover:underline">Gift Cards</button>
          <button className="hover:underline">Become a Franchisee</button>
          <button className="hover:underline">Help</button>
        </div>

      </div>
    </div>
  );
}
