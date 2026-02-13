import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductsTable({ onChange }: any) {

  const empty = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "", // ⭐ REQUIRED
  };

  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------- LOAD PRODUCTS ---------------- */
  const load = async () => {
    const res = await api.get("/products");

    const list =
      Array.isArray(res.data) ? res.data : res.data.products || [];

    setProducts(list);
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- SAVE PRODUCT ---------------- */
  const save = async () => {
    try {

      // ⭐ THIS FIXES YOUR ERROR
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,   // ⭐ MUST SEND

        sizes: [],
        images: [],
        collectionId: null,
        featured: false,
        bestSeller: false,
      };

      if (!payload.category) {
        toast.error("Category required");
        return;
      }

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Updated");
      } else {
        await api.post("/products", payload);
        toast.success("Created");
      }

      setForm(empty);
      setEditingId(null);
      load();
      onChange?.();

    } catch (err: any) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  /* ---------------- EDIT ---------------- */
  const edit = (p: any) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
    });

    setEditingId(p._id);
  };

  /* ---------------- DELETE ---------------- */
  const remove = async (id: string) => {
    await api.delete(`/products/${id}`);
    toast.success("Deleted");
    load();
    onChange?.();
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">

      <h2 className="text-xl font-semibold">Products</h2>

      {/* ================= FORM ================= */}
      <div className="grid grid-cols-5 gap-3">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="border p-2 rounded"
        />

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          className="border p-2 rounded"
        />

        {/* ⭐ NEW CATEGORY FIELD */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded"
        />

        <Button onClick={save}>
          {editingId ? "Update" : "Add"}
        </Button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full text-sm">
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category}</td>
              <td className="flex gap-2">
                <Button size="sm" onClick={() => edit(p)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
