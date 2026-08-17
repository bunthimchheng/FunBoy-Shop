import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sampleProducts } from "../data/sampleData";
import { useCart } from "../context/CartContext";
import ProductReviews from "../components/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(
    sampleProducts.find((p) => p.id === id) || null
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.warn("Using sample data:", err.message);
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="mb-4 text-gray-600">Product not found.</p>
        <Link to="/products" className="text-brand-600 font-semibold hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link to="/products" className="mb-6 inline-block text-sm text-brand-600 hover:underline">
        ← Back to shop
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-gray-100">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="mb-2 flex gap-2 text-sm font-semibold text-brand-600">
            <span className="rounded bg-brand-50 px-2 py-1">{product.platform}</span>
            <span className="rounded bg-brand-50 px-2 py-1">{product.genre}</span>
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900">{product.title}</h1>
          <p className="mb-4 text-sm text-gray-500">Condition: {product.condition}</p>
          <p className="mb-6 text-gray-700 leading-relaxed">{product.description}</p>
          <div className="mb-6 flex items-center gap-4">
            <span className="text-3xl font-extrabold text-brand-700">${product.price}</span>
            <span className="text-sm text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-md border border-gray-300 font-bold hover:bg-gray-50"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock ?? 99, q + 1))}
              className="h-9 w-9 rounded-md border border-gray-300 font-bold hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              addToCart(product, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            disabled={product.stock === 0}
            className="rounded-md bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>

      <ProductReviews productId={product.id} productTitle={product.title} />
    </div>
  );
}
