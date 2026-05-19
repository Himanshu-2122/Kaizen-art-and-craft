import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, ShieldCheck, User as UserIcon } from "lucide-react";

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/users")
      .then(r => setUsers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFF4EE] flex items-center justify-center">
            <Users size={16} className="text-[#FF6E31]" />
          </div>
          <h2 className="font-black text-[#212121] text-base">Registered Users</h2>
        </div>
        <span className="text-xs font-bold text-[#666666] bg-[#F5F5F5] border border-[#E8E8E8] px-2.5 py-1">
          {users.length} total
        </span>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-[#F5F5F5] animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="py-12 text-center">
          <UserIcon size={36} className="text-[#E8E8E8] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#666666]">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] text-left">
              <tr>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">#</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Name</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Phone</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const initials = (u.fullName || "?")
                  .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <tr key={u._id} className="border-t border-[#E8E8E8] hover:bg-[#F5F5F5] transition-colors">
                    <td className="px-5 py-3 text-xs text-[#666666] font-mono">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FF6E31]
                                        flex items-center justify-center text-white text-xs font-black shrink-0">
                          {initials}
                        </div>
                        <span className="font-semibold text-[#212121]">{u.fullName || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#666666]">{u.email || "—"}</td>
                    <td className="px-5 py-3 text-[#666666] font-mono text-xs">{u.phone || "—"}</td>
                    <td className="px-5 py-3">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#FFF4EE] text-[#FF6E31] border border-[#FF6E31]/20">
                          <ShieldCheck size={11} /> Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-bold bg-[#F5F5F5] text-[#666666] border border-[#E8E8E8]">
                          User
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
