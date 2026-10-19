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

import { UserProfile, Order, WishlistItem, OrderItem } from "@/types";

type Tab = "profile" | "orders" | "wishlist" | "settings";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
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
      setProfile((p) => (p ? { ...p, ...res.data } : res.data));
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditForm({ fullName: profile?.fullName || "", phone: profile?.phone || "" });
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
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to change password");
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
    <div className="min-h-screen bg-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Stats row ── */}
        {!dataLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white border border-[#dedede] rounded-[4px] p-5 flex items-center gap-4 shadow-sm hover:border-[#ec7744]/40 transition-colors">
                <div className={`w-12 h-12 rounded-[4px] flex items-center justify-center ${bg} shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-xs text-[#7d7d7d] font-medium">{label}</p>
                  <p className="text-xl font-bold text-[#121212] mt-1 leading-none">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="space-y-4">
            {/* Avatar card */}
            <div className="bg-white border border-[#dedede] rounded-[4px] p-6 text-center shadow-sm">
              <div className="w-20 h-20 bg-[#ec7744] rounded-[4px] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-sm">
                {initials}
              </div>
              <h3 className="font-bold text-[#121212] text-lg leading-tight">
                {profile?.fullName || user.fullName}
              </h3>
              <p className="text-xs text-[#7d7d7d] mt-1">{user.email}</p>
              {user.role === "admin" && (
                <span className="inline-block mt-3 px-3 py-1 bg-[#fbe4da] text-[#ec7744] text-[11px] font-bold tracking-wider uppercase border border-[#ec7744]/20 rounded-[4px]">
                  Admin
                </span>
              )}
            </div>

            {/* Nav tabs */}
            <nav className="bg-white border border-[#dedede] rounded-[4px] p-2 space-y-1 shadow-sm">
              {navTabs.map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-[4px] transition-all ${
                    activeTab === id
                      ? "bg-[#ec7744] text-white"
                      : "text-[#7d7d7d] hover:bg-[#f8f1eb]/60 hover:text-[#121212]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {label}
                  </span>
                  {count != null && count > 0 && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] ${activeTab === id ? "bg-white/20 text-white" : "bg-[#fbe4da] text-[#ec7744]"}`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}

              <div className="border-t border-[#dedede] pt-2 mt-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-[4px] transition-colors"
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
              <div className="bg-white border border-[#dedede] rounded-[4px] p-12 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#ec7744]/30 border-t-[#ec7744] rounded-full animate-spin" />
              </div>
            ) : (
              <div>

                {/* ── PROFILE TAB ── */}
                {activeTab === "profile" && (
                  <div className="bg-white border border-[#dedede] rounded-[4px] overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#dedede] bg-[#f8f1eb]/30">
                      <div>
                        <h2 className="text-xl font-bold text-[#121212]">Personal Information</h2>
                        <p className="text-xs text-[#7d7d7d] mt-0.5">Manage your account details and contacts</p>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#fbe4da] text-[#ec7744] text-sm font-bold hover:bg-[#ec7744] hover:text-white rounded-[4px] transition-colors"
                        >
                          <Edit2 size={15} /> Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 border border-[#dedede] rounded-[4px] text-[#7d7d7d] text-sm font-semibold hover:bg-[#f7f7f7] transition-colors">
                            <X size={14} /> Cancel
                          </button>
                          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-[#ec7744] text-white text-sm font-bold hover:bg-[#bd5f37] rounded-[4px] transition-colors disabled:opacity-60">
                            <Save size={14} /> {saving ? "Saving…" : "Save"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
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
                      <h2 className="text-xl font-bold text-[#121212]">Order History</h2>
                      <span className="text-sm text-[#7d7d7d]">{orders.length} orders</span>
                    </div>

                    {orders.length === 0 ? (
                      <EmptyState
                        icon={Package}
                        title="No orders yet"
                        desc="Start shopping our artisan collection to see your order history here"
                        action={{ label: "Browse Catalog", to: "/shop" }}
                      />
                    ) : (
                      orders.map((order) => {
                        const { badge, icon: StatusIcon } = orderStatusConfig(order.status);
                        return (
                          <div key={order._id} className="bg-white border border-[#dedede] rounded-[4px] overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#dedede] bg-[#f8f1eb]/20">
                              <div>
                                <p className="text-[10px] text-[#7d7d7d] font-bold tracking-wider">ORDER ID</p>
                                <p className="font-bold text-[#121212] text-sm mt-0.5 font-mono">
                                  #{order._id?.slice(-8).toUpperCase()}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-[4px] ${badge}`}>
                                  <StatusIcon size={12} />
                                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                </span>
                                <span className="text-lg font-bold text-[#121212]">
                                  ₹{(order.total || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>

                            {order.items?.length > 0 && (
                              <div className="px-5 py-3 space-y-2">
                                {order.items.slice(0, 3).map((item: OrderItem, i: number) => (
                                  <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-[#7d7d7d] truncate max-w-[240px]">{item.name}</span>
                                    <span className="text-[#121212] font-semibold shrink-0 ml-4">
                                      ₹{(item.price * item.quantity).toLocaleString("en-IN")} × {item.quantity}
                                    </span>
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <p className="text-xs text-[#7d7d7d]">
                                    +{order.items.length - 3} more items
                                  </p>
                                )}
                              </div>
                            )}

                            {order.shippingAddress && (
                              <div className="flex items-center gap-2 px-5 py-3 bg-[#f7f7f7] border-t border-[#dedede]">
                                <MapPin size={13} className="text-[#7d7d7d] shrink-0" />
                                <p className="text-xs text-[#7d7d7d] truncate">
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
                    <h2 className="text-xl font-bold text-[#121212]">My Wishlist</h2>

                    {wishlistLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white border border-[#dedede] rounded-[4px] aspect-[3/4] animate-pulse" />
                        ))}
                      </div>
                    ) : wishlistItems.length === 0 ? (
                      <EmptyState
                        icon={Heart}
                        title="Your wishlist is empty"
                        desc="Save products you love and find them here anytime"
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
                    <h2 className="text-xl font-bold text-[#121212]">Account Settings</h2>

                    <SettingsCard icon={Bell} title="Notifications" desc="Manage how you receive updates">
                      {[
                        { label: "Order updates", sub: "Track your order status and shipping" },
                        { label: "Promotions & offers", sub: "Receive exclusive handcrafted deals" },
                        { label: "Wishlist restocks", sub: "Know when saved items are back in stock" },
                      ].map(({ label, sub }) => (
                        <ToggleRow key={label} label={label} sub={sub} />
                      ))}
                    </SettingsCard>

                    <SettingsCard icon={Shield} title="Security" desc="Manage your password and security credentials">
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowPwForm((s) => !s)}
                          className="w-full flex items-center justify-between p-3 rounded-[4px] hover:bg-[#f8f1eb]/40 transition-colors text-sm"
                        >
                          <span className="text-[#121212] font-semibold">Change Password</span>
                          <ChevronRight size={16} className={`text-[#7d7d7d] transition-transform ${showPwForm ? "rotate-90" : ""}`} />
                        </button>

                        {showPwForm && (
                          <div className="bg-[#f7f7f7] border border-[#dedede] rounded-[4px] p-4 space-y-3">
                            {(["current", "next", "confirm"] as const).map((field) => (
                              <div key={field}>
                                <label className="text-[10px] font-bold text-[#7d7d7d] uppercase tracking-wide mb-1 block">
                                  {field === "current" ? "Current Password"
                                    : field === "next" ? "New Password"
                                    : "Confirm New Password"}
                                </label>
                                <input
                                  type="password"
                                  value={pwForm[field]}
                                  onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                                  className="w-full border border-[#dedede] rounded-[4px] bg-white px-3 py-2 text-sm text-[#121212] focus:outline-none focus:border-[#ec7744]"
                                />
                              </div>
                            ))}
                            <button
                              onClick={handleChangePassword}
                              disabled={pwSaving}
                              className="w-full bg-[#ec7744] text-white text-sm font-bold py-2.5 rounded-[4px] hover:bg-[#bd5f37] transition-colors disabled:opacity-60 shadow-sm"
                            >
                              {pwSaving ? "Saving…" : "Update Password"}
                            </button>
                          </div>
                        )}
                      </div>
                    </SettingsCard>

                    <div className="bg-white border border-red-200 rounded-[4px] p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-red-50 rounded-[4px] flex items-center justify-center">
                          <Trash2 size={16} className="text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#121212] text-sm">Account Session</h3>
                          <p className="text-xs text-[#7d7d7d]">Sign out from your current device</p>
                        </div>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full py-3 border border-red-200 rounded-[4px] text-red-600 text-sm font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
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

interface ProfileFieldProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  editing: boolean;
  onChange?: (v: string) => void;
  type?: string;
  readOnly?: boolean;
}

function ProfileField({
  icon: Icon, label, value, editing, onChange, type = "text", readOnly = false,
}: ProfileFieldProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#f7f7f7] border border-[#dedede] rounded-[4px]">
      <div className="w-9 h-9 rounded-[4px] bg-[#fbe4da] flex items-center justify-center shrink-0 mt-0.5 text-[#ec7744]">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#7d7d7d] uppercase tracking-wider mb-1">{label}</p>
        {editing && !readOnly ? (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-white border border-[#dedede] rounded-[4px] px-3 py-2 text-sm text-[#121212] focus:outline-none focus:border-[#ec7744] transition-colors"
          />
        ) : (
          <p className={`text-sm font-semibold ${readOnly ? "text-[#7d7d7d]" : "text-[#121212]"}`}>
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
    <div className="bg-white border border-[#dedede] rounded-[4px] p-12 flex flex-col items-center text-center shadow-sm">
      <div className="w-16 h-16 rounded-full bg-[#fbe4da] flex items-center justify-center mb-4 text-[#ec7744]">
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-[#121212] text-lg">{title}</h3>
      <p className="text-sm text-[#7d7d7d] mt-2 max-w-xs">{desc}</p>
      <Link
        to={action.to}
        className="mt-6 px-6 py-2.5 bg-[#ec7744] text-white text-sm font-medium rounded-[4px] hover:bg-[#bd5f37] transition-colors shadow-sm"
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
    <div className="bg-white border border-[#dedede] rounded-[4px] overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#dedede] bg-[#f8f1eb]/20">
        <div className="w-9 h-9 rounded-[4px] bg-[#fbe4da] flex items-center justify-center text-[#ec7744]">
          <Icon size={16} />
        </div>
        <div>
          <h3 className="font-bold text-[#121212] text-sm">{title}</h3>
          <p className="text-xs text-[#7d7d7d]">{desc}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, sub }: { label: string; sub: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between p-3 rounded-[4px] hover:bg-[#f7f7f7] transition-colors">
      <div>
        <p className="text-sm font-semibold text-[#121212]">{label}</p>
        <p className="text-xs text-[#7d7d7d]">{sub}</p>
      </div>
      <button
        onClick={() => setOn((s) => !s)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? "bg-[#ec7744]" : "bg-[#dedede]"}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function orderStatusConfig(status: string) {
  switch (status?.toLowerCase()) {
    case "completed": return { badge: "bg-emerald-50 text-[#0fb67e] border border-[#0fb67e]/20", icon: CheckCircle };
    case "cancelled": return { badge: "bg-red-50 text-red-600 border border-red-200",         icon: XCircle };
    case "pending":   return { badge: "bg-amber-50 text-amber-700 border border-amber-200",     icon: Clock };
    default:          return { badge: "bg-gray-100 text-gray-700 border border-gray-200",       icon: AlertCircle };
  }
}
