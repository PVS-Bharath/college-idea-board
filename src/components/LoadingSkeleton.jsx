export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-badge"></div>

          <div className="skeleton skeleton-title"></div>

          <div className="skeleton skeleton-line"></div>

          <div className="skeleton skeleton-line short"></div>

          <div className="skeleton skeleton-footer"></div>
        </div>
      ))}
    </div>
  );
}