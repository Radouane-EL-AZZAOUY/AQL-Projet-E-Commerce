import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="container page py-16">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-[480px] mx-auto p-8">
            <h2 className="text-xl font-bold text-error mb-4">Une erreur est survenue</h2>
            <p className="page-subtitle mb-6">{this.state.error.message}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
