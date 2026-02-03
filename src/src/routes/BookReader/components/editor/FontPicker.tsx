import { ChevronDown } from 'lucide-react'
import { t, Language } from '../../i18n'
import '../../styles/micro-interactions.css'

interface FontPickerProps {
  currentFont: string
  onFontChange: (font: string) => void
  currentSize: number
  onSizeChange: (size: number) => void
  language: Language
}

const FONTS = [
  { value: 'Inter', label: 'Inter (Sans)' },
  { value: 'Merriweather', label: 'Merriweather (Serif)' },
  { value: 'Fira Code', label: 'Fira Code (Mono)' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Amiri', label: 'Amiri' },
  { value: 'Tajawal', label: 'Tajawal' },
]

export function FontPicker({
  currentFont,
  onFontChange,
  currentSize,
  onSizeChange,
  language
}: FontPickerProps): JSX.Element {
  
  return (
    <div className="font-picker-container flex flex-col gap-3">
      {/* Font Family Selector */}
      <div className="relative group">
        <label className="text-xs text-[var(--text-muted)] mb-1 block">{t('Font Family', language)}</label>
        <div className="relative">
          <select
            value={currentFont}
            onChange={(e) => onFontChange(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md py-2 px-3 pr-8 text-sm focus-ring hover-lift cursor-pointer"
            style={{ fontFamily: currentFont }}
          >
            {FONTS.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Font Size Selector */}
      <div>
        <div className="flex justify-between mb-1">
            <label className="text-xs text-[var(--text-muted)]">{t('Size', language)}</label>
            <span className="text-xs font-mono">{currentSize}px</span>
        </div>
        <div className="flex items-center gap-2">
            <button 
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                onClick={() => onSizeChange(Math.max(12, currentSize - 1))}
            >
                -
            </button>
            <input
                type="range"
                min="12"
                max="32"
                step="1"
                value={currentSize}
                onChange={(e) => onSizeChange(parseInt(e.target.value))}
                className="flex-1 h-1 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            />
             <button 
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                onClick={() => onSizeChange(Math.min(32, currentSize + 1))}
            >
                +
            </button>
        </div>
      </div>
    </div>
  )
}
