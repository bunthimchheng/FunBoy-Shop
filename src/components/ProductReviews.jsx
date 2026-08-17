import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";

export default function ProductReviews({ productId, productTitle }) {
  const { currentUser, isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // New review form state
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Admin reply state: { [reviewId]: text }
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState(null);

  async function loadReviews() {
    setLoading(true);
    setLoadError("");
    try {
      // Filter only (no orderBy) so this never needs a Firestore composite
      // index — sort newest-first on the client instead.
      const q = query(collection(db, "reviews"), where("productId", "==", productId));
      const snap = await getDocs(q);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setReviews(list);
      if (currentUser) {
        setAlreadyReviewed(list.some((r) => r.userId === currentUser.uid));
      }
    } catch (err) {
      console.error("Could not load reviews:", err);
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, currentUser]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (myRating === 0) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        productTitle: productTitle || "",
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        rating: myRating,
        comment: myComment,
        adminReply: null,
        adminReplyAt: null,
        createdAt: serverTimestamp(),
      });
      setMyRating(0);
      setMyComment("");
      await loadReviews();
    } catch (err) {
      alert("Could not submit review: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

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

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} size={18} />
            <span className="text-sm text-gray-500">
              {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 && "s"})
            </span>
          </div>
        )}
      </div>

      {/* Submit a review - customers only, one per product */}
      {currentUser && !isAdmin && !alreadyReviewed && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 space-y-3 rounded-xl bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-gray-700">Leave a review</p>
          <StarRating rating={myRating} interactive onChange={setMyRating} size={26} />
          <textarea
            rows={3}
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Share your thoughts on this game disc..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || myRating === 0}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Submit Review"}
          </button>
        </form>
      )}

      {!currentUser && (
        <p className="mb-8 text-sm text-gray-500">
          <a href="/login" className="font-medium text-brand-600 hover:underline">
            Log in
          </a>{" "}
          to leave a review.
        </p>
      )}

      {alreadyReviewed && (
        <p className="mb-8 text-sm text-gray-500">You've already reviewed this product.</p>
      )}

      {/* Review list */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : loadError ? (
        <p className="text-sm font-medium text-red-600">
          Couldn't load reviews: {loadError}
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first to review this disc.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-gray-900">{r.userName}</p>
                <StarRating rating={r.rating} size={16} />
              </div>
              {r.comment && <p className="mb-2 text-sm text-gray-700">{r.comment}</p>}

              {r.adminReply ? (
                <div className="mt-3 rounded-lg bg-brand-50 p-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                    Shop Reply
                  </p>
                  <p className="text-sm text-gray-700">{r.adminReply}</p>
                </div>
              ) : isAdmin ? (
                replyingId === r.id ? (
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
                )
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
