import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  children?: ReactNode;
}

export default function EmptyState({ icon, title, children }: EmptyStateProps) {
  return (
    <div className="card empty-state max-w-md mx-auto">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <p className="font-medium text-slate-600">{title}</p>
      {children}
    </div>
  );
}
