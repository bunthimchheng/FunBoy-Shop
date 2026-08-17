import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { sampleProducts } from "../data/sampleData";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState(sampleProducts);
  const [platform, setPlatform] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const snap = await getDocs(collection(db, "products"));
        if (!snap.empty) {
          setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.warn("Using sample data:", err.message);
      }
    }
    loadProducts();
  }, []);

  const platforms = useMemo(
    () => ["All", ...new Set(products.map((p) => p.platform))],
    [products]
  );

  const filtered = products.filter((p) => {
    const matchesPlatform = platform === "All" || p.platform === platform;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-extrabold text-brand-900">Shop All Discs</h1>
      <p className="mb-8 text-gray-600">Browse our full catalogue of game discs.</p>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 sm:max-w-xs focus:border-brand-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                platform === p
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No discs match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
