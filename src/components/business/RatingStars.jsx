import { useMemo } from "react";

function StarBase({ className = "", size = 18 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
        fill="currentColor"
      />
    </svg>
  );
}

function LayeredStar({ size, variant }) {
  return (
    <span
      className="relative inline-flex"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <StarBase
        size={size}
        className="text-gray-300 dark:text-gray-600 transition-colors duration-300"
      />
      {variant !== "empty" && (
        <span
          className="absolute inset-0 overflow-hidden text-amber-400 dark:text-amber-300 transition-colors duration-300"
          style={{
            width: variant === "half" ? "50%" : "100%",
            height: "100%",
          }}
        >
          <StarBase size={size} />
        </span>
      )}
    </span>
  );
}

export default function RatingStars({
  rating = 0,
  max = 5,
  size = 18,
  showValue = true,
  className = "",
}) {
  const normalized = Math.max(0, Math.min(max, rating || 0));
  const { fullStars, hasHalf, emptyStars } = useMemo(() => {
    const full = Math.floor(normalized);
    const half = normalized - full >= 0.5;
    const empty = Math.max(0, max - full - (half ? 1 : 0));
    return { fullStars: full, hasHalf: half, emptyStars: empty };
  }, [normalized, max]);

  return (
    <div
      className={`inline-flex items-center ${className}`}
      aria-label={`${normalized} out of ${max} stars`}
    >
      {Array.from({ length: fullStars }).map((_, idx) => (
        <LayeredStar key={`full-${idx}`} size={size} variant="full" />
      ))}
      {hasHalf && <LayeredStar size={size} variant="half" />}
      {Array.from({ length: emptyStars }).map((_, idx) => (
        <LayeredStar key={`empty-${idx}`} size={size} variant="empty" />
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          {normalized.toFixed(1)}
        </span>
      )}
    </div>
  );
}

