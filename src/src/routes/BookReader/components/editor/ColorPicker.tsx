import { useState } from 'react'
import { Check, ChevronDown, Type, Highlighter } from 'lucide-react'
import { t, Language } from '../../i18n'
import '../../styles/micro-interactions.css'

interface ColorPickerProps {
  onColorChange: (color: string) => void
  activeColor?: string
  type: 'text' | 'highlight'
  language: Language
}

const TEXT_COLORS = [
  { value: '#000000', label: 'Default' },
  { value: '#6B7280', label: 'Gray' },
  { value: '#B91C1C', label: 'Red' },
  { value: '#C2410C', label: 'Orange' },
  { value: '#B45309', label: 'Amber' },
  { value: '#15803D', label: 'Green' },
  { value: '#1D4ED8', label: 'Blue' },
  { value: '#4338CA', label: 'Indigo' },
  { value: '#7E22CE', label: 'Purple' },
  { value: '#BE185D', label: 'Pink' },
]

const HIGHLIGHT_COLORS = [
  { value: 'transparent', label: 'None' },
  { value: '#FEF3C7', label: 'Yellow' },
  { value: '#FEE2E2', label: 'Red' },
  { value: '#FFEDD5', label: 'Orange' },
  { value: '#DCFCE7', label: 'Green' },
  { value: '#DBEAFE', label: 'Blue' },
  { value: '#E0E7FF', label: 'Indigo' },
  { value: '#F3E8FF', label: 'Purple' },
  { value: '#FCE7F3', label: 'Pink' },
  { value: '#F3F4F6', label: 'Gray' },
]

export function ColorPicker({
  onColorChange,
  activeColor,
  type,
  language
}: ColorPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const colors = type === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS
  const Icon = type === 'text' ? Type : Highlighter

  const handleSelect = (color: string) => {
    onColorChange(color)
    setIsOpen(false)
  }

  return (
    <div className="color-picker-container relative">
      <button
        className={`flex items-center gap-2 p-2 rounded-md hover:bg-[var(--bg-secondary)] hover-lift focus-ring w-full justify-between border border-[var(--border-subtle)]`}
        onClick={() => setIsOpen(!isOpen)}
        title={type === 'text' ? t('textColor', language) : t('highlightColor', language)}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-md flex items-center justify-center border border-[var(--border-subtle)]"
            style={{ 
              backgroundColor: type === 'highlight' && activeColor !== 'transparent' ? activeColor : undefined,
              color: type === 'text' ? activeColor : undefined
            }}
          >
            <Icon size={14} />
          </div>
          <span className="text-sm font-medium">
            {type === 'text' ? t('Text Color', language) : t('Highlight', language)}
          </span>
        </div>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                className="w-8 h-8 rounded-md flex items-center justify-center hover:scale-110 transition-transform focus-ring"
                style={{ 
                  backgroundColor: color.value === 'transparent' ? 'transparent' : color.value,
                  border: color.value === 'transparent' ? '1px dashed var(--text-muted)' : 'none'
                }}
                onClick={() => handleSelect(color.value)}
                title={color.label}
              >
                {activeColor === color.value && (
                  <Check 
                    size={14} 
                    color={type === 'text' || color.value === 'transparent' ? 'var(--text-primary)' : '#000'} 
                  />
                )}
                {color.value === 'transparent' && <div className="w-full h-[1px] bg-red-500 absolute rotate-45" />}
              </button>
            ))}
          </div>
          
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
             <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">Custom:</span>
                <input 
                  type="color" 
                  className="w-full h-6 rounded cursor-pointer"
                  value={activeColor && activeColor.startsWith('#') ? activeColor : '#000000'}
                  onChange={(e) => onColorChange(e.target.value)}
                />
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
