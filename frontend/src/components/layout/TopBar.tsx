// import { MapPin, Phone } from "lucide-react";

// export default function TopBar() {
//   return (
//     <div className="hidden md:flex w-full bg-[#E67235] text-[#2A2A2A] text-sm">

//       <div className="container mx-auto flex items-center justify-between h-10 px-4">

//         {/* ================= LEFT ================= */}
//         <div className="flex items-center gap-2">
//           <MapPin size={16} />

//           <button className="bg-white/70 hover:bg-white transition px-3 py-1 rounded-full text-xs font-medium">
//             Jodhpur, Rajasthan, India
//           </button>
//         </div>


//         {/* ================= RIGHT ================= */}
//         <div className="flex items-center gap-6 text-xs font-medium">

//           {/* Phone + Flag */}
//           <a
//             href="tel:+919828066098"
//             className="flex items-center gap-2 hover:underline"
//           >
//             <img
//               src="https://flagcdn.com/w80/in.png"
//               alt="India"
//               className="w-5 h-4 object-cover rounded-sm"
//             />
//             <Phone size={14} />
//             +91 98280 66098
//           </a>


//           {/* Gift Cards */}
//           <button className="hover:underline">
//             Gift Cards
//           </button>


//           {/* Help Dropdown */}
//           <div className="relative group">
//             <button className="hover:underline">Help</button>

//             <div
//               className="
//                 absolute right-0 top-8 w-64
//                 bg-white shadow-xl rounded-lg p-4
//                 text-xs text-gray-700
//                 opacity-0 invisible
//                 group-hover:opacity-100 group-hover:visible
//                 transition-all duration-200
//                 z-[999]
//               "
//             >
//               <p className="font-semibold mb-2 text-sm">Contact Support</p>

//               <p>📞 +91 98280 66098</p>
//               <p>📧 support@kaizenartcraft.com</p>
//               <p>📍 Jodhpur, Rajasthan, India</p>
//               <p className="mt-2 text-gray-500">Mon–Sat | 9AM–7PM</p>
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }
import { MapPin, Phone, Mail, Gift, HelpCircle, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="hidden md:flex w-full bg-gradient-to-r from-[#E67235] via-[#f59e0b] to-[#E67235] text-white text-sm relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>

      <div className="container mx-auto flex items-center justify-between h-10 px-4 relative z-10">
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4">
          {/* Location */}
          <div className="flex items-center gap-2 group">
            <MapPin size={16} className="group-hover:scale-110 transition-transform" />
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 hover:scale-105">
              <span>Jodhpur, Rajasthan, India</span>
            </button>
          </div>

          {/* Offer Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full animate-pulse-glow">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-xs font-semibold">Free Shipping on All Orders!</span>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-6 text-xs font-medium">
          {/* Phone with Flag */}
          <a
            href="tel:+919828066098"
            className="flex items-center gap-2 hover:scale-105 transition-transform group"
          >
            <div className="relative">
              <img
                src="https://flagcdn.com/w80/in.png"
                alt="India"
                className="w-5 h-4 object-cover rounded-sm shadow-sm group-hover:shadow-md transition-shadow"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <Phone size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="group-hover:underline">+91 98280 66098</span>
          </a>

          {/* Business Hours */}
          <div className="hidden xl:flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
            <Clock size={14} />
            <span>Mon-Sat | 9AM-7PM</span>
          </div>

          {/* Gift Cards */}
          <button className="flex items-center gap-1.5 hover:scale-105 transition-transform group">
            <Gift size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="group-hover:underline">Gift Cards</span>
          </button>

          {/* Help Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHelpOpen(true)}
            onMouseLeave={() => setIsHelpOpen(false)}
          >
            <button className="flex items-center gap-1 hover:scale-105 transition-transform">
              <HelpCircle size={14} />
              <span className="hover:underline">Help</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-300 ${
                  isHelpOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`
                absolute right-0 top-10 w-80
                bg-white shadow-2xl rounded-2xl overflow-hidden
                transition-all duration-300 origin-top-right
                ${
                  isHelpOpen
                    ? 'opacity-100 visible scale-100 translate-y-0'
                    : 'opacity-0 invisible scale-95 -translate-y-2'
                }
                z-[999]
              `}
            >
              {/* Dropdown Header */}
              <div className="bg-gradient-to-r from-[#E67235] to-amber-500 p-4 text-white">
                <h3 className="font-bold text-base mb-1">Need Help?</h3>
                <p className="text-xs opacity-90">We're here to assist you</p>
              </div>

              {/* Dropdown Content */}
              <div className="p-4 space-y-3 text-gray-700">
                {/* Contact Options */}
                <a
                  href="tel:+919828066098"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E67235]/20 to-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-[#E67235]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">Call Us</p>
                    <p className="text-xs text-gray-600">+91 98280 66098</p>
                  </div>
                </a>

                <a
                  href="mailto:support@kaizenartcraft.com"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">Email Us</p>
                    <p className="text-xs text-gray-600">support@kaizenartcraft.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <MapPin size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">Visit Us</p>
                    <p className="text-xs text-gray-600">Jodhpur, Rajasthan</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#E67235]" />
                      <span className="font-semibold text-gray-900">Business Hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Open Now</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 pl-6">
                    Monday – Saturday: 9:00 AM – 7:00 PM
                  </p>
                  <p className="text-xs text-gray-500 pl-6">Sunday: Closed</p>
                </div>

                {/* Quick Links */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Quick Links
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/faq"
                      className="text-xs text-gray-600 hover:text-[#E67235] transition-colors"
                    >
                      FAQ
                    </a>
                    <a
                      href="/shipping"
                      className="text-xs text-gray-600 hover:text-[#E67235] transition-colors"
                    >
                      Shipping Info
                    </a>
                    <a
                      href="/returns"
                      className="text-xs text-gray-600 hover:text-[#E67235] transition-colors"
                    >
                      Returns
                    </a>
                    <a
                      href="/warranty"
                      className="text-xs text-gray-600 hover:text-[#E67235] transition-colors"
                    >
                      Warranty
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}