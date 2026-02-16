import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductsTable({ onChange }: any) {

  /* ================= EMPTY FORM ================= */
  const empty = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    sizes: "",
    images: "",
  };

  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ================= LOAD PRODUCTS ================= */
  const load = async () => {
    const res = await api.get("/products");
    const list = Array.isArray(res.data) ? res.data : res.data.products || [];
    setProducts(list);
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SAVE ================= */
  const save = async () => {
    try {

      const sizesArr = form.sizes
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      const imagesArr = form.images
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      if (!sizesArr.length) return toast.error("At least 1 size required ❌");
      if (!imagesArr.length) return toast.error("At least 1 image required ❌");

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        sizes: sizesArr,
        images: imagesArr,
        collectionId: null,
        featured: false,
        bestSeller: false,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product Updated ✅");
      } else {
        await api.post("/products", payload);
        toast.success("Product Created ✅");
      }

      setForm(empty);
      setEditingId(null);
      load();
      onChange?.();

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed ❌");
    }
  };

  /* ================= EDIT ================= */
  const edit = (p: any) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      sizes: p.sizes.join(", "),
      images: p.images.join(", "),
    });

    setEditingId(p._id);
  };

  /* ================= DELETE ================= */
  const remove = async (id: string) => {
    await api.delete(`/products/${id}`);
    toast.success("Deleted 🗑️");
    load();
    onChange?.();
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-8">

      <h2 className="text-xl font-semibold">Products</h2>

      {/* =====================================================
         FORM (CLEAN RESPONSIVE LAYOUT)
      ===================================================== */}
      <div className="bg-gray-50 p-5 rounded-xl border space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-3 rounded w-full"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-3 rounded w-full"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price ₹"
            className="border p-3 rounded w-full"
          />

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-3 rounded w-full"
          />

          <input
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            placeholder="Sizes (S, M, L)"
            className="border p-3 rounded w-full"
          />

          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="Image URLs (comma separated)"
            className="border p-3 rounded w-full"
          />

        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description..."
          rows={3}
          className="border p-3 rounded w-full"
        />

        <Button className="w-full" onClick={save}>
          {editingId ? "Update Product" : "Add Product"}
        </Button>
      </div>

      {/* =====================================================
         TABLE
      ===================================================== */}
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Sizes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category}</td>
              <td>{p.sizes.join(", ")}</td>
              <td className="flex gap-2 p-2">
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
