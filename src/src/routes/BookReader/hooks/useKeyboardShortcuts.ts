// ═══════════════════════════════════════════════════════════════════════════
// useKeyboardShortcuts - Keyboard shortcut management
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useCallback, useRef } from 'react'

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description?: string
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  preventDefault?: boolean
}

/**
 * Hook to manage keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  options: UseKeyboardShortcutsOptions = {}
): void {
  const { enabled = true, preventDefault = true } = options
  const shortcutsRef = useRef(shortcuts)
  
  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return
    
    // Don't interfere with input fields (unless in contentEditable)
    const target = e.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    const isContentEditable = target.getAttribute('contenteditable') === 'true'
    
    // Skip if in regular input (not contentEditable)
    if (isInput && !isContentEditable) return
    
    for (const shortcut of shortcutsRef.current) {
      const ctrlMatch = shortcut.ctrl 
        ? (e.ctrlKey || e.metaKey) 
        : !(e.ctrlKey || e.metaKey)
      
      const shiftMatch = shortcut.shift 
        ? e.shiftKey 
        : !e.shiftKey
      
      const altMatch = shortcut.alt 
        ? e.altKey 
        : !e.altKey
      
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
      
      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        if (preventDefault) {
          e.preventDefault()
        }
        shortcut.action()
        return
      }
    }
  }, [enabled, preventDefault])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Predefined shortcut sets for common operations
 */
export const createEditorShortcuts = (handlers: {
  bold?: () => void
  italic?: () => void
  underline?: () => void
  strikethrough?: () => void
  link?: () => void
  save?: () => void
  undo?: () => void
  redo?: () => void
  exitEdit?: () => void
}): Shortcut[] => {
  const shortcuts: Shortcut[] = []
  
  if (handlers.bold) {
    shortcuts.push({ 
      key: 'b', 
      ctrl: true, 
      action: handlers.bold,
      description: 'Bold'
    })
  }
  
  if (handlers.italic) {
    shortcuts.push({ 
      key: 'i', 
      ctrl: true, 
      action: handlers.italic,
      description: 'Italic'
    })
  }
  
  if (handlers.underline) {
    shortcuts.push({ 
      key: 'u', 
      ctrl: true, 
      action: handlers.underline,
      description: 'Underline'
    })
  }
  
  if (handlers.strikethrough) {
    shortcuts.push({ 
      key: 'd', 
      ctrl: true, 
      shift: true,
      action: handlers.strikethrough,
      description: 'Strikethrough'
    })
  }
  
  if (handlers.link) {
    shortcuts.push({ 
      key: 'k', 
      ctrl: true, 
      action: handlers.link,
      description: 'Insert Link'
    })
  }
  
  if (handlers.save) {
    shortcuts.push({ 
      key: 's', 
      ctrl: true, 
      action: handlers.save,
      description: 'Save'
    })
  }
  
  if (handlers.undo) {
    shortcuts.push({ 
      key: 'z', 
      ctrl: true, 
      action: handlers.undo,
      description: 'Undo'
    })
  }
  
  if (handlers.redo) {
    shortcuts.push({ 
      key: 'z', 
      ctrl: true, 
      shift: true,
      action: handlers.redo,
      description: 'Redo'
    })
    shortcuts.push({ 
      key: 'y', 
      ctrl: true, 
      action: handlers.redo,
      description: 'Redo'
    })
  }
  
  if (handlers.exitEdit) {
    shortcuts.push({ 
      key: 'Escape', 
      action: handlers.exitEdit,
      description: 'Exit Edit Mode'
    })
  }
  
  return shortcuts
}

/**
 * Navigation shortcuts for reading mode
 */
export const createNavigationShortcuts = (handlers: {
  nextPage?: () => void
  prevPage?: () => void
  firstPage?: () => void
  lastPage?: () => void
  toggleFullscreen?: () => void
  zoomIn?: () => void
  zoomOut?: () => void
  resetZoom?: () => void
}): Shortcut[] => {
  const shortcuts: Shortcut[] = []
  
  if (handlers.nextPage) {
    shortcuts.push({ key: 'ArrowLeft', action: handlers.nextPage })
    shortcuts.push({ key: 'PageDown', action: handlers.nextPage })
    shortcuts.push({ key: ' ', action: handlers.nextPage }) // Space
  }
  
  if (handlers.prevPage) {
    shortcuts.push({ key: 'ArrowRight', action: handlers.prevPage })
    shortcuts.push({ key: 'PageUp', action: handlers.prevPage })
  }
  
  if (handlers.firstPage) {
    shortcuts.push({ key: 'Home', action: handlers.firstPage })
  }
  
  if (handlers.lastPage) {
    shortcuts.push({ key: 'End', action: handlers.lastPage })
  }
  
  if (handlers.toggleFullscreen) {
    shortcuts.push({ key: 'f', action: handlers.toggleFullscreen })
    shortcuts.push({ key: 'F11', action: handlers.toggleFullscreen })
  }
  
  if (handlers.zoomIn) {
    shortcuts.push({ key: '=', ctrl: true, action: handlers.zoomIn })
    shortcuts.push({ key: '+', ctrl: true, action: handlers.zoomIn })
  }
  
  if (handlers.zoomOut) {
    shortcuts.push({ key: '-', ctrl: true, action: handlers.zoomOut })
  }
  
  if (handlers.resetZoom) {
    shortcuts.push({ key: '0', ctrl: true, action: handlers.resetZoom })
  }
  
  return shortcuts
}
