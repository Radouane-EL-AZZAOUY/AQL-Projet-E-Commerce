import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  children: React.ReactNode;
}

export default function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 mb-6 text-sm text-slate-500 hover:text-primary transition-colors font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}
