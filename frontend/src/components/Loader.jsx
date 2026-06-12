export default function Loader({ text = 'Searching…' }) {
  return (
    <div className="loader">
      <div className="spinner" />
      {text}
    </div>
  );
}
