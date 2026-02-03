import { useEffect } from 'react'
import { useReaderStore } from '../../store'

export function ImmersiveMode(): JSX.Element | null {
  const { isImmersiveMode, toggleImmersiveMode } = useReaderStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Toggle on F11
      if (e.key === 'F11') {
        e.preventDefault()
        toggleImmersiveMode()
      }
      // Exit on Escape
      if (e.key === 'Escape' && isImmersiveMode) {
        e.preventDefault()
        toggleImmersiveMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isImmersiveMode, toggleImmersiveMode])

  useEffect(() => {
    // Optional: Request browser fullscreen when active
    if (isImmersiveMode) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {})
      }
    }
  }, [isImmersiveMode])

  // This component doesn't render visual UI itself, 
  // but controls the state that affects other components.
  // We could add a "Press Esc to exit" toast here if we wanted.
  return null
}
