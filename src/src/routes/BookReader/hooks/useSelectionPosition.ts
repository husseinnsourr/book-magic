// ═══════════════════════════════════════════════════════════════════════════
// useSelectionPosition - Track text selection position for toolbar
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, RefObject } from 'react'

interface Position {
  top: number
  left: number
}

interface UseSelectionPositionReturn {
  isVisible: boolean
  position: Position
  selectedText: string
  selectionRect: DOMRect | null
}

/**
 * Hook to track text selection and calculate toolbar position
 */
export function useSelectionPosition(
  containerRef?: RefObject<HTMLElement>
): UseSelectionPositionReturn {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)

  const updatePosition = useCallback(() => {
    const selection = window.getSelection()
    
    // Check if there's a valid selection with text
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setIsVisible(false)
      setSelectedText('')
      setSelectionRect(null)
      return
    }
    
    // Check if selection is within container (if provided)
    if (containerRef?.current) {
      const range = selection.getRangeAt(0)
      if (!containerRef.current.contains(range.commonAncestorContainer)) {
        setIsVisible(false)
        return
      }
    }
    
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    // Calculate position (above selection, centered horizontally)
    const top = rect.top + window.scrollY - 8 // 8px above selection
    const left = rect.left + window.scrollX + (rect.width / 2) // Centered
    
    setPosition({ top, left })
    setSelectedText(selection.toString())
    setSelectionRect(rect)
    setIsVisible(true)
  }, [containerRef])

  // Hide toolbar on scroll
  const handleScroll = useCallback(() => {
    if (isVisible) {
      updatePosition()
    }
  }, [isVisible, updatePosition])

  // Hide on click outside
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as Element
    // Don't hide if clicking on the toolbar itself
    if (target.closest('.selection-toolbar')) {
      return
    }
    // Hide after a short delay to allow click handling
    setTimeout(() => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        setIsVisible(false)
      }
    }, 10)
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', updatePosition)
    document.addEventListener('mouseup', updatePosition)
    document.addEventListener('scroll', handleScroll, true)
    document.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      document.removeEventListener('selectionchange', updatePosition)
      document.removeEventListener('mouseup', updatePosition)
      document.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [updatePosition, handleScroll, handleMouseDown])

  return { isVisible, position, selectedText, selectionRect }
}
