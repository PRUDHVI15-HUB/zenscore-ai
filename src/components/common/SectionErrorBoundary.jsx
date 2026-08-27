import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

/**
 * SectionErrorBoundary Component
 * Catches JavaScript runtime errors in child components and renders a friendly fallback UI.
 * Prevents single component crashes from breaking the whole page.
 */
export class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('SectionErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl p-8 border border-rose-200/80 shadow-sm text-center my-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-sora text-base font-bold text-slate-900 mb-1">
            Section Temporarily Unavailable
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred in this section.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-purple-600/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Reloading Section</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
