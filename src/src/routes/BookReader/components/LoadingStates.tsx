// Book Reader - Loading States Component
// ═══════════════════════════════════════════════════════════════════════════

import { Loader2 } from 'lucide-react'
import './styles/loading.css'

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="reader-loading">
      <Loader2 className="spin" size={40} />
      <span>{message}</span>
    </div>
  )
}

interface ExtractionProgressProps {
  progress: number
  message?: string
}

export function ExtractionProgress({ progress, message = 'Extracting text' }: ExtractionProgressProps): JSX.Element {
  return (
    <div className="reader-loading">
      <Loader2 className="spin" size={48} />
      <p>{message}... {progress}%</p>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

interface NotFoundProps {
  onBack: () => void
  message?: string
  buttonText?: string
}

export function BookNotFound({ onBack, message = 'Book not found', buttonText = 'Back to Library' }: NotFoundProps): JSX.Element {
  return (
    <div className="reader-loading">
      <span>{message}</span>
      <button className="link-btn" onClick={onBack}>{buttonText}</button>
    </div>
  )
}
