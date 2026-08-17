import { useEffect, useState } from "react";
import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import StarRating from "../../components/StarRating";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("pending"); // "pending" | "all"

  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState(null);

  async function loadReviews() {
    setLoading(true);
    setLoadError("");
    try {
      const snap = await getDocs(collection(db, "reviews"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setReviews(list);
    } catch (err) {
      console.error("Could not load reviews:", err);
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleSubmitReply(reviewId) {
    const text = (replyDrafts[reviewId] || "").trim();
    if (!text) return;
    try {
      await updateDoc(doc(db, "reviews", reviewId), {
        adminReply: text,
        adminReplyAt: serverTimestamp(),
      });
      setReplyingId(null);
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      await loadReviews();
    } catch (err) {
      alert("Could not post reply: " + err.message);
    }
  }

  const pendingCount = reviews.filter((r) => !r.adminReply).length;
  const visibleReviews = filter === "pending" ? reviews.filter((r) => !r.adminReply) : reviews;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-1 text-3xl font-extrabold text-brand-900">Customer Reviews</h1>
      <p className="mb-8 text-gray-600">
        {reviews.length} review{reviews.length !== 1 && "s"} total
        {pendingCount > 0 && ` · ${pendingCount} waiting for a reply`}
      </p>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            filter === "pending" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Needs Reply ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            filter === "all" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : loadError ? (
        <p className="text-sm font-medium text-red-600">Couldn't load reviews: {loadError}</p>
      ) : visibleReviews.length === 0 ? (
        <p className="text-sm text-gray-500">
          {filter === "pending" ? "No reviews waiting for a reply. 🎉" : "No reviews yet."}
        </p>
      ) : (
        <div className="space-y-5">
          {visibleReviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{r.userName}</p>
                  <p className="text-xs text-gray-500">
                    on <span className="font-medium text-brand-600">{r.productTitle || "a product"}</span>
                  </p>
                </div>
                <StarRating rating={r.rating} size={16} />
              </div>
              {r.comment && <p className="mb-2 mt-2 text-sm text-gray-700">{r.comment}</p>}

              {r.adminReply ? (
                <div className="mt-3 rounded-lg bg-brand-50 p-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                    Your Reply
                  </p>
                  <p className="text-sm text-gray-700">{r.adminReply}</p>
                </div>
              ) : replyingId === r.id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    value={replyDrafts[r.id] || ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                    placeholder="Write a reply to this customer..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitReply(r.id)}
                      className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => setReplyingId(null)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingId(r.id)}
                  className="mt-2 text-xs font-semibold text-brand-600 hover:underline"
                >
                  Reply as Shop
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
