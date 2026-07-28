import { Component } from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-border-default bg-surface">
            <AlertTriangle size={32} strokeWidth={1.6} className="text-gold" />
          </span>
          <h3 className="mt-6 text-center text-[19px] font-semibold text-ink">
            Something went wrong
          </h3>
          <p className="mt-3 max-w-[380px] text-center text-[13.5px] leading-relaxed text-ink-soft">
            An unexpected error occurred. Please try again or navigate to a different page.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="glass-gold mt-6 flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
