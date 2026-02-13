import { MapPin, Phone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden md:flex w-full bg-[#E67235] text-[#2A2A2A] text-sm">

      <div className="container mx-auto flex items-center justify-between h-10 px-4">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-2">
          <MapPin size={16} />

          <button className="bg-white/70 hover:bg-white transition px-3 py-1 rounded-full text-xs font-medium">
            Jodhpur, Rajasthan, India
          </button>
        </div>


        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-6 text-xs font-medium">

          {/* Phone + Flag */}
          <a
            href="tel:+919828066098"
            className="flex items-center gap-2 hover:underline"
          >
            <img
              src="https://flagcdn.com/w80/in.png"
              alt="India"
              className="w-5 h-4 object-cover rounded-sm"
            />
            <Phone size={14} />
            +91 98280 66098
          </a>


          {/* Gift Cards */}
          <button className="hover:underline">
            Gift Cards
          </button>


          {/* Help Dropdown */}
          <div className="relative group">
            <button className="hover:underline">Help</button>

            <div
              className="
                absolute right-0 top-8 w-64
                bg-white shadow-xl rounded-lg p-4
                text-xs text-gray-700
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-200
                z-[999]
              "
            >
              <p className="font-semibold mb-2 text-sm">Contact Support</p>

              <p>📞 +91 98280 66098</p>
              <p>📧 support@kaizenartcraft.com</p>
              <p>📍 Jodhpur, Rajasthan, India</p>
              <p className="mt-2 text-gray-500">Mon–Sat | 9AM–7PM</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
