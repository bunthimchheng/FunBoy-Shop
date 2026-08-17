import { useEffect, useState } from "react";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Could not update order: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-1 text-3xl font-extrabold text-brand-900">Manage Orders</h1>
      <p className="mb-8 text-gray-600">
        {orders.length} order{orders.length !== 1 && "s"} total.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{o.userEmail}</p>
                  <p className="text-xs text-gray-500">
                    {o.createdAt?.toDate
                      ? o.createdAt.toDate().toLocaleString()
                      : "Just now"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    STATUS_STYLES[o.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <ul className="mb-3 space-y-1 text-sm text-gray-700">
                {o.items?.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.title} × {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-500">
                <span>Payment: <strong className="text-gray-700">{o.paymentMethod?.toUpperCase()}</strong></span>
                <span>Payment Status: <strong className="text-gray-700 capitalize">{o.paymentStatus}</strong></span>
                <span>Total: <strong className="text-gray-700">${o.total?.toFixed(2)}</strong></span>
              </div>

              {o.address && (
                <p className="mb-3 text-xs text-gray-500">
                  Ship to: <span className="text-gray-700">{o.address}</span>
                </p>
              )}

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">Update status:</label>
                <select
                  value={o.status}
                  disabled={updatingId === o.id}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
