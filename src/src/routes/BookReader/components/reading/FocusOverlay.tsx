import { useSettingsStore } from '../../store'
import '../../styles/micro-interactions.css'

interface FocusOverlayProps {
  contentRef: React.RefObject<HTMLDivElement>
}

// contentRef is used for future implementation of paragraph tracking
// Fixed line 9
export function FocusOverlay({ contentRef: _contentRef }: FocusOverlayProps): JSX.Element | null {
  const { dimming, focusMode } = useSettingsStore(state => ({
    focusMode: state.focusMode,
    dimming: state.dimming
  }))
  
  // This is a simplified version. A real implementation would need to track 
  // mouse position or cursor position to determine "focus" area.
  // For now, we'll just demonstrate the overlay structure.
  
  if (focusMode === 'none') return null

  return (
    <div 
      className="focus-overlay pointer-events-none fixed inset-0 z-40 transition-opacity duration-300"
      style={{
        background: `rgba(0,0,0, ${dimming / 100})`,
        // We'll use mask-image to create the "spotlight" effect
        // maskImage: 'radial-gradient(circle at center, transparent 100px, black 150px)'
      }}
    >
        {/* Actual implementation of line/paragraph tracking would go here */}
    </div>
  )
}
