import Spinner from './Spinner';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Chargement...' }: LoadingStateProps) {
  return (
    <div className="empty-state">
      <Spinner />
      <p className="font-medium text-slate-600">{message}</p>
    </div>
  );
}
