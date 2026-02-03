// Book Reader - Dock Component
// ═══════════════════════════════════════════════════════════════════════════

import {
  Type,
  Bold,
  AlignRight,
  Image,
  Save,
  Settings,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { DockPanels } from './DockPanels'
import { FormatCommand } from '../hooks'
import { t, Language } from '../i18n'
import './styles/dock.css'

interface ReaderDockProps {
  activePanel: string | null
  setActivePanel: (panel: string | null) => void
  setIsEditMode: (mode: boolean) => void
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
  onSave: () => void
  onBack: () => void
  language: Language
  isRTL: boolean
}

export function ReaderDock({
  activePanel,
  setActivePanel,
  setIsEditMode,
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
  onSave,
  onBack,
  language,
  isRTL
}: ReaderDockProps): JSX.Element {
  
  const togglePanel = (panel: string) => {
    setActivePanel(activePanel === panel ? null : panel)
    setIsEditMode(true)
  }

  // Back arrow direction based on RTL/LTR
  const BackIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <aside className={`dynamic-dock ${isRTL ? '' : 'ltr'}`}>
      {/* Dock Icons Strip */}
      <div className="dock-strip">
        {/* Font Panel */}
        <button 
          className={`dock-btn ${activePanel === 'font' ? 'active' : ''}`}
          onClick={() => togglePanel('font')}
          title={t('font', language)}
        >
          <div className="dock-icon"><Type size={18} /></div>
          <span className="dock-tooltip">{t('font', language)}</span>
        </button>

        {/* Format Panel */}
        <button 
          className={`dock-btn ${activePanel === 'format' ? 'active' : ''}`}
          onClick={() => togglePanel('format')}
          title={t('format', language)}
        >
          <div className="dock-icon"><Bold size={18} /></div>
          <span className="dock-tooltip">{t('format', language)}</span>
        </button>

        {/* Align Panel */}
        <button 
          className={`dock-btn ${activePanel === 'align' ? 'active' : ''}`}
          onClick={() => togglePanel('align')}
          title={t('align', language)}
          aria-label={t('align', language)}
          aria-expanded={activePanel === 'align'}
        >
          <div className="dock-icon"><AlignRight size={18} /></div>
          <span className="dock-tooltip">{t('align', language)}</span>
        </button>

        {/* Insert Panel */}
        <button 
          className={`dock-btn ${activePanel === 'insert' ? 'active' : ''}`}
          onClick={() => togglePanel('insert')}
          title={t('insert', language)}
        >
          <div className="dock-icon"><Image size={18} /></div>
          <span className="dock-tooltip">{t('insert', language)}</span>
        </button>

        <div className="dock-divider" />

        {/* Save */}
        <button 
          className="dock-btn save-action"
          onClick={onSave}
          title={t('save', language)}
        >
          <div className="dock-icon"><Save size={18} /></div>
          <span className="dock-tooltip">{t('save', language)}</span>
        </button>

        {/* Settings */}
        <button 
          className={`dock-btn ${activePanel === 'settings' ? 'active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'settings' ? null : 'settings')}
          title={t('settings', language)}
        >
          <div className="dock-icon"><Settings size={18} /></div>
          <span className="dock-tooltip">{t('settings', language)}</span>
        </button>

        {/* Back */}
        <button className="dock-btn" onClick={onBack} title={t('back', language)}>
          <div className="dock-icon"><BackIcon size={18} /></div>
          <span className="dock-tooltip">{t('back', language)}</span>
        </button>
      </div>

      {/* Pop-out Panels */}
      <DockPanels
        activePanel={activePanel}
        activeFormats={activeFormats}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        execFormat={execFormat}
        changeTextColor={changeTextColor}
        highlightText={highlightText}
        insertImage={insertImage}
        insertLink={insertLink}
        language={language}
        isRTL={isRTL}
      />
    </aside>
  )
}
