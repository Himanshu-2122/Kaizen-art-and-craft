// // import { Link, useNavigate } from "react-router-dom";
// // import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
// // import { useCart } from "@/contexts/CartContext";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";

// // const NAV_LINKS = [
// //   { to: "/", label: "Home" },
// //   { to: "/shop", label: "Shop" },
// //   { to: "/collections", label: "Collections" },
// //   { to: "/about", label: "About" },
// //   { to: "/contact", label: "Contact" },
// // ];

// // export default function MainNavbar() {
// //   const [open, setOpen] = useState(false);
// //   const [search, setSearch] = useState("");

// //   const navigate = useNavigate();
// //   const { itemCount } = useCart();
// //   const { user, isAdmin } = useAuth();

// //   /* =============================
// //      SEARCH HANDLER (shared logic)
// //   ============================= */
// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!search.trim()) return;

// //     navigate(`/shop?search=${encodeURIComponent(search)}`);

// //     setSearch("");
// //     setOpen(false); // mobile drawer close
// //   };

// //   return (
// //     <header className="w-full bg-white border-b sticky top-0 z-50">
// //       <div className="container mx-auto flex items-center justify-between gap-6 h-20 px-4">
// //         {/* ================= LOGO ================= */}
// //         <div className="flex-1">
// //           <Link to="/" className="flex items-center">
// //             <img
// //               src="/images/logo2.png"
// //               alt="Kaizen Art and Craft Logo"
// //               className="h-20 w-auto object-contain"
// //             />
// //           </Link>
// //         </div>

// //         {/* ================= DESKTOP LINKS ================= */}
// //         <nav className="hidden lg:flex flex-1 justify-center gap-8 text-sm font-medium">
// //           {NAV_LINKS.map((l) => (
// //             <Link
// //               key={l.to}
// //               to={l.to}
// //               className="text-gray-600 hover:text-[#E67235] transition"
// //             >
// //               {l.label}
// //             </Link>
// //           ))}

// //           {isAdmin && (
// //             <Link to="/admin" className="text-[#E67235] font-semibold">
// //               Admin
// //             </Link>
// //           )}
// //         </nav>

// //         {/* ================= DESKTOP SEARCH ================= */}
// //         <div className="hidden md:block flex-1 max-w-xl relative">
// //           <form onSubmit={handleSearch}>
// //             <Search
// //               size={18}
// //               onClick={handleSearch}
// //               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
// //             />

// //             <input
// //               type="text"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search furniture, decor, sofa..."
// //               className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2.5 outline-none focus:bg-gray-200 transition"
// //             />
// //           </form>
// //         </div>

// //         {/* ================= ICONS ================= */}
// //         <div className="flex items-center gap-6 text-gray-700">
// //           <Link to={user ? "/profile" : "/auth"} className="hover:text-[#E67235]">
// //             <User size={20} />
// //           </Link>

// //           <Link to="/wishlist" className="hover:text-[#E67235]">
// //             <Heart size={20} />
// //           </Link>

// //           <Link to="/cart" className="relative hover:text-[#E67235]">
// //             <ShoppingCart size={20} />
// //             {itemCount > 0 && (
// //               <span className="absolute -top-2 -right-2 bg-[#E67235] text-xs w-5 h-5 rounded-full flex items-center justify-center">
// //                 {itemCount}
// //               </span>
// //             )}
// //           </Link>

// //           {/* Mobile menu button */}
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="lg:hidden"
// //             onClick={() => setOpen(!open)}
// //           >
// //             {open ? <X size={20} /> : <Menu size={20} />}
// //           </Button>
// //         </div>
// //       </div>

// //       {/* ================= MOBILE DRAWER ================= */}
// //       {open && (
// //         <div className="lg:hidden fixed inset-0 z-50">
// //           {/* overlay */}
// //           <div
// //             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
// //             onClick={() => setOpen(false)}
// //           />

// //           {/* drawer */}
// //           <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col animate-slideIn">
// //             {/* header */}
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-lg font-semibold">Menu</h2>
// //               <X
// //                 size={22}
// //                 className="cursor-pointer text-gray-600"
// //                 onClick={() => setOpen(false)}
// //               />
// //             </div>

// //             {/* mobile search */}
// //             <form onSubmit={handleSearch} className="relative mb-6">
// //               <Search
// //                 size={16}
// //                 onClick={handleSearch}
// //                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
// //               />

// //               <input
// //                 type="text"
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //                 placeholder="Search products..."
// //                 className="w-full bg-gray-100 rounded-lg pl-9 pr-3 py-2 outline-none focus:bg-gray-200 transition"
// //               />
// //             </form>

// //             {/* links */}
// //             <nav className="flex flex-col gap-2 text-sm">
// //               {NAV_LINKS.map((l) => (
// //                 <Link
// //                   key={l.to}
// //                   to={l.to}
// //                   onClick={() => setOpen(false)}
// //                   className="px-4 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
// //                 >
// //                   {l.label}
// //                 </Link>
// //               ))}

// //               {isAdmin && (
// //                 <Link
// //                   to="/admin"
// //                   onClick={() => setOpen(false)}
// //                   className="px-4 py-3 rounded-lg bg-[#E67235]/10 text-[#E67235] font-semibold"
// //                 >
// //                   Admin
// //                 </Link>
// //               )}
// //             </nav>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }

// import { Link, useNavigate } from "react-router-dom";
// import { Search, Heart, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { useAuth } from "@/contexts/AuthContext";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";

// const NAV_LINKS = [
//   { to: "/", label: "Home" },
//   { to: "/shop", label: "Shop" },
//   { to: "/collections", label: "Collections" },
//   { to: "/about", label: "About" },
//   { to: "/contact", label: "Contact" },
// ];

// export default function MainNavbar() {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [scrolled, setScrolled] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);

//   const navigate = useNavigate();
//   const { itemCount } = useCart();
//   const { user, isAdmin } = useAuth();

//   // Scroll detection for navbar shadow
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [open]);

//   /* ============================= SEARCH HANDLER ============================= */
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!search.trim()) return;

//     navigate(`/shop?search=${encodeURIComponent(search)}`);

//     setSearch("");
//     setOpen(false);
//     setSearchFocused(false);
//   };

//   return (
//     <>
//       <header
//         className={`w-full bg-white border-b sticky top-0 z-50 transition-all duration-300 ${
//           scrolled ? "shadow-md" : "shadow-sm"
//         }`}
//       >
//         <div className="container mx-auto flex items-center justify-between gap-6 h-20 px-4">
//           {/* ================= LOGO ================= */}
//           <div className="flex-1">
//             <Link to="/" className="flex items-center group">
//               <img
//                 src="/images/logo2.png"
//                 alt="Kaizen Art and Craft Logo"
//                 className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
//               />
//             </Link>
//           </div>

//           {/* ================= DESKTOP LINKS ================= */}
//           <nav className="hidden lg:flex flex-1 justify-center gap-8 text-sm font-medium">
//             {NAV_LINKS.map((l) => (
//               <Link
//                 key={l.to}
//                 to={l.to}
//                 className="relative text-gray-700 hover:text-[#E67235] transition-colors duration-300 py-2 group"
//               >
//                 {l.label}
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E67235] transition-all duration-300 group-hover:w-full"></span>
//               </Link>
//             ))}

//             {isAdmin && (
//               <Link
//                 to="/admin"
//                 className="relative text-[#E67235] font-semibold py-2 group"
//               >
//                 Admin
//                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E67235]"></span>
//               </Link>
//             )}
//           </nav>

//           {/* ================= DESKTOP SEARCH ================= */}
//           <div className="hidden md:block flex-1 max-w-xl">
//             <form onSubmit={handleSearch} className="relative">
//               <div
//                 className={`relative transition-all duration-300 ${
//                   searchFocused ? "scale-105" : "scale-100"
//                 }`}
//               >
//                 <Search
//                   size={18}
//                   onClick={handleSearch}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#E67235] transition-colors"
//                 />

//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                   placeholder="Search furniture, decor, sofa..."
//                   className={`w-full bg-gray-50 rounded-full pl-12 pr-4 py-3 outline-none transition-all duration-300 ${
//                     searchFocused
//                       ? "bg-white ring-2 ring-[#E67235]/30 shadow-lg"
//                       : "hover:bg-gray-100"
//                   }`}
//                 />

//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() => setSearch("")}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* ================= ICONS ================= */}
//           <div className="flex items-center gap-4 text-gray-700">
//             <Link
//               to={user ? "/profile" : "/auth"}
//               className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
//             >
//               <User size={22} />
//               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             </Link>

//             <Link
//               to="/wishlist"
//               className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
//             >
//               <Heart size={22} />
//               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             </Link>

//             <Link
//               to="/cart"
//               className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
//             >
//               <ShoppingCart size={22} />
//               {itemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#E67235] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-bounce-subtle shadow-lg">
//                   {itemCount}
//                 </span>
//               )}
//               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             </Link>

//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden hover:bg-[#E67235]/10 transition-colors"
//               onClick={() => setOpen(!open)}
//             >
//               {open ? <X size={22} /> : <Menu size={22} />}
//             </Button>
//           </div>
//         </div>

//         {/* ================= MOBILE SEARCH BAR (Below Header) ================= */}
//         <div className="md:hidden border-t border-gray-100 px-4 py-3">
//           <form onSubmit={handleSearch} className="relative">
//             <Search
//               size={16}
//               onClick={handleSearch}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search products..."
//               className="w-full bg-gray-50 rounded-full pl-11 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E67235]/30 transition-all"
//             />
//           </form>
//         </div>
//       </header>

//       {/* ================= MOBILE DRAWER ================= */}
//       {open && (
//         <div className="lg:hidden fixed inset-0 z-50">
//           {/* Overlay with blur */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
//             onClick={() => setOpen(false)}
//           />

//           {/* Drawer */}
//           <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col animate-slide-in-right">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-[#E67235] to-[#f59e0b] rounded-full flex items-center justify-center">
//                   <Menu size={20} className="text-white" />
//                 </div>
//                 <h2 className="text-lg font-bold text-gray-900">Menu</h2>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X size={22} className="text-gray-600" />
//               </button>
//             </div>

//             {/* User Info */}
//             {user && (
//               <div className="p-6 bg-gradient-to-br from-[#E67235]/10 to-amber-50 border-b border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
//                     <User size={24} className="text-[#E67235]" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">{user.name || "Guest"}</p>
//                     <p className="text-sm text-gray-600">{user.email}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Links */}
//             <nav className="flex-1 overflow-y-auto p-4">
//               <div className="space-y-1">
//                 {NAV_LINKS.map((l, idx) => (
//                   <Link
//                     key={l.to}
//                     to={l.to}
//                     onClick={() => setOpen(false)}
//                     className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:text-[#E67235] group"
//                     style={{ animationDelay: `${idx * 50}ms` }}
//                   >
//                     <span>{l.label}</span>
//                     <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </Link>
//                 ))}

//                 {isAdmin && (
//                   <Link
//                     to="/admin"
//                     onClick={() => setOpen(false)}
//                     className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#E67235] to-[#f59e0b] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
//                   >
//                     <span>Admin Panel</span>
//                     <ChevronDown className="h-4 w-4 -rotate-90" />
//                   </Link>
//                 )}
//               </div>

//               {/* Quick Links */}
//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
//                   Quick Access
//                 </p>
//                 <div className="space-y-1">
//                   <Link
//                     to="/cart"
//                     onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     <ShoppingCart size={18} className="text-[#E67235]" />
//                     <span className="text-sm font-medium text-gray-700">My Cart</span>
//                     {itemCount > 0 && (
//                       <span className="ml-auto bg-[#E67235] text-white text-xs px-2 py-1 rounded-full">
//                         {itemCount}
//                       </span>
//                     )}
//                   </Link>

//                   <Link
//                     to="/wishlist"
//                     onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     <Heart size={18} className="text-[#E67235]" />
//                     <span className="text-sm font-medium text-gray-700">Wishlist</span>
//                   </Link>

//                   <Link
//                     to={user ? "/profile" : "/auth"}
//                     onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     <User size={18} className="text-[#E67235]" />
//                     <span className="text-sm font-medium text-gray-700">
//                       {user ? "My Account" : "Login / Register"}
//                     </span>
//                   </Link>
//                 </div>
//               </div>
//             </nav>

//             {/* Footer */}
//             <div className="p-6 border-t border-gray-100 bg-gray-50">
//               <p className="text-xs text-gray-500 text-center">
//                 © 2024 Kaizen Art and Craft
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes slide-in-right {
//           from {
//             transform: translateX(100%);
//           }
//           to {
//             transform: translateX(0);
//           }
//         }

//         @keyframes bounce-subtle {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.1);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.2s ease-out;
//         }

//         .animate-slide-in-right {
//           animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .animate-bounce-subtle {
//           animation: bounce-subtle 2s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }import { Link, useNavigate } from "react-router-dom";
// import { Search, Heart, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { useAuth } from "@/contexts/AuthContext";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";

// const NAV_LINKS = [
//   { to: "/", label: "Home" },
//   { to: "/shop", label: "Shop" },
//   { to: "/collections", label: "Collections" },
//   { to: "/about", label: "About" },
//   { to: "/contact", label: "Contact" },
// ];

// export default function MainNavbar() {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [scrolled, setScrolled] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);

//   const navigate = useNavigate();
//   const { itemCount } = useCart();
//   const { user, isAdmin } = useAuth();

//   // Scroll detection for navbar shadow
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [open]);

//   /* ============================= SEARCH HANDLER ============================= */
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!search.trim()) return;

//     navigate(`/shop?search=${encodeURIComponent(search)}`);

//     setSearch("");
//     setOpen(false);
//     setSearchFocused(false);
//   };

//   return (
//     <>
//       <header
//         className={`w-full bg-white border-b sticky top-0 z-50 transition-all duration-300 ${
//           scrolled ? "shadow-md" : "shadow-sm"
//         }`}
//       >
//         <div className="container mx-auto flex items-center justify-between gap-6 h-20 px-4">
//           {/* ================= LOGO ================= */}
//           <div className="flex-1">
//             <Link to="/" className="flex items-center group">
//               <img
//                 src="/images/logo2.png"
//                 alt="Kaizen Art and Craft Logo"
//                 className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
//               />
//             </Link>
//           </div>

//           {/* ================= DESKTOP LINKS ================= */}
//           <nav className="hidden lg:flex flex-1 justify-center gap-8 text-sm font-medium">
//             {NAV_LINKS.map((l) => (
//               <Link
//                 key={l.to}
//                 to={l.to}
//                 className="relative text-gray-700 hover:text-[#E67235] transition-colors duration-300 py-2 group"
//               >
//                 {l.label}
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E67235] transition-all duration-300 group-hover:w-full"></span>
//               </Link>
//             ))}

//             {isAdmin && (
//               <Link
//                 to="/admin"
//                 className="relative text-[#E67235] font-semibold py-2 group"
//               >
//                 Admin
//                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E67235]"></span>
//               </Link>
//             )}
//           </nav>

//           {/* ================= DESKTOP SEARCH ================= */}
//           <div className="hidden md:block flex-1 max-w-xl">
//             <form onSubmit={handleSearch} className="relative">
//               <div
//                 className={`relative transition-all duration-300 ${
//                   searchFocused ? "scale-105" : "scale-100"
//                 }`}
//               >
//                 <Search
//                   size={18}
//                   onClick={handleSearch}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#E67235] transition-colors"
//                 />

//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                   placeholder="Search furniture, decor, sofa..."
//                   className={`w-full bg-gray-50 rounded-full pl-12 pr-4 py-3 outline-none transition-all duration-300 ${
//                     searchFocused
//                       ? "bg-white ring-2 ring-[#E67235]/30 shadow-lg"
//                       : "hover:bg-gray-100"
//                   }`}
//                 />

//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() => setSearch("")}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* ================= ICONS ================= */}
//           <div className="flex items-center gap-4 text-gray-700">
//             <Link
//               to={user ? "/profile" : "/auth"}
//               className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
//             >
//               <User size={22} />
//               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             </Link>

//             <Link
//               to="/wishlist"
//               className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
//             >
//               <Heart size={22} />
//               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             </Link>

//             <Link
//               to="/cart"
//               className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
//             >
//               <ShoppingCart size={22} />
//               {itemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#E67235] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-bounce-subtle shadow-lg">
//                   {itemCount}
//                 </span>
//               )}
//               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             </Link>

//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden hover:bg-[#E67235]/10 transition-colors"
//               onClick={() => setOpen(!open)}
//             >
//               {open ? <X size={22} /> : <Menu size={22} />}
//             </Button>
//           </div>
//         </div>

//         {/* ================= MOBILE SEARCH BAR (Below Header) ================= */}
//         <div className="md:hidden border-t border-gray-100 px-4 py-3">
//           <form onSubmit={handleSearch} className="relative">
//             <Search
//               size={16}
//               onClick={handleSearch}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search products..."
//               className="w-full bg-gray-50 rounded-full pl-11 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E67235]/30 transition-all"
//             />
//           </form>
//         </div>
//       </header>

//       {/* ================= MOBILE DRAWER ================= */}
//       {open && (
//         <div className="lg:hidden fixed inset-0 z-50">
//           {/* Overlay with blur */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
//             onClick={() => setOpen(false)}
//           />

//           {/* Drawer */}
//           <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col animate-slide-in-right">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-[#E67235] to-[#f59e0b] rounded-full flex items-center justify-center">
//                   <Menu size={20} className="text-white" />
//                 </div>
//                 <h2 className="text-lg font-bold text-gray-900">Menu</h2>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X size={22} className="text-gray-600" />
//               </button>
//             </div>

//             {/* User Info */}
//             {user && (
//               <div className="p-6 bg-gradient-to-br from-[#E67235]/10 to-amber-50 border-b border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
//                     <User size={24} className="text-[#E67235]" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">{user.name || "Guest"}</p>
//                     <p className="text-sm text-gray-600">{user.email}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Links */}
//             <nav className="flex-1 overflow-y-auto p-4">
//               <div className="space-y-1">
//                 {NAV_LINKS.map((l, idx) => (
//                   <Link
//                     key={l.to}
//                     to={l.to}
//                     onClick={() => setOpen(false)}
//                     className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:text-[#E67235] group"
//                     style={{ animationDelay: `${idx * 50}ms` }}
//                   >
//                     <span>{l.label}</span>
//                     <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </Link>
//                 ))}

//                 {isAdmin && (
//                   <Link
//                     to="/admin"
//                     onClick={() => setOpen(false)}
//                     className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#E67235] to-[#f59e0b] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
//                   >
//                     <span>Admin Panel</span>
//                     <ChevronDown className="h-4 w-4 -rotate-90" />
//                   </Link>
//                 )}
//               </div>

//               {/* Quick Links */}
//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
//                   Quick Access
//                 </p>
//                 <div className="space-y-1">
//                   <Link
//                     to="/cart"
//                     onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     <ShoppingCart size={18} className="text-[#E67235]" />
//                     <span className="text-sm font-medium text-gray-700">My Cart</span>
//                     {itemCount > 0 && (
//                       <span className="ml-auto bg-[#E67235] text-white text-xs px-2 py-1 rounded-full">
//                         {itemCount}
//                       </span>
//                     )}
//                   </Link>

//                   <Link
//                     to="/wishlist"
//                     onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     <Heart size={18} className="text-[#E67235]" />
//                     <span className="text-sm font-medium text-gray-700">Wishlist</span>
//                   </Link>

//                   <Link
//                     to={user ? "/profile" : "/auth"}
//                     onClick={() => setOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     <User size={18} className="text-[#E67235]" />
//                     <span className="text-sm font-medium text-gray-700">
//                       {user ? "My Account" : "Login / Register"}
//                     </span>
//                   </Link>
//                 </div>
//               </div>
//             </nav>

//             {/* Footer */}
//             <div className="p-6 border-t border-gray-100 bg-gray-50">
//               <p className="text-xs text-gray-500 text-center">
//                 © 2024 Kaizen Art and Craft
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes slide-in-right {
//           from {
//             transform: translateX(100%);
//           }
//           to {
//             transform: translateX(0);
//           }
//         }

//         @keyframes bounce-subtle {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.1);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.2s ease-out;
//         }

//         .animate-slide-in-right {
//           animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .animate-bounce-subtle {
//           animation: bounce-subtle 2s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function MainNavbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();

  // Scroll detection for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  /* ============================= SEARCH HANDLER ============================= */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(search)}`);

    setSearch("");
    setOpen(false);
    setSearchFocused(false);
  };

  return (
    <>
      <header
        className={`w-full bg-white border-b sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-6 h-20 px-4">
          {/* ================= LOGO ================= */}
          <div className="flex-1">
            <Link to="/" className="flex items-center group">
              <img
                src="/images/logo2.png"
                alt="Kaizen Art and Craft Logo"
                className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* ================= DESKTOP LINKS ================= */}
          <nav className="hidden lg:flex flex-1 justify-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="relative text-gray-700 hover:text-[#E67235] transition-colors duration-300 py-2 group"
              >
                {l.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E67235] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="relative text-[#E67235] font-semibold py-2 group"
              >
                Admin
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E67235]"></span>
              </Link>
            )}
          </nav>

          {/* ================= DESKTOP SEARCH ================= */}
          <div className="hidden md:block flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`relative transition-all duration-300 ${
                  searchFocused ? "scale-105" : "scale-100"
                }`}
              >
                <Search
                  size={18}
                  onClick={handleSearch}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#E67235] transition-colors"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search furniture, decor, sofa..."
                  className={`w-full bg-gray-50 rounded-full pl-12 pr-4 py-3 outline-none transition-all duration-300 ${
                    searchFocused
                      ? "bg-white ring-2 ring-[#E67235]/30 shadow-lg"
                      : "hover:bg-gray-100"
                  }`}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ================= ICONS ================= */}
          <div className="flex items-center gap-4 text-gray-700">
            <Link
              to={user ? "/profile" : "/auth"}
              className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
            >
              <User size={22} />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            {/* WISHLIST */}
            <Link to="/wishlist" className="relative">
              <Heart size={22} />

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E67235] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:text-[#E67235] transition-all duration-300 hover:scale-110 group"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E67235] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-bounce-subtle shadow-lg">
                  {itemCount}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E67235] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-[#E67235]/10 transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>

        {/* ================= MOBILE SEARCH BAR (Below Header) ================= */}
        <div className="md:hidden border-t border-gray-100 px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={16}
              onClick={handleSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-50 rounded-full pl-11 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#E67235]/30 transition-all"
            />
          </form>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay with blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#E67235] to-[#f59e0b] rounded-full flex items-center justify-center">
                  <Menu size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={22} className="text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-6 bg-gradient-to-br from-[#E67235]/10 to-amber-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <User size={24} className="text-[#E67235]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.name || "Guest"}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {NAV_LINKS.map((l, idx) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:text-[#E67235] group"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span>{l.label}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#E67235] to-[#f59e0b] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span>Admin Panel</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                )}
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                  Quick Access
                </p>
                <div className="space-y-1">
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <ShoppingCart size={18} className="text-[#E67235]" />
                    <span className="text-sm font-medium text-gray-700">
                      My Cart
                    </span>
                    {itemCount > 0 && (
                      <span className="ml-auto bg-[#E67235] text-white text-xs px-2 py-1 rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <Heart size={18} className="text-[#E67235]" />
                    <span className="text-sm font-medium text-gray-700">
                      Wishlist
                    </span>
                  </Link>

                  <Link
                    to={user ? "/profile" : "/auth"}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <User size={18} className="text-[#E67235]" />
                    <span className="text-sm font-medium text-gray-700">
                      {user ? "My Account" : "Login / Register"}
                    </span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                © 2024 Kaizen Art and Craft
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
