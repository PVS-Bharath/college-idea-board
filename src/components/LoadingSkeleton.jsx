export default function LoadingSkeleton() {
  return (
    <div className="idea-grid">
      {[1, 2, 3].map((item) => (
        <div className="skeleton-card" key={item}>
          <div
            className="sk-line"
            style={{ width: "30%" }}
          />

          <div
            className="sk-line"
            style={{
              width: "80%",
              height: "16px",
            }}
          />

          <div
            className="sk-line"
            style={{ width: "95%" }}
          />

          <div
            className="sk-line"
            style={{ width: "60%" }}
          />
        </div>
      ))}
    </div>
  );
}