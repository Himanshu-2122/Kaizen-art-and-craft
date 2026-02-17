import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Upload, ImageIcon } from "lucide-react";

const STORAGE_TYPES = ["Box Storage", "Hydraulic", "Without Storage", "Side Drawer"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  mrpPrice: "",
  stock: "",
  category: "",
  collectionId: "",
  storageType: "",
  sizes: "",
  materialType: "",
  finishType: "",
  dimensionLength: "",
  dimensionWidth: "",
  dimensionHeight: "",
  netWeight: "",
  warrantyMonths: "",
  serviceablePinCodes: "",
  checkAvailability: true,
  bestSeller: false,
  featured: false,
  isActive: true,
};

export default function ProductsTable({ onChange }: { onChange?: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= LOAD DATA ================= */
  const load = async () => {
    const res = await api.get("/products");
    const list = Array.isArray(res.data) ? res.data : res.data.products || [];
    setProducts(list);
  };

  const loadCollections = async () => {
    try {
      const res = await api.get("/categories");
      setCollections(Array.isArray(res.data) ? res.data : []);
    } catch {}
  };

  useEffect(() => {
    load();
    loadCollections();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + imageFiles.length + files.length;

    if (totalImages > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const imageOnly = files.filter(f => f.type.startsWith("image/"));
    if (imageOnly.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    setImageFiles(prev => [...prev, ...imageOnly]);
    const previews = imageOnly.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFiles([]);
    imagePreviews.forEach(p => URL.revokeObjectURL(p));
    setImagePreviews([]);
    setExistingImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= SAVE ================= */
  const save = async () => {
    if (!form.name || !form.description || !form.price || !form.mrpPrice ||
        !form.category || !form.storageType || !form.materialType ||
        !form.finishType || !form.netWeight || !form.warrantyMonths ||
        !form.dimensionLength || !form.dimensionWidth || !form.dimensionHeight) {
      toast.error("Please fill all required fields ❌");
      return;
    }

    const sizesArr = form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (!sizesArr.length) {
      toast.error("At least 1 size required ❌");
      return;
    }

    if (!editingId && imageFiles.length === 0) {
      toast.error("At least 1 image required ❌");
      return;
    }

    if (existingImages.length + imageFiles.length > 10) {
      toast.error("Maximum 10 images allowed ❌");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("mrpPrice", form.mrpPrice);
      fd.append("stock", form.stock || "0");
      fd.append("category", form.category);
      if (form.collectionId) fd.append("collectionId", form.collectionId);
      fd.append("storageType", form.storageType);
      fd.append("sizes", JSON.stringify(sizesArr));
      fd.append("materialType", form.materialType);
      fd.append("finishType", form.finishType);
      fd.append("dimensions", JSON.stringify({
        length: Number(form.dimensionLength),
        width: Number(form.dimensionWidth),
        height: Number(form.dimensionHeight)
      }));
      fd.append("netWeight", form.netWeight);
      fd.append("warrantyMonths", form.warrantyMonths);
      fd.append("checkAvailability", String(form.checkAvailability));
      fd.append("bestSeller", String(form.bestSeller));
      fd.append("featured", String(form.featured));
      fd.append("isActive", String(form.isActive));

      const pinCodesArr = form.serviceablePinCodes
        ? form.serviceablePinCodes.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
      fd.append("serviceablePinCodes", JSON.stringify(pinCodesArr));

      if (editingId) {
        fd.append("existingImages", JSON.stringify(existingImages));
      }

      imageFiles.forEach(file => fd.append("images", file));

      if (editingId) {
        await api.put(`/products/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product Updated ✅");
      } else {
        await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product Created ✅");
      }

      resetForm();
      load();
      onChange?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed ❌");
    } finally {
      setSaving(false);
    }
  };

  /* ================= EDIT ================= */
  const edit = (p: any) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      mrpPrice: p.mrpPrice || "",
      stock: p.stock || "",
      category: p.category || "",
      collectionId: p.collectionId?._id || p.collectionId || "",
      storageType: p.storageType || "",
      sizes: (p.sizes || []).join(", "),
      materialType: p.materialType || "",
      finishType: p.finishType || "",
      dimensionLength: p.dimensions?.length || "",
      dimensionWidth: p.dimensions?.width || "",
      dimensionHeight: p.dimensions?.height || "",
      netWeight: p.netWeight || "",
      warrantyMonths: p.warrantyMonths || "",
      serviceablePinCodes: (p.serviceablePinCodes || []).join(", "),
      checkAvailability: p.checkAvailability ?? true,
      bestSeller: p.bestSeller ?? false,
      featured: p.featured ?? false,
      isActive: p.isActive ?? true,
    });
    setEditingId(p._id);
    setExistingImages(p.images || []);
    setImageFiles([]);
    setImagePreviews([]);
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
         FORM
      ===================================================== */}
      <div className="bg-gray-50 p-5 rounded-xl border space-y-5">
        <h3 className="font-semibold text-gray-800">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border p-3 rounded-lg w-full text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Category *</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-3 rounded-lg w-full text-sm" />
          </div>
        </div>

        {/* Collection & Storage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Collection</label>
            <select name="collectionId" value={form.collectionId} onChange={handleChange} className="border p-3 rounded-lg w-full text-sm bg-white">
              <option value="">Select Collection</option>
              {collections.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="storageType" className="text-xs font-medium text-gray-600 mb-1 block">Storage Type *</label>
            <select id="storageType" name="storageType" value={form.storageType} onChange={handleChange} className="border p-3 rounded-lg w-full text-sm bg-white">
              <option value="">Select Storage Type</option>
              {STORAGE_TYPES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Retail Price (₹) *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Retail Price" className="border p-3 rounded-lg w-full text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">MRP (₹) *</label>
            <input name="mrpPrice" type="number" value={form.mrpPrice} onChange={handleChange} placeholder="MRP Price" className="border p-3 rounded-lg w-full text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="border p-3 rounded-lg w-full text-sm" />
          </div>
        </div>

        {/* Discount preview */}
        {form.price && form.mrpPrice && Number(form.mrpPrice) > Number(form.price) && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 font-medium">
            Discount: {Math.round(((Number(form.mrpPrice) - Number(form.price)) / Number(form.mrpPrice)) * 100)}% off
          </div>
        )}

        {/* Material & Finish */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Material Type *</label>
            <input name="materialType" value={form.materialType} onChange={handleChange} placeholder="e.g. Sheesham Wood" className="border p-3 rounded-lg w-full text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Finish Type *</label>
            <input name="finishType" value={form.finishType} onChange={handleChange} placeholder="e.g. Honey Finish" className="border p-3 rounded-lg w-full text-sm" />
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Dimensions (cm) *</label>
          <div className="grid grid-cols-3 gap-3">
            <input name="dimensionLength" type="number" value={form.dimensionLength} onChange={handleChange} placeholder="Length" className="border p-3 rounded-lg w-full text-sm" />
            <input name="dimensionWidth" type="number" value={form.dimensionWidth} onChange={handleChange} placeholder="Width" className="border p-3 rounded-lg w-full text-sm" />
            <input name="dimensionHeight" type="number" value={form.dimensionHeight} onChange={handleChange} placeholder="Height" className="border p-3 rounded-lg w-full text-sm" />
          </div>
        </div>

        {/* Weight & Warranty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Net Weight (kg) *</label>
            <input name="netWeight" type="number" value={form.netWeight} onChange={handleChange} placeholder="Net Weight" className="border p-3 rounded-lg w-full text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Warranty (months) *</label>
            <input name="warrantyMonths" type="number" value={form.warrantyMonths} onChange={handleChange} placeholder="e.g. 12" className="border p-3 rounded-lg w-full text-sm" />
          </div>
        </div>

        {/* Sizes & Pin Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Sizes * (comma separated)</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="King, Queen, Single" className="border p-3 rounded-lg w-full text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Serviceable Pin Codes (comma separated)</label>
            <input name="serviceablePinCodes" value={form.serviceablePinCodes} onChange={handleChange} placeholder="110001, 110002" className="border p-3 rounded-lg w-full text-sm" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product Description..." rows={3} className="border p-3 rounded-lg w-full text-sm" />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} className="w-4 h-4 rounded" />
            Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="checkAvailability" checked={form.checkAvailability} onChange={handleChange} className="w-4 h-4 rounded" />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 rounded" />
            Active
          </label>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 block">Product Images * (max 10)</label>

          {/* Existing images (when editing) */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-300 group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-1">
              {existingImages.length + imageFiles.length}/10 images
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            data-testid="file-input"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button className="flex-1" onClick={save} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </div>

      {/* =====================================================
         TABLE
      ===================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">MRP</th>
              <th className="p-3">Category</th>
              <th className="p-3">Storage</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {p.images?.[0] ? (
                      <img src={getImageUrl(p.images[0])} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-full h-full p-2 text-gray-300" />
                    )}
                  </div>
                </td>
                <td className="p-3 font-medium max-w-[200px] truncate">{p.name}</td>
                <td className="p-3">₹{p.price?.toLocaleString("en-IN")}</td>
                <td className="p-3 text-gray-400 line-through">{p.mrpPrice ? `₹${p.mrpPrice.toLocaleString("en-IN")}` : "—"}</td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">{p.storageType || "—"}</td>
                <td className="p-3">{(p.averageRating || 0).toFixed(1)} ⭐</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => edit(p)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p._id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-8">No products yet</p>
        )}
      </div>
    </div>
  );
}
