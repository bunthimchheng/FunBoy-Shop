import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-brand-900">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">
          No products yet. Click "Add Product" to create your first listing.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Platform</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                  <td className="px-4 py-3 text-gray-600">{p.platform}</td>
                  <td className="px-4 py-3 text-gray-600">${p.price}</td>
                  <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="mr-3 font-medium text-brand-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
