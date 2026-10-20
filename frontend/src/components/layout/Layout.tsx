import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import MainNavbar from "./MainNavbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:focus-visible:outline-none focus:focus-visible:ring-2 focus:focus-visible:ring-primary"
      >
        Skip to main content
      </a>

      {/* 🔝 Kaizen Livings Unified Header (Top Strip + Main Bar + Category Mega-Menu) */}
      <MainNavbar />

      {/* 🔽 Page content */}
      <main className="flex-1">
        <Outlet id="main-content" />
      </main>

      {/* 🔽 Back to top button */}
      <a
        href="#"
        id="back-to-top"
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-white text-xs font-medium flex items-center justify-center opacity-0 transition-opacity duration-300 shadow-sm shadow-primary/20 hover:bg-secondary focus:outline-none focus:focus-visible:outline-none focus:focus-visible:ring-2 focus:focus-visible:ring-primary"
        title="Back to top"
      >
        ↑
      </a>

      {/* 🔽 Footer */}
      <Footer />

    </div>
  );
}