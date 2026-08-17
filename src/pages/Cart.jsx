import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQty, removeFromCart, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-brand-900">Your Cart is Empty</h1>
        <p className="mb-6 text-gray-600">Browse the shop and add some discs to your cart.</p>
        <Link
          to="/products"
          className="rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-extrabold text-brand-900">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">{item.platform}</p>
              <p className="text-sm font-semibold text-brand-700">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="h-8 w-8 rounded-md border border-gray-300 font-bold hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="h-8 w-8 rounded-md border border-gray-300 font-bold hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <p className="w-16 text-right font-semibold text-gray-900">
              ${(item.price * item.qty).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex w-full max-w-xs justify-between text-lg">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="rounded-md border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="rounded-md bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
