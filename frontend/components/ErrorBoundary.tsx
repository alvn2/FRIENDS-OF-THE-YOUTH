import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Replaced the constructor with a class property for state initialization.
  // This is a more modern and concise approach that resolves the compile-time errors
  // related to 'state' and 'props' properties not being found on the component type.
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-brand-red">Something went wrong.</h1>
            <p className="mt-4 text-lg">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5"
            >
                Refresh Page
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
