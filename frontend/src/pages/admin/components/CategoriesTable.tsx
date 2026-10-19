import { useState, useRef, useMemo } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { CollectionItem } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const EMPTY_FORM: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

const fieldClass =
  "border border-[#dedede] rounded-[4px] p-2.5 w-full text-sm text-[#121212] bg-white focus:outline-none focus:border-[#ec7744] focus:ring-1 focus:ring-[#ec7744] transition-all placeholder:text-[#999999]";
const labelClass = "text-xs font-bold text-[#666666] uppercase tracking-wide mb-1 block";

export default function CategoriesTable({ onChange }: { onChange?: () => void }) {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    clearImage();
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (cat: CollectionItem) => {
    clearImage();
    setEditingId(cat._id);
    const existingImg = cat.imageUrl || cat.image || "";
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      imageUrl: existingImg,
      isActive: cat.isActive ?? true,
    });
    if (existingImg) {
      setPreviewUrl(existingImg);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    if (isSubmitting) return;

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      if (form.slug.trim()) fd.append("slug", form.slug.trim());
      if (form.description.trim()) fd.append("description", form.description.trim());
      fd.append("isActive", String(form.isActive));

      if (selectedFile) {
        fd.append("image", selectedFile);
      } else if (form.imageUrl.trim()) {
        fd.append("imageUrl", form.imageUrl.trim());
      }

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: fd });
        toast.success(`Category "${form.name.trim()}" updated successfully!`);
      } else {
        await createMutation.mutateAsync(fd);
        toast.success(`Category "${form.name.trim()}" created successfully!`);
      }

      resetForm();
      onChange?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (editingId ? "Failed to update category" : "Failed to create category");
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Category "${name}" deleted`);
      if (editingId === id) resetForm();
      onChange?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete category";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.slug.toLowerCase().includes(search.toLowerCase()) ||
        (cat.description || "").toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "active") return cat.isActive !== false;
      if (activeFilter === "inactive") return cat.isActive === false;
      return true;
    });
  }, [categories, search, activeFilter]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* ── CREATE / EDIT CATEGORY FORM ── */}
      <div className="bg-white border border-[#dedede] rounded-[6px] shadow-sm overflow-hidden transition-all">
        <div className="border-b border-[#dedede] px-6 py-4 flex items-center justify-between bg-[#f8f1eb]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#fbe4da] flex items-center justify-center text-[#ec7744]">
              {editingId ? <Edit2 size={18} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#121212]">
                {editingId ? "Edit Category" : "Create New Category"}
              </h2>
              <p className="text-xs text-[#7d7d7d]">
                {editingId
                  ? "Update category details and availability."
                  : "Add a category to organize products across store catalogs, filters, and navigation."}
              </p>
            </div>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs text-[#7d7d7d] hover:text-[#121212] font-semibold flex items-center gap-1 border border-[#dedede] px-3 py-1.5 rounded-[4px] bg-white transition-colors"
            >
              <X size={14} /> Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Name */}
            <div>
              <label htmlFor="category-name" className={labelClass}>
                Category Name *
              </label>
              <input
                id="category-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wall Decor, Solid Wood Furniture, Terracotta"
                className={fieldClass}
              />
              <span className="text-[11px] text-[#7d7d7d] mt-1 block">
                Required. Must be unique across categories.
              </span>
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="category-slug" className={labelClass}>
                Slug (URL Identifier)
              </label>
              <input
                id="category-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                placeholder="auto-generated-from-name"
                className={fieldClass}
              />
              <span className="text-[11px] text-[#7d7d7d] mt-1 block">
                Leave empty to automatically generate from the name.
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="category-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="category-description"
              name="description"
              rows={2}
              value={form.description}
              onChange={handleChange}
              placeholder="Short description for collection banners and search engine snippets..."
              className={fieldClass}
            />
          </div>

          {/* Image Upload & URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div>
              <label className={labelClass}>Category Image (File Upload)</label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="category-image-file"
                />
                <label
                  htmlFor="category-image-file"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#121212] border border-[#dedede] rounded-[4px] bg-[#f8f1eb]/30 hover:bg-[#fbe4da]/60 hover:text-[#ec7744] hover:border-[#ec7744] transition-colors"
                >
                  <Upload size={14} /> Choose Image File
                </label>
                {selectedFile && (
                  <span className="text-xs text-[#121212] truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7d7d7d] mt-1.5">
                Upload JPG, PNG, WEBP up to 5MB. Or enter an external image URL below.
              </p>

              <div className="mt-3">
                <label htmlFor="category-image-url" className="text-[11px] font-semibold text-[#7d7d7d] mb-1 block">
                  Or External Image URL
                </label>
                <input
                  id="category-image-url"
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    if (!selectedFile) setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Preview Box */}
            <div>
              <label className={labelClass}>Image Preview</label>
              <div className="w-full h-32 border border-dashed border-[#dedede] rounded-[4px] bg-[#fdfaf8] flex items-center justify-center relative overflow-hidden">
                {previewUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img
                      src={getImageUrl(previewUrl)}
                      alt="Category preview"
                      className="max-h-full max-w-full object-contain rounded-[2px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300?text=Preview+Error";
                      }}
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-[#7d7d7d] p-4">
                    <Sparkles size={20} className="mx-auto mb-1 text-[#dedede]" />
                    <p className="text-xs">No image selected</p>
                    <p className="text-[10px] text-[#999999]">Optional visual thumbnail</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Status & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#dedede]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-[#ec7744] rounded border-gray-300"
              />
              <span className="text-xs font-semibold text-[#121212]">
                Category Active in Storefront
              </span>
            </label>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-[#ec7744] hover:bg-[#d86634] text-white font-semibold text-xs h-9 px-5 flex items-center gap-2 shadow-sm flex-1 sm:flex-none justify-center"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* ── CATEGORIES LIST SECTION ── */}
      <div className="bg-white border border-[#dedede] rounded-[6px] shadow-sm overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 sm:p-5 border-b border-[#dedede] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#f8f1eb]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#fbe4da] flex items-center justify-center text-[#ec7744]">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#121212]">
                Categories Directory ({categories.length})
              </h3>
              <p className="text-xs text-[#7d7d7d]">
                Manage all registered categories and collection catalogs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7d7d]"
              />
              <input
                type="text"
                placeholder="Filter categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-[#dedede] rounded-[4px] bg-white focus:outline-none focus:border-[#ec7744] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7d7d] hover:text-[#121212]"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center border border-[#dedede] rounded-[4px] p-0.5 bg-white text-xs">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-[2px] transition-colors ${
                  activeFilter === "all"
                    ? "bg-[#ec7744] text-white font-bold"
                    : "text-[#7d7d7d] hover:text-[#121212]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-3 py-1 rounded-[2px] transition-colors ${
                  activeFilter === "active"
                    ? "bg-[#ec7744] text-white font-bold"
                    : "text-[#7d7d7d] hover:text-[#121212]"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter("inactive")}
                className={`px-3 py-1 rounded-[2px] transition-colors ${
                  activeFilter === "inactive"
                    ? "bg-[#ec7744] text-white font-bold"
                    : "text-[#7d7d7d] hover:text-[#121212]"
                }`}
              >
                Inactive
              </button>
            </div>

            <button
              onClick={() => refetch()}
              className="p-2 border border-[#dedede] rounded-[4px] bg-white text-[#7d7d7d] hover:text-[#ec7744] hover:border-[#ec7744] transition-colors shadow-sm"
              title="Refresh list"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-[#7d7d7d]">
            <div className="w-7 h-7 border-[3px] border-[#ec7744]/20 border-t-[#ec7744] rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading categories...</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="p-8 text-center text-red-600 bg-red-50/50">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p className="text-xs font-semibold">Failed to load categories.</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="mt-3 text-xs"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Table Content */}
        {!isLoading && !isError && (
          <>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 px-4 text-[#7d7d7d]">
                <FolderTree size={36} className="mx-auto text-[#dedede] mb-2" />
                <p className="text-sm font-semibold text-[#121212]">
                  {search ? "No matching categories found" : "No categories yet"}
                </p>
                <p className="text-xs mt-1">
                  {search
                    ? `No categories found matching "${search}". Try clearing the search.`
                    : "Create your first category above to begin organizing products."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#dedede] bg-[#f8f1eb]/50 text-[11px] font-bold text-[#7d7d7d] uppercase tracking-wider">
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Name & Slug</th>
                      <th className="py-3 px-4 hidden md:table-cell">Description</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Store Links</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dedede]">
                    {filteredCategories.map((cat) => {
                      const img = cat.imageUrl || cat.image;
                      const isCatActive = cat.isActive !== false;
                      const isDeleting = deletingId === cat._id;

                      return (
                        <tr
                          key={cat._id}
                          className="hover:bg-[#f8f1eb]/25 transition-colors group"
                        >
                          {/* Image */}
                          <td className="py-3 px-4 w-16">
                            <div className="w-12 h-12 rounded-[4px] overflow-hidden bg-[#f7f7f7] border border-[#dedede] shrink-0 flex items-center justify-center">
                              {img ? (
                                <img
                                  src={getImageUrl(img)}
                                  alt={cat.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://placehold.co/100x100?text=No+Img";
                                  }}
                                />
                              ) : (
                                <FolderTree size={18} className="text-[#999999]" />
                              )}
                            </div>
                          </td>

                          {/* Name & Slug */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#121212] text-sm group-hover:text-[#ec7744] transition-colors">
                              {cat.name}
                            </div>
                            <div className="text-xs text-[#7d7d7d] font-mono mt-0.5">
                              slug: <span className="text-[#121212]">{cat.slug}</span>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-3 px-4 hidden md:table-cell max-w-xs">
                            <p className="text-xs text-[#7d7d7d] line-clamp-2">
                              {cat.description || "—"}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold ${
                                isCatActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}
                            >
                              {isCatActive ? (
                                <>
                                  <CheckCircle2 size={11} /> Active
                                </>
                              ) : (
                                <>
                                  <EyeOff size={11} /> Inactive
                                </>
                              )}
                            </span>
                          </td>

                          {/* Store links */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/shop?category=${cat.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7d7d7d] hover:text-[#ec7744] hover:underline"
                                title="View in Shop"
                              >
                                Shop <ExternalLink size={11} />
                              </Link>
                              <span className="text-[#dedede]">|</span>
                              <Link
                                to={`/collections/${cat.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7d7d7d] hover:text-[#ec7744] hover:underline"
                                title="View Collection page"
                              >
                                Collection <ExternalLink size={11} />
                              </Link>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEdit(cat)}
                                className="p-1.5 text-[#7d7d7d] hover:text-[#ec7744] hover:bg-[#fbe4da]/60 rounded-[4px] transition-colors"
                                title="Edit category"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(cat._id, cat.name)}
                                disabled={isDeleting}
                                className="p-1.5 text-[#7d7d7d] hover:text-red-600 hover:bg-red-50 rounded-[4px] transition-colors disabled:opacity-50"
                                title="Delete category"
                              >
                                {isDeleting ? (
                                  <RefreshCw size={15} className="animate-spin text-red-600" />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
