import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import {
  User, Package, LogOut, Mail, Phone, Edit2, Save, X,
  Heart, Settings, Clock, CheckCircle, XCircle, AlertCircle,
  ShoppingBag, IndianRupee, ChevronRight, Shield, Bell,
  Trash2, MapPin,
} from "lucide-react";

type Tab = "profile" | "orders" | "wishlist" | "settings";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "" });

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  /* ── Load profile + orders ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      setDataLoading(true);
      try {
        const [profileRes, orderRes] = await Promise.all([
          api.get("/user/profile"),
          api.get("/orders/my"),
        ]);
        setProfile(profileRes.data);
        setEditForm({ fullName: profileRes.data.fullName, phone: profileRes.data.phone || "" });
        setOrders(orderRes.data || []);
      } catch {
        toast.error("Failed to load account data");
      } finally {
        setDataLoading(false);
      }
    })();
  }, [user]);

  /* ── Load wishlist on tab switch ── */
  useEffect(() => {
    if (activeTab !== "wishlist") return;
    (async () => {
      setWishlistLoading(true);
      try {
        const res = await api.get("/wishlist");
        setWishlistItems(res.data);
      } catch {
        toast.error("Failed to load wishlist");
      } finally {
        setWishlistLoading(false);
      }
    })();
  }, [activeTab]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  /* ── Update profile ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/user/profile", editForm);
      setProfile((p: any) => ({ ...p, ...res.data }));
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditForm({ fullName: profile.fullName, phone: profile.phone || "" });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast.error("All password fields are required"); return;
    }
    if (pwForm.next.length < 8) {
      toast.error("New password must be at least 8 characters"); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match"); return;
    }
    setPwSaving(true);
    try {
      await api.put("/user/change-password", {
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      toast.success("Password changed successfully");
      setPwForm({ current: "", next: "", confirm: "" });
      setShowPwForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  const stats = [
    { icon: Package,     label: "Total Orders",  value: orders.length,
      color: "text-[#FF6E31]", bg: "bg-[#FFF4EE]" },
    { icon: IndianRupee, label: "Total Spent",
      value: `₹${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString("en-IN")}`,
      color: "text-green-600", bg: "bg-green-50" },
    { icon: ShoppingBag, label: "Wishlist Items", value: wishlistItems.length || "—",
      color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const navTabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "profile",  label: "My Profile",  icon: User },
    { id: "orders",   label: "My Orders",   icon: Package,  count: orders.length },
    { id: "wishlist", label: "Wishlist",     icon: Heart },
    { id: "settings", label: "Settings",    icon: Settings },
  ];

  const initials = (profile?.fullName || user.fullName || "U")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Stats row ── */}
        {!dataLoading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center ${bg} shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-xs text-[#555555] font-medium">{label}</p>
                  <p className="text-xl font-black text-[#111111] mt-0.5 leading-none">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ── SIDEBAR ── */}
          <aside className="space-y-4">
            {/* Avatar card */}
            <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 text-center">
              <div className="w-20 h-20 bg-[#FF6E31] flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
                {initials}
              </div>
              <h3 className="font-black text-[#111111] text-lg leading-tight">
                {profile?.fullName || user.fullName}
              </h3>
              <p className="text-xs text-[#555555] mt-1">{user.email}</p>
              {user.role === "admin" && (
                <span className="inline-block mt-3 px-3 py-1 bg-[#FFF4EE] text-[#FF6E31] text-[11px] font-bold tracking-wide uppercase border border-[#FF6E31]/20">
                  Admin
                </span>
              )}
            </div>

            {/* Nav tabs */}
            <nav className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-2 space-y-1">
              {navTabs.map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all ${
                    activeTab === id
                      ? "bg-[#FF6E31] text-white"
                      : "text-[#555555] hover:bg-[#FFF4EE] hover:text-[#FF6E31]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {label}
                  </span>
                  {count != null && count > 0 && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 ${activeTab === id ? "bg-white/20 text-white" : "bg-[#FFF4EE] text-[#FF6E31]"}`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}

              <div className="border-t border-[#EEEEEE] pt-2 mt-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* ── CONTENT ── */}
          <main>
            {dataLoading ? (
              <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-12 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FF6E31]/30 border-t-[#FF6E31] rounded-full animate-spin" />
              </div>
            ) : (
              <div>

                {/* ── PROFILE TAB ── */}
                {activeTab === "profile" && (
                  <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEEE]">
                      <div>
                        <h2 className="text-xl font-black text-[#111111]">Personal Information</h2>
                        <p className="text-xs text-[#555555] mt-0.5">Manage your account details</p>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#FFF4EE] text-[#FF6E31] text-sm font-bold hover:bg-[#FF6E31] hover:text-white transition-colors"
                        >
                          <Edit2 size={15} /> Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 border border-[#EEEEEE] text-[#555555] text-sm font-semibold hover:bg-[#F5F5F5] transition-colors">
                            <X size={14} /> Cancel
                          </button>
                          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-[#FF6E31] text-white text-sm font-bold hover:bg-[#E55F20] transition-colors disabled:opacity-60">
                            <Save size={14} /> {saving ? "Saving…" : "Save"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-5">
                      <ProfileField
                        icon={User} label="Full Name"
                        editing={isEditing}
                        value={isEditing ? editForm.fullName : profile?.fullName}
                        onChange={(v) => setEditForm((f) => ({ ...f, fullName: v }))}
                      />
                      <ProfileField
                        icon={Mail} label="Email Address"
                        value={profile?.email}
                        editing={false}
                        readOnly
                      />
                      <ProfileField
                        icon={Phone} label="Phone Number"
                        editing={isEditing}
                        value={isEditing ? editForm.phone : (profile?.phone || "Not added")}
                        onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                        type="tel"
                      />
                      {profile?.username && (
                        <ProfileField
                          icon={User} label="Username"
                          value={`@${profile.username}`}
                          editing={false}
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* ── ORDERS TAB ── */}
                {activeTab === "orders" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-[#111111]">Order History</h2>
                      <span className="text-sm text-[#555555]">{orders.length} orders</span>
                    </div>

                    {orders.length === 0 ? (
                      <EmptyState
                        icon={Package}
                        title="No orders yet"
                        desc="Start shopping to see your orders here"
                        action={{ label: "Browse Products", to: "/shop" }}
                      />
                    ) : (
                      orders.map((order) => {
                        const { badge, icon: StatusIcon } = orderStatusConfig(order.status);
                        return (
                          <div key={order._id} className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEEEEE]">
                              <div>
                                <p className="text-xs text-[#999999] font-medium">ORDER ID</p>
                                <p className="font-black text-[#111111] text-sm mt-0.5 font-mono">
                                  #{order._id?.slice(-8).toUpperCase()}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${badge}`}>
                                  <StatusIcon size={12} />
                                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                </span>
                                <span className="text-lg font-black text-[#111111]">
                                  ₹{(order.total || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>

                            {order.items?.length > 0 && (
                              <div className="px-5 py-3 space-y-2">
                                {order.items.slice(0, 3).map((item: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-[#555555] truncate max-w-[220px]">{item.name}</span>
                                    <span className="text-[#111111] font-semibold shrink-0 ml-4">
                                      ₹{(item.price * item.quantity).toLocaleString("en-IN")} × {item.quantity}
                                    </span>
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <p className="text-xs text-[#999999]">
                                    +{order.items.length - 3} more items
                                  </p>
                                )}
                              </div>
                            )}

                            {order.shippingAddress && (
                              <div className="flex items-center gap-2 px-5 py-3 bg-[#F5F5F5] border-t border-[#EEEEEE]">
                                <MapPin size={13} className="text-[#999999] shrink-0" />
                                <p className="text-xs text-[#555555] truncate">
                                  {typeof order.shippingAddress === "object"
                                    ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip].filter(Boolean).join(", ")
                                    : order.shippingAddress}
                                </p>
                              </div>
                            )}

                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ── WISHLIST TAB ── */}
                {activeTab === "wishlist" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-[#111111]">My Wishlist</h2>

                    {wishlistLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white border border-[#EEEEEE] aspect-[3/4] animate-pulse" />
                        ))}
                      </div>
                    ) : wishlistItems.length === 0 ? (
                      <EmptyState
                        icon={Heart}
                        title="Your wishlist is empty"
                        desc="Save products you love and find them here later"
                        action={{ label: "Discover Products", to: "/shop" }}
                      />
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {wishlistItems.map((item) =>
                          item.productId ? (
                            <ProductCard key={item._id} product={item.productId} />
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── SETTINGS TAB ── */}
                {activeTab === "settings" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-[#111111]">Account Settings</h2>

                    <SettingsCard icon={Bell} title="Notifications" desc="Manage how you receive updates">
                      {[
                        { label: "Order updates", sub: "Track your order status" },
                        { label: "Promotions & offers", sub: "Get the best deals first" },
                        { label: "Wishlist restocks", sub: "Know when saved items are back" },
                      ].map(({ label, sub }) => (
                        <ToggleRow key={label} label={label} sub={sub} />
                      ))}
                    </SettingsCard>

                    <SettingsCard icon={Shield} title="Security" desc="Manage your account security">
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowPwForm((s) => !s)}
                          className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F5] transition-colors text-sm"
                        >
                          <span className="text-[#111111] font-semibold">Change Password</span>
                          <ChevronRight size={16} className={`text-[#999999] transition-transform ${showPwForm ? "rotate-90" : ""}`} />
                        </button>

                        {showPwForm && (
                          <div className="bg-[#F5F5F5] p-4 space-y-3">
                            {(["current", "next", "confirm"] as const).map((field) => (
                              <div key={field}>
                                <label className="text-[10px] font-bold text-[#999999] uppercase tracking-wide mb-1 block">
                                  {field === "current" ? "Current Password"
                                    : field === "next" ? "New Password"
                                    : "Confirm New Password"}
                                </label>
                                <input
                                  type="password"
                                  value={pwForm[field]}
                                  onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                                  className="w-full border border-[#EEEEEE] bg-white px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#FF6E31]"
                                />
                              </div>
                            ))}
                            <button
                              onClick={handleChangePassword}
                              disabled={pwSaving}
                              className="w-full bg-[#FF6E31] text-white text-sm font-bold py-2.5 hover:bg-[#E55F20] transition-colors disabled:opacity-60"
                            >
                              {pwSaving ? "Saving…" : "Update Password"}
                            </button>
                          </div>
                        )}
                      </div>
                    </SettingsCard>

                    <div className="bg-white border-2 border-red-200 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-red-50 flex items-center justify-center">
                          <Trash2 size={16} className="text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111111] text-sm">Danger Zone</h3>
                          <p className="text-xs text-[#999999]">Irreversible actions</p>
                        </div>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full py-3 border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut size={15} /> Sign Out of Account
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════ */

function ProfileField({
  icon: Icon, label, value, editing, onChange, type = "text", readOnly = false,
}: {
  icon: React.ElementType; label: string; value: string; editing: boolean;
  onChange?: (v: string) => void; type?: string; readOnly?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#F5F5F5]">
      <div className="w-9 h-9 bg-[#FFF4EE] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={16} className="text-[#FF6E31]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#999999] uppercase tracking-wider mb-1">{label}</p>
        {editing && !readOnly ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-white border border-[#EEEEEE] px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#FF6E31] transition-colors"
          />
        ) : (
          <p className={`text-sm font-semibold ${readOnly ? "text-[#999999]" : "text-[#111111]"}`}>
            {value || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }: {
  icon: React.ElementType; title: string; desc: string;
  action: { label: string; to: string };
}) {
  return (
    <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-[#FFF4EE] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#FF6E31]" />
      </div>
      <h3 className="font-black text-[#111111] text-lg">{title}</h3>
      <p className="text-sm text-[#555555] mt-2 max-w-xs">{desc}</p>
      <Link
        to={action.to}
        className="mt-6 px-6 py-3 bg-[#FF6E31] text-white text-sm font-bold hover:bg-[#E55F20] transition-colors"
      >
        {action.label}
      </Link>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, desc, children }: {
  icon: React.ElementType; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EEEEEE]">
        <div className="w-9 h-9 bg-[#FFF4EE] flex items-center justify-center">
          <Icon size={16} className="text-[#FF6E31]" />
        </div>
        <div>
          <h3 className="font-bold text-[#111111] text-sm">{title}</h3>
          <p className="text-xs text-[#999999]">{desc}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, sub }: { label: string; sub: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between p-3 hover:bg-[#F5F5F5] transition-colors">
      <div>
        <p className="text-sm font-semibold text-[#111111]">{label}</p>
        <p className="text-xs text-[#999999]">{sub}</p>
      </div>
      <button
        onClick={() => setOn((s) => !s)}
        className={`relative w-11 h-6 transition-colors duration-200 ${on ? "bg-[#FF6E31]" : "bg-[#EEEEEE]"}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function orderStatusConfig(status: string) {
  switch (status?.toLowerCase()) {
    case "completed": return { badge: "bg-green-100 text-green-700", icon: CheckCircle };
    case "cancelled": return { badge: "bg-red-100 text-red-600",     icon: XCircle };
    case "pending":   return { badge: "bg-amber-100 text-amber-700", icon: Clock };
    default:          return { badge: "bg-gray-100 text-gray-600",   icon: AlertCircle };
  }
}
