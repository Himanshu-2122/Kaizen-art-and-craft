import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-[#F5F5F5] flex items-center justify-center mx-auto mb-6">
          <SearchX size={44} className="text-[#FF6E31]" />
        </div>
        <h1 className="font-serif text-7xl font-black text-[#FF6E31] mb-2">404</h1>
        <h2 className="font-black text-2xl text-[#212121] mb-3">Page Not Found</h2>
        <p className="text-[#666666] text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back to our handcrafted collections.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#FF6E31] text-white font-bold px-8 py-3 hover:bg-[#E55F20] transition-colors"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
