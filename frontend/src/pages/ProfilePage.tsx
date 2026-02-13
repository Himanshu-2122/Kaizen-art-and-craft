import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import  api  from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const profileRes = await api.get("/user/profile");
        setProfile(profileRes.data);

        const orderRes = await api.get("/orders/my");
        setOrders(orderRes.data);
      } catch (error: any) {
        toast.error("Failed to load account data");
      }
    };

    fetchData();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const updateProfile = async () => {
    try {
      setSaving(true);
      await api.put("/user/profile", {
        fullName: profile.fullName,
        phone: profile.phone,
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-16 px-4">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* ================= SIDEBAR ================= */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="
            backdrop-blur-xl
            bg-white/70
            border border-white/40
            shadow-xl
            rounded-3xl
            p-6
            space-y-4
          "
        >
          <h2 className="text-xl font-semibold mb-4">My Account</h2>

          {["profile", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                activeTab === tab
                  ? "bg-black text-white shadow-md"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab === "profile" ? "👤 Profile" : "📦 Orders"}
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
          >
            🚪 Logout
          </button>
        </motion.div>

        {/* ================= CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            md:col-span-3
            backdrop-blur-xl
            bg-white/80
            border border-white/40
            shadow-2xl
            rounded-3xl
            p-10
          "
        >

          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 max-w-md"
            >
              <h2 className="text-3xl font-semibold mb-4">Profile Details</h2>

              <div>
                <Label>Email</Label>
                <Input value={profile.email} disabled />
              </div>

              <div>
                <Label>Full Name</Label>
                <Input
                  value={profile.fullName || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={updateProfile}
                disabled={saving}
                className="rounded-xl"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-semibold mb-8">
                Previous Orders
              </h2>

              {orders.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven't placed any orders yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <motion.div
                      key={o._id}
                      whileHover={{ scale: 1.02 }}
                      className="
                        bg-white
                        border
                        rounded-2xl
                        p-6
                        shadow-lg
                        transition
                      "
                    >
                      <div className="flex justify-between items-center">

                        <div>
                          <p className="font-semibold">
                            Order #{o._id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full ${statusColor(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </div>

                      <p className="mt-4 text-lg font-bold">
                        ₹ {o.total}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
