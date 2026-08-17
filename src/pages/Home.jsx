import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase";
import { sampleProducts } from "../data/sampleData";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState(sampleProducts.slice(0, 4));

  useEffect(() => {
    async function loadFeatured() {
      try {
        const q = query(collection(db, "products"), limit(4));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setFeatured(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        // Firestore not configured yet — fall back to sample data.
        console.warn("Using sample data:", err.message);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
              Genuine Physical Game Discs
            </span>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
              Level Up Your Collection with Game Discs Shop
            </h1>
            <p className="max-w-xl text-lg text-white/90">
              Browse a wide selection of PlayStation, Xbox, and Nintendo Switch game
              discs — new and pre-owned, at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="rounded-md bg-white px-5 py-3 font-semibold text-brand-700 hover:bg-brand-50"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="rounded-md border border-white/40 px-5 py-3 font-semibold hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2021/5/14/poeacai8joifw0lqniov/kratos-atreus-alfheim-god-of-war"
              alt="Game discs collection"
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Discs</h2>
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            { title: "100% Genuine Discs", desc: "Every disc is tested and verified authentic before shipping." },
            { title: "Fast Delivery", desc: "Same-day dispatch for orders placed before 3PM." },
            { title: "Easy Returns", desc: "7-day hassle-free return policy on all purchases." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-brand-700">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
