// ═══════════════════════════════════════════════════════════════════════════
// Save Indicator - Shows save status (saving/saved/error)
// ═══════════════════════════════════════════════════════════════════════════

import { Cloud, Check, Loader2, AlertCircle } from 'lucide-react'
import { formatRelativeTime } from '../../utils/formatTime'
import type { SaveStatus } from '../../hooks/useAutoSave'
import './styles/feedback.css'

type Language = 'ar' | 'en'

interface SaveIndicatorProps {
  status: SaveStatus
  lastSaved?: Date | null
  language: Language
  error?: Error | null
  onRetry?: () => void
}

// Translations
const t = (key: string, lang: Language): string => {
  const translations: Record<string, { ar: string; en: string }> = {
    saving: { ar: 'جاري الحفظ...', en: 'Saving...' },
    saved: { ar: 'تم الحفظ', en: 'Saved' },
    error: { ar: 'فشل الحفظ', en: 'Save failed' },
    retry: { ar: 'إعادة المحاولة', en: 'Retry' },
    lastSaved: { ar: 'آخر حفظ:', en: 'Last saved:' },
  }
  return translations[key]?.[lang] || key
}

/**
 * Save Indicator Component
 * Shows current save status with animation
 */
export function SaveIndicator({ 
  status, 
  lastSaved,
  language,
  error,
  onRetry
}: SaveIndicatorProps): JSX.Element {
  return (
    <div 
      className={`save-indicator save-indicator--${status}`}
      role="status"
      aria-live="polite"
    >
      {status === 'saving' && (
        <>
          <Loader2 size={14} className="animate-spin icon-saving" />
          <span className="save-text">{t('saving', language)}</span>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <Check size={14} className="icon-saved animate-checkmark" />
          <span className="save-text">{t('saved', language)}</span>
        </>
      )}
      
      {status === 'error' && (
        <>
          <AlertCircle size={14} className="icon-error" />
          <span className="save-text">{t('error', language)}</span>
          {onRetry && (
            <button 
              className="retry-btn"
              onClick={onRetry}
              title={error?.message}
            >
              {t('retry', language)}
            </button>
          )}
        </>
      )}
      
      {status === 'idle' && lastSaved && (
        <>
          <Cloud size={14} className="icon-idle" />
          <span className="save-text save-text--muted">
            {t('lastSaved', language)} {formatRelativeTime(lastSaved, language)}
          </span>
        </>
      )}
    </div>
  )
}
