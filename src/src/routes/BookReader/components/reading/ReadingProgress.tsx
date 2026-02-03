import { useReaderStore } from '../../store'
import { Language } from '../../i18n'
import '../../styles/micro-interactions.css'

interface ReadingProgressProps {
  language: Language
  isRTL: boolean
}

// t and language will be used for localized tooltips in the future
export function ReadingProgress({ isRTL }: Omit<ReadingProgressProps, 'language'> & { language: Language }): JSX.Element | null {
  const { currentPage, totalPages, isImmersiveMode } = useReaderStore()

  if (totalPages <= 1) return null

  const progress = Math.min(100, Math.max(0, (currentPage / totalPages) * 100))

  return (
    <div 
      className={`reading-progress-container fixed top-0 left-0 right-0 z-50 pointer-events-none transition-opacity duration-300 ${isImmersiveMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
      style={{ height: '4px' }}
    >
      <div 
        className="h-full bg-[var(--accent-primary)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, marginLeft: isRTL ? 'auto' : '0', marginRight: isRTL ? '0' : 'auto' }}
      />
      
      {/* Optional: Floating progress text on hover or always */}
      <div className={`absolute top-2 ${isRTL ? 'left-4' : 'right-4'} bg-[var(--bg-elevated)] px-2 py-1 rounded text-xs shadow-sm border border-[var(--border-subtle)] opacity-0 group-hover:opacity-100 transition-opacity`}>
        {/* We can add a translation key for 'Page X of Y' later, for now hardcoded format or simple concatenation */}
        {currentPage} / {totalPages} ({Math.round(progress)}%)
      </div>
    </div>
  )
}
