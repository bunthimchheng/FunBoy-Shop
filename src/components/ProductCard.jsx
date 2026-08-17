import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-brand-600 font-semibold">
          <span>{product.platform}</span>
          <span>{product.genre}</span>
        </div>
        <h3 className="mb-1 text-base font-bold text-gray-900">{product.title}</h3>
        <p className="mb-3 text-sm text-gray-500">{product.condition}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-brand-700">${product.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="rounded-md border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50"
            >
              {added ? "Added ✓" : "Add"}
            </button>
            <Link
              to={`/products/${product.id}`}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
