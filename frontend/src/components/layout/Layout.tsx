import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* 🔝 Utility strip */}
      <TopBar />

      {/* 🔝 Main header (logo + search + icons) */}
      <MainNavbar />

      {/* 🔽 Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 🔽 Footer */}
      <Footer />

    </div>
  );
}