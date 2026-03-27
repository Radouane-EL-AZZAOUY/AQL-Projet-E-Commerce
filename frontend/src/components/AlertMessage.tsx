interface AlertMessageProps {
  kind: 'error' | 'success';
  message: string;
}

export default function AlertMessage({ kind, message }: AlertMessageProps) {
  return <div className={`alert alert-${kind}`}>{message}</div>;
}
