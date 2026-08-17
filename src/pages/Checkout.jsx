import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // "cash" | "aba"
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [showAbaStep, setShowAbaStep] = useState(false);

  async function decrementStock() {
    // Reduce stock for each purchased product. Runs as a transaction so
    // concurrent orders don't oversell the same disc. Items from the
    // fallback sample data (no matching Firestore doc) are skipped safely.
    await runTransaction(db, async (transaction) => {
      for (const item of items) {
        const ref = doc(db, "products", item.id);
        const snap = await transaction.get(ref);
        if (snap.exists()) {
          const currentStock = snap.data().stock ?? 0;
          transaction.update(ref, { stock: Math.max(0, currentStock - item.qty) });
        }
      }
    });
  }

  async function createOrder(paymentStatus) {
    await decrementStock();
    await addDoc(collection(db, "orders"), {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      items,
      total,
      address,
      paymentMethod,
      paymentStatus, // "unpaid" for cash-on-delivery, "paid" once ABA confirms
      status: "pending",
      createdAt: serverTimestamp(),
    });
    clearCart();
    setPlaced(true);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (paymentMethod === "aba") {
      // Real ABA PayWay requires a server-signed request (see README) —
      // show the payment step instead of placing the order immediately.
      setShowAbaStep(true);
      return;
    }
    setPlacing(true);
    try {
      await createOrder("unpaid"); // pay in cash when the order arrives
    } catch (err) {
      alert("Could not place order: " + err.message);
    } finally {
      setPlacing(false);
    }
  }

  async function handleConfirmAbaPayment() {
    // DEMO ONLY: in production this fires after ABA PayWay's webhook/redirect
    // confirms payment succeeded — see the "Connecting real ABA PayWay" note
    // in the README before going live.
    setPlacing(true);
    try {
      await createOrder("paid");
    } catch (err) {
      alert("Could not place order: " + err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-brand-900">Order Placed! 🎉</h1>
        <p className="mb-6 text-gray-600">
          {paymentMethod === "aba"
            ? "Payment received. We'll process it and get your discs shipped out soon."
            : "Thanks for your order. Please have the exact amount ready for cash on delivery."}
        </p>
        <button
          onClick={() => navigate("/products")}
          className="rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-extrabold text-brand-900">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
          <ul className="mb-4 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-gray-700">
                <span>{item.title} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {!showAbaStep ? (
          <form onSubmit={handlePlaceOrder} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Shipping Address</h2>
            <textarea
              required
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full name, street address, city, postal code, phone number"
              className="mb-5 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            />

            <h2 className="mb-3 text-lg font-bold text-gray-900">Payment Method</h2>
            <div className="mb-5 space-y-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                  paymentMethod === "cash" ? "border-brand-500 bg-brand-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay with cash when your order arrives.</p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                  paymentMethod === "aba" ? "border-brand-500 bg-brand-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="aba"
                  checked={paymentMethod === "aba"}
                  onChange={() => setPaymentMethod("aba")}
                />
                <div>
                  <p className="font-medium text-gray-900">ABA PAY / KHQR</p>
                  <p className="text-xs text-gray-500">Pay instantly via ABA Mobile.</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full rounded-md bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {paymentMethod === "aba" ? "Continue to Payment" : placing ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        ) : (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-bold text-gray-900">Pay with ABA</h2>
            <p className="mb-4 text-sm text-gray-500">
              Scan this KHQR code in the ABA Mobile app, or tap Pay to continue.
            </p>

            <div className="mb-4 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-10">
              <div className="text-center">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  className="mx-auto mb-2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" />
                </svg>
                <p className="text-xs text-gray-500">KHQR placeholder — connect real ABA PayWay to render a live code</p>
              </div>
            </div>

            <p className="mb-4 text-center text-2xl font-extrabold text-brand-700">
              ${total.toFixed(2)}
            </p>

            <button
              onClick={handleConfirmAbaPayment}
              disabled={placing}
              className="w-full rounded-md bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {placing ? "Confirming..." : "Pay Now"}
            </button>
            <button
              onClick={() => setShowAbaStep(false)}
              className="mt-2 w-full rounded-md border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              Demo mode — no real charge is made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
