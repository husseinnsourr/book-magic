// ═══════════════════════════════════════════════════════════════════════════
// Selection Toolbar - Floating toolbar on text selection (like Medium/Notion)
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useEffect, useState, useCallback } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Link2, 
  Highlighter,
  ChevronDown,
  Check,
  X
} from 'lucide-react'
import { useSelectionPosition } from '../../hooks/useSelectionPosition'
import './styles/selection.css'

// Types
type Language = 'ar' | 'en'

interface SelectionToolbarProps {
  onFormat: (command: string, value?: string) => void
  language: Language
  isRTL: boolean
}

// Highlight color options
const highlightColors = [
  { name: 'yellow', value: '#fff59d' },
  { name: 'green', value: '#a5d6a7' },
  { name: 'blue', value: '#90caf9' },
  { name: 'pink', value: '#f48fb1' },
  { name: 'orange', value: '#ffcc80' },
]

// Translations
const t = (key: string, lang: Language): string => {
  const translations: Record<string, { ar: string; en: string }> = {
    bold: { ar: 'عريض', en: 'Bold' },
    italic: { ar: 'مائل', en: 'Italic' },
    underline: { ar: 'تسطير', en: 'Underline' },
    strikethrough: { ar: 'يتوسطه خط', en: 'Strikethrough' },
    highlight: { ar: 'تمييز', en: 'Highlight' },
    link: { ar: 'رابط', en: 'Link' },
    addLink: { ar: 'أضف رابط', en: 'Add link' },
    enterUrl: { ar: 'أدخل الرابط...', en: 'Enter URL...' },
  }
  return translations[key]?.[lang] || key
}

/**
 * Selection Toolbar Component
 * Appears when user selects text in the editor
 */
export function SelectionToolbar({ 
  onFormat, 
  language,
  isRTL 
}: SelectionToolbarProps): JSX.Element | null {
  const { isVisible, position, selectedText } = useSelectionPosition()
  const toolbarRef = useRef<HTMLDivElement>(null)
  
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  
  // Check which formats are currently active
  useEffect(() => {
    if (isVisible) {
      const formats = new Set<string>()
      if (document.queryCommandState('bold')) formats.add('bold')
      if (document.queryCommandState('italic')) formats.add('italic')
      if (document.queryCommandState('underline')) formats.add('underline')
      if (document.queryCommandState('strikethrough')) formats.add('strikethrough')
      setActiveFormats(formats)
    }
  }, [isVisible, selectedText])

  // Handle format button click
  const handleFormat = useCallback((command: string, value?: string) => {
    onFormat(command, value)
    
    // Update active formats
    setActiveFormats(prev => {
      const next = new Set(prev)
      if (next.has(command)) {
        next.delete(command)
      } else {
        next.add(command)
      }
      return next
    })
  }, [onFormat])

  // Handle highlight
  const handleHighlight = useCallback((color: string) => {
    onFormat('hiliteColor', color)
    setShowColorPicker(false)
  }, [onFormat])

  // Handle link submission
  const handleLinkSubmit = useCallback(() => {
    if (linkUrl.trim()) {
      onFormat('createLink', linkUrl)
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }, [linkUrl, onFormat])

  // Close panels on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowColorPicker(false)
        setShowLinkInput(false)
      }
      if (e.key === 'Enter' && showLinkInput) {
        e.preventDefault()
        handleLinkSubmit()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showLinkInput, handleLinkSubmit])

  // Don't render if no selection
  if (!isVisible || !selectedText) {
    return null
  }

  return (
    <div 
      ref={toolbarRef}
      className="selection-toolbar animate-toolbarAppear"
      style={{
        top: position.top,
        left: position.left,
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
      role="toolbar"
      aria-label={language === 'ar' ? 'أدوات التنسيق' : 'Formatting tools'}
    >
      <div className="toolbar-content">
        {/* Format Buttons */}
        <div className="toolbar-group">
          <button
            className={`toolbar-btn ${activeFormats.has('bold') ? 'active' : ''}`}
            onClick={() => handleFormat('bold')}
            title={`${t('bold', language)} (⌘B)`}
            aria-pressed={activeFormats.has('bold')}
          >
            <Bold size={16} />
          </button>
          
          <button
            className={`toolbar-btn ${activeFormats.has('italic') ? 'active' : ''}`}
            onClick={() => handleFormat('italic')}
            title={`${t('italic', language)} (⌘I)`}
            aria-pressed={activeFormats.has('italic')}
          >
            <Italic size={16} />
          </button>
          
          <button
            className={`toolbar-btn ${activeFormats.has('underline') ? 'active' : ''}`}
            onClick={() => handleFormat('underline')}
            title={`${t('underline', language)} (⌘U)`}
            aria-pressed={activeFormats.has('underline')}
          >
            <Underline size={16} />
          </button>
          
          <button
            className={`toolbar-btn ${activeFormats.has('strikethrough') ? 'active' : ''}`}
            onClick={() => handleFormat('strikethrough')}
            title={t('strikethrough', language)}
            aria-pressed={activeFormats.has('strikethrough')}
          >
            <Strikethrough size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Highlight */}
        <div className="toolbar-group">
          <div className="dropdown-container">
            <button
              className={`toolbar-btn ${showColorPicker ? 'active' : ''}`}
              onClick={() => {
                setShowColorPicker(!showColorPicker)
                setShowLinkInput(false)
              }}
              title={t('highlight', language)}
              aria-expanded={showColorPicker}
              aria-haspopup="true"
            >
              <Highlighter size={16} />
              <ChevronDown size={12} className="chevron" />
            </button>
            
            {showColorPicker && (
              <div className="color-picker-dropdown" role="menu">
                {highlightColors.map(color => (
                  <button
                    key={color.name}
                    className="color-option"
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleHighlight(color.value)}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-divider" />

        {/* Link */}
        <div className="toolbar-group">
          <button
            className={`toolbar-btn ${showLinkInput ? 'active' : ''}`}
            onClick={() => {
              setShowLinkInput(!showLinkInput)
              setShowColorPicker(false)
            }}
            title={`${t('link', language)} (⌘K)`}
            aria-expanded={showLinkInput}
          >
            <Link2 size={16} />
          </button>
        </div>
      </div>

      {/* Link Input Panel */}
      {showLinkInput && (
        <div className="link-input-panel">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={t('enterUrl', language)}
            className="link-input"
            autoFocus
          />
          <button
            className="link-submit"
            onClick={handleLinkSubmit}
            disabled={!linkUrl.trim()}
            title={t('addLink', language)}
          >
            <Check size={14} />
          </button>
          <button
            className="link-cancel"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Arrow */}
      <div className="toolbar-arrow" />
    </div>
  )
}
