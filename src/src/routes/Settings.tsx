import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { ImageCropper } from '../components/ImageCropper'
import { 
  Palette, 
  Moon, 
  Sun,
  Globe,
  HardDrive,
  Upload,
  Download,
  Cloud,
  Shield,
  Info,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  Clock,
  Type,
  Image,
  Check,
  Trash2
} from 'lucide-react'
import './Settings.css'

// SVG Icons for cloud services
const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M7.71 3.5L1.15 15l4.58 7.5h6.43l-4.58-7.5L7.71 3.5z"/>
    <path d="M8.14 3.5h8.12l4.58 7.5H12.72L8.14 3.5z"/>
    <path d="M22.85 15l-4.58-7.5-4.58 7.5 4.58 7.5 4.58-7.5z" opacity="0.7"/>
  </svg>
)

const DropboxIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M6 2L0 6l6 4l6-4L6 2zm12 0l-6 4l6 4l6-4l-6-4zM0 14l6 4l6-4l-6-4l-6 4zm18-4l-6 4l6 4l6-4l-6-4zM6 19l6 4l6-4l-6-4l-6 4z"/>
  </svg>
)

const OneDriveIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M10.5 18.5h9.75c2.07 0 3.75-1.68 3.75-3.75 0-1.69-1.12-3.11-2.66-3.58-.06-2.58-2.17-4.67-4.78-4.67-1.56 0-2.95.75-3.83 1.91-.53-.27-1.13-.41-1.76-.41-2.13 0-3.87 1.74-3.87 3.87 0 .17.01.34.04.5C4.49 12.55 2.5 14.64 2.5 17.18c0 .73.16 1.42.44 2.04.9-.46 1.88-.72 2.93-.72h4.63z"/>
  </svg>
)

function Settings(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage,
    arabicFont,
    englishFont,
    setArabicFont,
    setEnglishFont,
    libraryCover,
    setLibraryCover,
    customCovers,
    addCustomCover,
    removeCustomCover,
    libraryCoverHeight,
    setLibraryCoverHeight
  } = useStore()

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }
  
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [customCoverUrl, setCustomCoverUrl] = useState('')
  
  // Preset covers
  const coverPresets = [
    { id: 'abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2800&auto=format&fit=crop', label: 'Abstract' },
    { id: 'nature', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2800&auto=format&fit=crop', label: 'Nature' },
    { id: 'library', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2800&auto=format&fit=crop', label: 'Classic' },
    { id: 'dark', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2800&auto=format&fit=crop', label: 'Dark' },
  ]
  const handleCoverChange = (url: string) => {
    setLibraryCover(url)
  }

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file size (e.g. 5MB) before processing
    if (file.size > 5 * 1024 * 1024) {
      alert(t('settings.fileTooLarge') || 'File too large (max 5MB)')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropImageSrc(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCropSave = (croppedDataUrl: string) => {
    addCustomCover(croppedDataUrl)
    setLibraryCover(croppedDataUrl)
    setCropImageSrc(null)
  }

  return (
    <div className="settings animate-fadeIn">
      <h1>{t('settings.title')}</h1>

      <div className="settings-grid">
        {/* Appearance */}
        <section className="settings-section">
          <div className="section-header">
            <Palette size={18} />
            <h2>{t('settings.appearance')}</h2>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">{t('settings.theme')}</span>
            </div>
            <div className="theme-toggle">
              <button 
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                <Moon size={16} />
                <span>{t('settings.dark')}</span>
              </button>
              <button 
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                <Sun size={16} />
                <span>{t('settings.light')}</span>
              </button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Globe size={16} className="setting-icon" />
              <span className="setting-label">{t('settings.language')}</span>
            </div>
            <div className="language-toggle">
              <button 
                className={`lang-option ${language === 'ar' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('ar')}
              >
                {t('settings.arabic')}
              </button>
              <button 
                className={`lang-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                {t('settings.english')}
              </button>
            </div>
          </div>

           {/* Library Cover Settings */}
           <div className="setting-item">
             <div className="setting-info">
               <Image size={16} className="setting-icon" />
               <span className="setting-label">{t('settings.libraryCover') || 'صورة المكتبة'}</span>
             </div>
             
             {/* Hidden File Input */}
             <input 
               type="file" 
               ref={fileInputRef} 
               style={{ display: 'none' }} 
               accept="image/*"
               onChange={handleFileUpload}
             />
             
             <button 
                className="action-btn"
                onClick={() => fileInputRef.current?.click()}
                title={t('settings.uploadImage') || 'رفع صورة'}
             >
                <Upload size={14} />
                <span className="btn-label">{t('settings.upload') || 'رفع'}</span>
             </button>
           </div>
           
           <div className="cover-presets-grid">
             {coverPresets.map(preset => (
               <button
                 key={preset.id}
                 className={`cover-preset-btn ${libraryCover === preset.url ? 'active' : ''}`}
                 onClick={() => handleCoverChange(preset.url)}
                 style={{ backgroundImage: `url(${preset.url})` }}
                 title={preset.label}
               >
                 {libraryCover === preset.url && (
                   <div className="cover-selected-overlay">
                     <Check size={16} />
                   </div>
                 )}
               </button>
             ))}
             
             {/* Show uploaded history */}
             {customCovers.map((cover, index) => (
                <button
                  key={`custom-${index}`}
                  className={`cover-preset-btn ${libraryCover === cover ? 'active' : ''}`}
                  onClick={() => handleCoverChange(cover)}
                  style={{ backgroundImage: `url(${cover})` }}
                  title="Uploaded Image"
                >
                  {libraryCover === cover && (
                    <div className="cover-selected-overlay">
                      <Check size={16} />
                    </div>
                  )}
                  <div 
                    className="remove-cover-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomCover(cover);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </div>
                </button>
             ))}
           </div>
           
           <div className="setting-item">
             <div className="custom-url-input-wrapper">
               <input 
                 type="text" 
                 placeholder="أو ضع رابط صورة مخصصة..." 
                 className="custom-url-input"
                 value={customCoverUrl}
                 onChange={(e) => setCustomCoverUrl(e.target.value)}
                 onBlur={() => customCoverUrl && handleCoverChange(customCoverUrl)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && customCoverUrl) {
                     handleCoverChange(customCoverUrl)
                   }
                 }}
               />
             </div>
           </div>

           {/* Cover Settings: Height */}
           <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12, paddingBottom: 16 }}>
             <div className="setting-sub-control" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span className="setting-label-sm" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{t('settings.coverHeight') || 'ارتفاع الغلاف'}</span>
               <div className="language-toggle">
                 {['small', 'medium', 'large'].map((h) => (
                   <button
                     key={h}
                     className={`lang-option ${libraryCoverHeight === h ? 'active' : ''}`}
                     onClick={() => setLibraryCoverHeight(h as any)}
                     style={{ minWidth: 60, justifyContent: 'center' }}
                   >
                     {h === 'small' ? (t('settings.small') || 'صغير') : 
                      h === 'medium' ? (t('settings.medium') || 'متوسط') : 
                      (t('settings.large') || 'كبير')}
                   </button>
                 ))}
               </div>
             </div>
           </div>

          <div className="setting-item">
            <div className="setting-info">
              <Type size={16} className="setting-icon" />
              <span className="setting-label">{t('settings.arabicFont')}</span>
            </div>
            <div className="language-toggle font-options">
              <button 
                className={`lang-option ${arabicFont === 'default' ? 'active' : ''}`}
                onClick={() => setArabicFont('default')}
              >
                {t('settings.fontDefault')}
              </button>
              <button 
                className={`lang-option ${arabicFont === 'alt' ? 'active' : ''}`}
                onClick={() => setArabicFont('alt')}
              >
                {t('settings.fontAlt')}
              </button>
              <button 
                className={`lang-option ${arabicFont === 'alt2' ? 'active' : ''}`}
                onClick={() => setArabicFont('alt2')}
              >
                {t('settings.fontAlt2')}
              </button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Type size={16} className="setting-icon" />
              <span className="setting-label">{t('settings.englishFont')}</span>
            </div>
            <div className="language-toggle font-options">
              <button 
                className={`lang-option ${englishFont === 'default' ? 'active' : ''}`}
                onClick={() => setEnglishFont('default')}
              >
                {t('settings.fontEnDefault')}
              </button>
              <button 
                className={`lang-option ${englishFont === 'alt' ? 'active' : ''}`}
                onClick={() => setEnglishFont('alt')}
              >
                {t('settings.fontEnAlt')}
              </button>
              <button 
                className={`lang-option ${englishFont === 'alt2' ? 'active' : ''}`}
                onClick={() => setEnglishFont('alt2')}
              >
                {t('settings.fontEnAlt2')}
              </button>
            </div>
          </div>
        </section>

        {/* Data & Backup */}
        <section className="settings-section">
          <div className="section-header">
            <Database size={18} />
            <h2>{t('settings.dataBackup')}</h2>
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <Download size={16} className="setting-icon" />
              <div>
                <span className="setting-label">{t('settings.export')}</span>
                <span className="setting-description">{t('settings.exportDesc')}</span>
              </div>
            </div>
            <ChevronRight size={16} className="setting-arrow" />
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <Upload size={16} className="setting-icon" />
              <div>
                <span className="setting-label">{t('settings.import')}</span>
                <span className="setting-description">{t('settings.importDesc')}</span>
              </div>
            </div>
            <ChevronRight size={16} className="setting-arrow" />
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <HardDrive size={16} className="setting-icon" />
              <div>
                <span className="setting-label">{t('settings.storageLocation')}</span>
                <span className="setting-description">{t('settings.storageDesc')}</span>
              </div>
            </div>
            <ChevronRight size={16} className="setting-arrow" />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Clock size={16} className="setting-icon" />
              <div>
                <span className="setting-label">{t('settings.autoBackup')}</span>
                <span className="setting-description">{t('settings.autoBackupDesc')}</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input type="checkbox" id="autoBackup" />
              <label htmlFor="autoBackup"></label>
            </div>
          </div>
        </section>

        {/* Cloud Sync */}
        <section className="settings-section">
          <div className="section-header">
            <Cloud size={18} />
            <h2>{t('settings.cloudSync')}</h2>
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <span className="service-icon"><GoogleDriveIcon /></span>
              <div>
                <span className="setting-label">Google Drive</span>
                <span className="setting-description">{t('settings.linkDesc')}</span>
              </div>
            </div>
            <span className="setting-status disconnected">{t('settings.linkAccount')}</span>
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <span className="service-icon"><DropboxIcon /></span>
              <div>
                <span className="setting-label">Dropbox</span>
                <span className="setting-description">{t('settings.linkDesc')}</span>
              </div>
            </div>
            <span className="setting-status disconnected">{t('settings.linkAccount')}</span>
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <span className="service-icon"><OneDriveIcon /></span>
              <div>
                <span className="setting-label">OneDrive</span>
                <span className="setting-description">{t('settings.linkDesc')}</span>
              </div>
            </div>
            <span className="setting-status disconnected">{t('settings.linkAccount')}</span>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <RefreshCw size={16} className="setting-icon" />
              <div>
                <span className="setting-label">{t('settings.autoSync')}</span>
                <span className="setting-description">{t('settings.autoSyncDesc')}</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input type="checkbox" id="autoSync" />
              <label htmlFor="autoSync"></label>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="settings-section">
          <div className="section-header">
            <Info size={18} />
            <h2>{t('settings.about')}</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">{t('settings.version')}</span>
            </div>
            <span className="setting-value">2.1.0 Beta</span>
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <Shield size={16} className="setting-icon" />
              <span className="setting-label">{t('settings.privacy')}</span>
            </div>
            <ExternalLink size={14} className="setting-arrow" />
          </div>

          <div className="setting-item clickable">
            <div className="setting-info">
              <ExternalLink size={16} className="setting-icon" />
              <span className="setting-label">{t('settings.website')}</span>
            </div>
            <ExternalLink size={14} className="setting-arrow" />
          </div>
        </section>
      </div>

      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc} 
          onCancel={() => setCropImageSrc(null)}
          onSave={handleCropSave}
          title={t('settings.adjustCover') || 'تعديل الغلاف'}
          saveLabel={t('common.save')}
          aspectRatio={4.5}
        />
      )}
    </div>
  )
}

export default Settings
