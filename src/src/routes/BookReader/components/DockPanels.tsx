// Book Reader - Dock Panels Component
// ═══════════════════════════════════════════════════════════════════════════

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  Image,
  Undo,
  Redo
} from 'lucide-react'
import { ColorPicker } from './editor/ColorPicker'
import { FontPicker } from './editor/FontPicker'
import { FormatCommand } from '../hooks'
import { t, Language } from '../i18n'
import './styles/dock.css'
import '../styles/micro-interactions.css'

interface DockPanelsProps {
  activePanel: string | null
  activeFormats: Set<string>
  fontFamily: string
  setFontFamily: (font: string) => void
  fontSize: number
  setFontSize: (size: number) => void
  execFormat: (command: FormatCommand) => void
  changeTextColor: (color: string) => void
  highlightText: (color?: string) => void
  insertImage: () => void
  insertLink: () => void
  language: Language
  isRTL: boolean
}

export function DockPanels({
  activePanel,
  activeFormats,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  execFormat,
  changeTextColor,
  highlightText,
  insertImage,
  insertLink,
  language,
  isRTL
}: DockPanelsProps): JSX.Element | null {
  if (!activePanel) return null

  return (
    <div className={`dock-panel animate-slideRight ${isRTL ? '' : 'ltr'}`}>
      {/* Font Panel */}
      {activePanel === 'font' && (
        <div className="panel-content space-y-4">
          <h3>{t('fontAndSize', language)}</h3>
          <div className="panel-section">
            <FontPicker 
              currentFont={fontFamily}
              onFontChange={setFontFamily}
              currentSize={fontSize}
              onSizeChange={setFontSize}
              language={language}
            />
          </div>
          
          <div className="border-t border-[var(--border-subtle)] pt-4 my-2"></div>

          <h3>{t('Colors', language)}</h3>
          <div className="flex flex-col gap-3">
            <ColorPicker 
              type="text"
              onColorChange={changeTextColor}
              language={language}
            />
            <ColorPicker 
              type="highlight"
              onColorChange={highlightText}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Format Panel */}
      {activePanel === 'format' && (
        <div className="panel-content">
          <h3>{t('textFormatting', language)}</h3>
          <div className="tools-grid">
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('bold') ? 'active' : ''}`} 
              onClick={() => execFormat('bold')} 
              title={`${t('bold', language)} (Ctrl+B)`}
            >
              <Bold size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('italic') ? 'active' : ''}`} 
              onClick={() => execFormat('italic')} 
              title={`${t('italic', language)} (Ctrl+I)`}
            >
              <Italic size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('underline') ? 'active' : ''}`} 
              onClick={() => execFormat('underline')} 
              title={`${t('underline', language)} (Ctrl+U)`}
            >
              <Underline size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('strikeThrough') ? 'active' : ''}`} 
              onClick={() => execFormat('strikeThrough')} 
              title={t('strikethrough', language)}
            >
              <Strikethrough size={16} />
            </button>
          </div>
          <h3 style={{ marginTop: '16px' }}>{t('undoRedo', language)}</h3>
          <div className="tools-grid">
            <button className="grid-btn hover-lift" onClick={() => execFormat('undo')} title={`${t('undo', language)} (Ctrl+Z)`}>
              <Undo size={16} />
            </button>
            <button className="grid-btn hover-lift" onClick={() => execFormat('redo')} title={`${t('redo', language)} (Ctrl+Y)`}>
              <Redo size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Align Panel */}
      {activePanel === 'align' && (
        <div className="panel-content">
          <h3>{t('alignment', language)}</h3>
          <div className="tools-grid">
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('justifyRight') ? 'active' : ''}`} 
              onClick={() => execFormat('justifyRight')} 
              title={t('alignRight', language)}
            >
              <AlignRight size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('justifyCenter') ? 'active' : ''}`} 
              onClick={() => execFormat('justifyCenter')} 
              title={t('alignCenter', language)}
            >
              <AlignCenter size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('justifyLeft') ? 'active' : ''}`} 
              onClick={() => execFormat('justifyLeft')} 
              title={t('alignLeft', language)}
            >
              <AlignLeft size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('justifyFull') ? 'active' : ''}`} 
              onClick={() => execFormat('justifyFull')} 
              title={t('justify', language)}
            >
              <AlignJustify size={16} />
            </button>
          </div>
          <h3 style={{ marginTop: '16px' }}>{t('lists', language)}</h3>
          <div className="tools-grid">
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('insertUnorderedList') ? 'active' : ''}`} 
              onClick={() => execFormat('insertUnorderedList')} 
              title={t('bulletList', language)}
            >
              <List size={16} />
            </button>
            <button 
              className={`grid-btn hover-lift ${activeFormats.has('insertOrderedList') ? 'active' : ''}`} 
              onClick={() => execFormat('insertOrderedList')} 
              title={t('numberedList', language)}
            >
              <ListOrdered size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Insert Panel */}
      {activePanel === 'insert' && (
        <div className="panel-content">
          <h3>{t('insertElements', language)}</h3>
          <div className="menu-list">
            <button className="menu-item hover-lift" onClick={insertImage}>
              <Image size={16} />
              <span>{t('image', language)}</span>
            </button>
            <button className="menu-item hover-lift" onClick={insertLink}>
              <Link2 size={16} />
              <span>{t('link', language)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel - simplified as now handled by FontPicker/ColorPicker */}
      {activePanel === 'settings' && (
        <div className="panel-content">
          <p className="text-sm text-[var(--text-secondary)]">
            {t('settingsMoved', language) || 'Settings are now in the top bar'}
          </p>
        </div>
      )}
    </div>
  )
}
