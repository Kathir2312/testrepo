// Skeleton screens that mirror the result-card layout (uxui-promax: loading
// states must look like the content they're standing in for).
export default function SkeletonList({ count = 5 }) {
  return (
    <div className="result-list" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8 }} />
          <div className="sk-block">
            <div className="skeleton" style={{ height: 18, width: '55%' }} />
            <div className="skeleton" style={{ height: 12, width: '80%' }} />
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
          </div>
          <div className="sk-side">
            <div className="skeleton" style={{ height: 22, width: 90 }} />
            <div className="skeleton" style={{ height: 36, width: 110, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
