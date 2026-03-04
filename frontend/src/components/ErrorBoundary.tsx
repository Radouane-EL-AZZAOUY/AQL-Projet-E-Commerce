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
        <div className="container page" style={{ padding: '2rem' }}>
          <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h2 className="page-title" style={{ color: 'var(--color-error)' }}>
              Une erreur est survenue
            </h2>
            <p className="page-subtitle">{this.state.error.message}</p>
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
