interface OrderStatusBadgeProps {
  status: string;
  pendingVariant?: 'neutral' | 'warning';
}

export default function OrderStatusBadge({ status, pendingVariant = 'neutral' }: OrderStatusBadgeProps) {
  const normalized = status?.toUpperCase?.() ?? '';

  if (normalized === 'CONFIRMED') {
    return <span className="badge badge-success">Validée</span>;
  }
  if (normalized === 'CANCELLED') {
    return <span className="badge badge-error">Annulée</span>;
  }
  return <span className={`badge badge-${pendingVariant}`}>En attente</span>;
}
