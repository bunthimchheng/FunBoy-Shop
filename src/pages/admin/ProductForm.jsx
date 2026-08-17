import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const emptyForm = {
  title: "",
  platform: "PS5",
  genre: "",
  price: "",
  stock: "",
  condition: "New",
  image: "",
  description: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    async function loadProduct() {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) setForm(snap.data());
      setLoading(false);
    }
    loadProduct();
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (isEdit) {
        await updateDoc(doc(db, "products", id), payload);
      } else {
        await addDoc(collection(db, "products"), payload);
      }
      navigate("/admin/products");
    } catch (err) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-2xl px-4 py-12 text-gray-500">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold text-brand-900">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
          <input
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Platform</label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            >
              <option>PS5</option>
              <option>PS4</option>
              <option>Xbox Series X</option>
              <option>Nintendo Switch</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            >
              <option>New</option>
              <option>Used - Like New</option>
              <option>Used - Good</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Genre</label>
            <input
              required
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
            <input
              required
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
          <input
            required
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-md border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
