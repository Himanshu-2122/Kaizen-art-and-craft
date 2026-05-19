import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Upload, ImageIcon } from "lucide-react";

const STORAGE_TYPES = ["Without Storage", "Ready to Hang", "Freestanding", "Packaged"];
const PRODUCT_CATEGORIES = [
  { label: "Wall Art",        value: "wall-art" },
  { label: "Pottery",         value: "pottery" },
  { label: "Textile Crafts",  value: "textile-crafts" },
  { label: "3 Daraz",         value: "3-daraz" },
  { label: "6 Daraz",         value: "6-daraz" },
];

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

const fieldClass = "border border-[#E8E8E8] p-3 w-full text-sm text-[#212121] bg-white focus:outline-none focus:border-[#FF6E31] transition-colors placeholder:text-[#999999]";
const labelClass = "text-xs font-bold text-[#666666] uppercase tracking-wide mb-1 block";

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

  /* ── LOAD DATA ── */
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

  /* ── HANDLERS ── */
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

  /* ── SAVE ── */
  const save = async () => {
    if (!form.name || !form.description || !form.price || !form.mrpPrice ||
        !form.category || !form.storageType || !form.materialType ||
        !form.finishType || !form.netWeight || !form.warrantyMonths ||
        !form.dimensionLength || !form.dimensionWidth || !form.dimensionHeight) {
      toast.error("Please fill all required fields");
      return;
    }

    const sizesArr = form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (!sizesArr.length) {
      toast.error("At least 1 size required");
      return;
    }

    if (!editingId && imageFiles.length === 0) {
      toast.error("At least 1 image required");
      return;
    }

    if (existingImages.length + imageFiles.length > 10) {
      toast.error("Maximum 10 images allowed");
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
        toast.success("Product Updated");
      } else {
        await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product Created");
      }

      resetForm();
      load();
      onChange?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  /* ── EDIT ── */
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

  /* ── DELETE ── */
  const remove = async (id: string) => {
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    load();
    onChange?.();
  };

  /* ── UI ── */
  return (
    <div className="bg-white p-6 space-y-8">
      <h2 className="text-xl font-black text-[#212121]">Products</h2>

      {/* ── FORM ── */}
      <div className="bg-[#F5F5F5] p-5 border border-[#E8E8E8] space-y-5">
        <h3 className="font-bold text-[#212121]">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className={fieldClass}>
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Collection</label>
            <select name="collectionId" value={form.collectionId} onChange={handleChange} className={fieldClass}>
              <option value="">Select Collection</option>
              {collections.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="storageType" className={labelClass}>Storage Type *</label>
            <select id="storageType" name="storageType" value={form.storageType} onChange={handleChange} className={fieldClass}>
              <option value="">Select Storage Type</option>
              {STORAGE_TYPES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Retail Price (₹) *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Retail Price" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>MRP (₹) *</label>
            <input name="mrpPrice" type="number" value={form.mrpPrice} onChange={handleChange} placeholder="MRP Price" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className={fieldClass} />
          </div>
        </div>

        {form.price && form.mrpPrice && Number(form.mrpPrice) > Number(form.price) && (
          <div className="bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700 font-medium">
            Discount: {Math.round(((Number(form.mrpPrice) - Number(form.price)) / Number(form.mrpPrice)) * 100)}% off
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Material Type *</label>
            <input name="materialType" value={form.materialType} onChange={handleChange} placeholder="e.g. Canvas, Ceramic, Cotton" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Finish Type *</label>
            <input name="finishType" value={form.finishType} onChange={handleChange} placeholder="e.g. Matte, Glazed, Embroidered" className={fieldClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Dimensions (cm) *</label>
          <div className="grid grid-cols-3 gap-3">
            <input name="dimensionLength" type="number" value={form.dimensionLength} onChange={handleChange} placeholder="Length" className={fieldClass} />
            <input name="dimensionWidth" type="number" value={form.dimensionWidth} onChange={handleChange} placeholder="Width" className={fieldClass} />
            <input name="dimensionHeight" type="number" value={form.dimensionHeight} onChange={handleChange} placeholder="Height" className={fieldClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Net Weight (kg) *</label>
            <input name="netWeight" type="number" value={form.netWeight} onChange={handleChange} placeholder="Net Weight" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Warranty (months) *</label>
            <input name="warrantyMonths" type="number" value={form.warrantyMonths} onChange={handleChange} placeholder="e.g. 12" className={fieldClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sizes * (comma separated)</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="Small, Medium, Large" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Serviceable Pin Codes (comma separated)</label>
            <input name="serviceablePinCodes" value={form.serviceablePinCodes} onChange={handleChange} placeholder="110001, 110002" className={fieldClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product Description..." rows={3} className={fieldClass} />
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            { name: "bestSeller", label: "Best Seller" },
            { name: "featured", label: "Featured" },
            { name: "checkAvailability", label: "Available" },
            { name: "isActive", label: "Active" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 text-sm cursor-pointer text-[#212121] font-medium">
              <input
                type="checkbox"
                name={name}
                checked={form[name]}
                onChange={handleChange}
                className="w-4 h-4 accent-[#FF6E31]"
              />
              {label}
            </label>
          ))}
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className={labelClass}>Product Images * (max 10)</label>

          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative w-20 h-20 overflow-hidden border border-[#E8E8E8] group">
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 overflow-hidden border-2 border-[#FF6E31] group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#E8E8E8] p-6 text-center cursor-pointer hover:border-[#FF6E31] hover:bg-[#FFF4EE] transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-[#999999] mb-2" />
            <p className="text-sm text-[#666666]">Click to upload images</p>
            <p className="text-xs text-[#999999] mt-1">
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

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-[#FF6E31] text-white font-bold py-3 hover:bg-[#E55F20] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-[#E8E8E8] text-[#666666] font-semibold hover:bg-[#F5F5F5] transition-colors text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-x-auto border border-[#E8E8E8]">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5F5] text-left border-b border-[#E8E8E8]">
            <tr>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Image</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Name</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Price</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">MRP</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Category</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Storage</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Rating</th>
              <th className="p-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-[#E8E8E8] hover:bg-[#F5F5F5] transition-colors">
                <td className="p-3">
                  <div className="w-12 h-12 overflow-hidden bg-[#F5F5F5] border border-[#E8E8E8]">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0].startsWith("http") ? p.images[0] : getImageUrl(p.images[0])}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-full h-full p-2 text-[#E8E8E8]" />
                    )}
                  </div>
                </td>
                <td className="p-3 font-medium text-[#212121] max-w-[200px] truncate">{p.name}</td>
                <td className="p-3 font-bold text-[#212121]">₹{p.price?.toLocaleString("en-IN")}</td>
                <td className="p-3 text-[#999999] line-through text-xs">{p.mrpPrice ? `₹${p.mrpPrice.toLocaleString("en-IN")}` : "—"}</td>
                <td className="p-3 capitalize text-[#666666]">{p.category}</td>
                <td className="p-3 text-[#666666]">{p.storageType || "—"}</td>
                <td className="p-3 text-[#666666]">{(p.averageRating || 0).toFixed(1)} ★</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => edit(p)}
                      className="px-3 py-1.5 bg-[#FFF4EE] text-[#FF6E31] text-xs font-bold border border-[#FF6E31]/20 hover:bg-[#FF6E31] hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p._id)}
                      className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-bold border border-red-200 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-[#999999] py-8 text-sm">No products yet</p>
        )}
      </div>
    </div>
  );
}
