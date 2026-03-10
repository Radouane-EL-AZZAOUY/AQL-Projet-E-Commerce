export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`loading-spinner block mx-auto my-8 ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}
