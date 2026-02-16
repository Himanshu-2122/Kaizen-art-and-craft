import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

import {
  User,
  Package,
  LogOut,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Edit2,
  Save,
  X,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Heart,
  Settings,
  Bell,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "wishlist" | "settings"
  >("profile");

  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // ✅ WISHLIST STATES
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // ================= LOAD PROFILE + ORDERS =================
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const profileRes = await api.get("/user/profile");
        setProfile(profileRes.data);

        const orderRes = await api.get("/orders/my");
        setOrders(orderRes.data || []);
      } catch {
        toast.error("Failed to load account data");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ================= LOAD WISHLIST =================
  const loadWishlist = async () => {
    try {
      setLoadingWishlist(true);
      const res = await api.get("/wishlist");
      setWishlistItems(res.data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    if (activeTab === "wishlist") {
      loadWishlist();
    }
  }, [activeTab]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  // ================= UPDATE PROFILE =================
  const updateProfile = async () => {
    try {
      setSaving(true);
      await api.put("/user/profile", {
        fullName: profile.fullName,
        phone: profile.phone,
      });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ================= STATUS CONFIG =================
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "completed":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "cancelled":
        return { color: "bg-red-100 text-red-700", icon: XCircle };
      default:
        return { color: "bg-gray-100 text-gray-700", icon: AlertCircle };
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((s, o) => s + (o.total || 0), 0),
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ================= SIDEBAR ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold mb-4">{profile?.fullName}</h3>

            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeTab === tab.id ? "bg-orange-500 text-white" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button onClick={logout} className="mt-4 text-red-500">Logout</button>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="lg:col-span-3">

            <AnimatePresence mode="wait">

              {/* ================= PROFILE ================= */}
              {activeTab === "profile" && (
                <motion.div key="profile" initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="text-2xl font-bold mb-4">Profile</h2>

                  <Input
                    value={profile?.fullName || ""}
                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                    disabled={!isEditing}
                  />

                  <Button onClick={() => setIsEditing(!isEditing)} className="mt-3">
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>

                  {isEditing && (
                    <Button onClick={updateProfile} className="ml-2">Save</Button>
                  )}
                </motion.div>
              )}

              {/* ================= ORDERS ================= */}
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="text-2xl font-bold mb-4">Orders</h2>

                  {orders.map(order => {
                    const StatusIcon = getStatusConfig(order.status).icon;
                    return (
                      <div key={order._id} className="p-4 border rounded mb-3">
                        <StatusIcon className="inline mr-2"/>
                        ₹{order.total}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* ================= WISHLIST ================= */}
              {activeTab === "wishlist" && (
                <motion.div key="wishlist" initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

                  {loadingWishlist ? (
                    <p>Loading wishlist...</p>
                  ) : wishlistItems.length === 0 ? (
                    <p>No items in wishlist</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {wishlistItems.map(item => (
                        <ProductCard key={item._id} product={item.productId}/>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ================= SETTINGS ================= */}
              {activeTab === "settings" && (
                <motion.div key="settings" initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="text-2xl font-bold">Settings</h2>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
