import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

/* =========================================
   MAIN PAGE
========================================= */

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;
  if (!user) return <div>Login required</div>;
  if (!isAdmin) return <div>Admin only access</div>;


  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <AdminStats />
      <ProductsAdmin />
      <OrdersAdmin />
      <UsersAdmin />
      <MessagesAdmin />
    </div>
  );
}

/* =========================================
   STATS (backend version)
========================================= */

function AdminStats() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [p, o, u] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/auth/users"),
      ]);

      const revenue = o.data.reduce((s: number, x: any) => s + x.total, 0);

      setStats({
        products: p.data.length,
        orders: o.data.length,
        users: u.data.length,
        revenue,
      });
    };

    load();
  }, []);

  return (
    <div className="flex gap-6">
      <div>Products: {stats.products}</div>
      <div>Orders: {stats.orders}</div>
      <div>Users: {stats.users}</div>
      <div>Revenue: ₹{stats.revenue}</div>
    </div>
  );
}

/* =========================================
   PRODUCTS ADMIN
========================================= */

function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await api.post("/products", {
      name: "Sample Product",
      price: 1000,
      stock: 10,
    });

    toast.success("Product created");
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/products/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <h2 className="font-semibold text-xl mb-3">Products</h2>
      <Button onClick={add}>Add Product</Button>

      <Table>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>₹{p.price}</TableCell>
              <TableCell>
                <Button onClick={() => remove(p._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* =========================================
   ORDERS
========================================= */

function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/orders").then((r) => setOrders(r.data));
  }, []);

  return (
    <div>
      <h2 className="font-semibold text-xl">Orders</h2>

      {orders.map((o) => (
        <div key={o._id}>
          ₹{o.total} - {o.status}
        </div>
      ))}
    </div>
  );
}

/* =========================================
   USERS
========================================= */

function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/auth/users").then((r) => setUsers(r.data));
  }, []);

  return (
    <div>
      <h2 className="font-semibold text-xl">Users</h2>

      {users.map((u) => (
        <div key={u._id}>{u.fullName}</div>
      ))}
    </div>
  );
}

/* =========================================
   MESSAGES
========================================= */

function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    api.get("/contact").then((r) => setMessages(r.data));
  }, []);

  return (
    <div>
      <h2 className="font-semibold text-xl">Messages</h2>

      {messages.map((m) => (
        <div key={m._id}>{m.message}</div>
      ))}
    </div>
  );
}
