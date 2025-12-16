import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <pre className="text-sm bg-black/30 p-4 rounded-lg overflow-auto font-mono text-red-200">
              {this.state.error && this.state.error.toString()}
            </pre>
            {this.state.errorInfo && (
              <pre className="text-xs text-slate-400 mt-4 overflow-auto">
                {this.state.componentStack}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
