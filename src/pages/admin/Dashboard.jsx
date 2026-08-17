import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { sampleProducts } from "../../data/sampleData";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState({
    products: 0,
    users: 0,
    messages: 0,
    orders: 0,
    pendingReviews: 0,
  });
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  async function loadCounts() {
    try {
      const pendingReviewsQuery = query(
        collection(db, "reviews"),
        where("adminReply", "==", null)
      );
      const [products, users, messages, orders, pendingReviews] = await Promise.all([
        getCountFromServer(collection(db, "products")),
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "messages")),
        getCountFromServer(collection(db, "orders")),
        getCountFromServer(pendingReviewsQuery),
      ]);
      setCounts({
        products: products.data().count,
        users: users.data().count,
        messages: messages.data().count,
        orders: orders.data().count,
        pendingReviews: pendingReviews.data().count,
      });
    } catch (err) {
      console.warn("Could not load counts:", err.message);
    }
  }

  useEffect(() => {
    loadCounts();
  }, []);

  async function handleSeedProducts() {
    setSeeding(true);
    setSeedMessage("");
    try {
      // sampleProducts have hardcoded ids like "sample-1" — Firestore will
      // assign its own real document ids when we addDoc, so strip the old id.
      const toAdd = sampleProducts.map(({ id, ...rest }) => rest);
      await Promise.all(toAdd.map((p) => addDoc(collection(db, "products"), p)));
      setSeedMessage(`Added ${toAdd.length} sample products to Firestore.`);
      await loadCounts();
    } catch (err) {
      setSeedMessage("Error seeding products: " + err.message);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-1 text-3xl font-extrabold text-brand-900">Admin Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Welcome back, {currentUser?.displayName || currentUser?.email}.
      </p>

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-extrabold text-brand-700">{counts.products}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Registered Users</p>
          <p className="text-3xl font-extrabold text-brand-700">{counts.users}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-extrabold text-brand-700">{counts.orders}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Contact Messages</p>
          <p className="text-3xl font-extrabold text-brand-700">{counts.messages}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/admin/products"
          className="rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Manage Orders
        </Link>
        <Link
          to="/admin/reviews"
          className="relative rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Manage Reviews
          {counts.pendingReviews > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              {counts.pendingReviews}
            </span>
          )}
        </Link>
        <Link
          to="/admin/products/new"
          className="rounded-md border border-brand-600 px-5 py-3 font-semibold text-brand-700 hover:bg-brand-50"
        >
          + Add New Product
        </Link>
        <button
          onClick={handleSeedProducts}
          disabled={seeding}
          className="rounded-md border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {seeding ? "Seeding..." : "Seed Sample Products"}
        </button>
      </div>
      {seedMessage && (
        <p className="mt-4 text-sm font-medium text-brand-700">{seedMessage}</p>
      )}
    </div>
  );
}
