import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/user/users").then(r => {
      setUsers(Array.isArray(r.data) ? r.data : []);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Users</h2>

      {users.map((u) => (
        <div key={u._id} className="border-b py-2">
          {u.fullName} — {u.email}
        </div>
      ))}
    </div>
  );
}
