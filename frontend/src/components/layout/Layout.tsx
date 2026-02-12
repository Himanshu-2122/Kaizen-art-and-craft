import { Outlet } from "react-router-dom";

import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";
import Footer from "./Footer";

export default function Layout() {
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
