import { X } from 'lucide-react'
import { Theme, useSettingsStore } from '../store'
import { t, Language } from '../i18n'
import '../styles/main.css'

interface SettingsPanelProps {
  onClose: () => void
  language: Language
  isRTL: boolean
}

export function SettingsPanel({ onClose, language }: SettingsPanelProps): JSX.Element {
  const settings = useSettingsStore()

  return (
    <div className="settings-overlay" onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
    }}>
      <div className="settings-panel">
        <div className="flex justify-between items-center mb-6">
            <h3>{t('settings', language)}</h3>
            <button onClick={onClose} className="p-1 hover:bg-[var(--bg-hover)] rounded-md transition-colors">
                <X size={20} className="text-[var(--text-secondary)]" />
            </button>
        </div>

        {/* Theme Settings */}
        <div className="setting-group">
          <label>{t('Colors', language)}</label>
          <div className="theme-buttons">
            {(['dark', 'sepia', 'light'] as Theme[]).map((themeName) => (
              <button
                key={themeName}
                onClick={() => settings.setTheme(themeName)}
                className={settings.theme === themeName ? 'active' : ''}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Typography Settings */}
        <div className="setting-group">
          <label>{t('fontAndSize', language)}</label>
          <div className="flex items-center gap-4">
             <span className="text-xs w-8 text-center">{settings.fontSize}</span>
             <input
                type="range"
                min="12"
                max="32"
                step="1"
                value={settings.fontSize}
                onChange={(e) => settings.setFontSize(parseInt(e.target.value))}
             />
          </div>
        </div>

        {/* Layout Settings */}
        <div className="setting-group">
            <label>{t('displaySettings', language)}</label>
             <div className="mb-4">
                 <div className="flex justify-between text-xs mb-1 text-[var(--text-secondary)]">
                     <span>Margins</span>
                     <span>{settings.margins}px</span>
                 </div>
                <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={settings.margins}
                    onChange={(e) => settings.setMargins(parseInt(e.target.value))}
                />
             </div>
             
             <div className="mb-4">
                 <div className="flex justify-between text-xs mb-1 text-[var(--text-secondary)]">
                     <span>Dimming (Focus)</span>
                     <span>{settings.dimming}%</span>
                 </div>
                <input
                    type="range"
                    min="0"
                    max="75"
                    step="5"
                    value={settings.dimming}
                    onChange={(e) => settings.setDimming(parseInt(e.target.value))}
                />
             </div>
        </div>

      </div>
    </div>
  )
}
