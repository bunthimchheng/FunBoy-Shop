// Reusable star rating. Pass `interactive` + `onChange` for an input version,
// or omit them to just display a read-only rating (e.g. product average).
export default function StarRating({ rating = 0, size = 20, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={`${star} star`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#f59e0b" : "none"}
              stroke="#f59e0b"
              strokeWidth="1.5"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
