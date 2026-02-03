import { AlertTriangle, X, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Language, t } from '../../i18n'
import '../../styles/main.css'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  onDismiss: () => void
  language: Language
}

export function ErrorBanner({ message, onRetry, onDismiss, language }: ErrorBannerProps): JSX.Element | null {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
  }, [message])

  if (!visible) return null

  return (
     <div className="error-banner animate-slideDown">
        <AlertTriangle size={20} className="error-icon" />
        <span className="error-message">{message}</span>
        {onRetry && (
            <button className="error-retry-btn" onClick={onRetry}>
                <RefreshCw size={14} />
                {t('redo', language) || 'Retry'}
            </button>
        )}
        <button 
            className="p-1 hover:bg-[var(--color-error-hover)] rounded ml-2" 
            onClick={() => {
                setVisible(false)
                onDismiss()
            }}
        >
            <X size={16} color="currentColor" />
        </button>
     </div>
  )
}
