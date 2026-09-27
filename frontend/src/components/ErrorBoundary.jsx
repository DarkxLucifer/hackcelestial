import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 font-poppins">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-volkhov font-bold text-2xl text-[#181E4B]">
                Something went wrong
              </h2>
              <p className="text-xs text-[#5E6282] mt-2 leading-relaxed">
                An unexpected interface issue occurred. Your travel data is safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
                  Error Details:
                </span>
                <p className="text-xs font-mono text-red-600 break-words leading-tight">
                  {this.state.error?.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 rounded-2xl bg-[#181E4B] hover:bg-[#0c2328] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Reset &amp; Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
