import { useTranslation } from 'react-i18next'
import { Cloud, Link2, CheckCircle } from 'lucide-react'
import './CloudSync.css'

// SVG Icons for cloud services
const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
    <path d="M7.71 3.5L1.15 15l4.58 7.5h6.43l-4.58-7.5L7.71 3.5z"/>
    <path d="M8.14 3.5h8.12l4.58 7.5H12.72L8.14 3.5z"/>
    <path d="M22.85 15l-4.58-7.5-4.58 7.5 4.58 7.5 4.58-7.5z" opacity="0.7"/>
  </svg>
)

const DropboxIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
    <path d="M6 2L0 6l6 4l6-4L6 2zm12 0l-6 4l6 4l6-4l-6-4zM0 14l6 4l6-4l-6-4l-6 4zm18-4l-6 4l6 4l6-4l-6-4zM6 19l6 4l6-4l-6-4l-6 4z"/>
  </svg>
)

const OneDriveIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
    <path d="M10.5 18.5h9.75c2.07 0 3.75-1.68 3.75-3.75 0-1.69-1.12-3.11-2.66-3.58-.06-2.58-2.17-4.67-4.78-4.67-1.56 0-2.95.75-3.83 1.91-.53-.27-1.13-.41-1.76-.41-2.13 0-3.87 1.74-3.87 3.87 0 .17.01.34.04.5C4.49 12.55 2.5 14.64 2.5 17.18c0 .73.16 1.42.44 2.04.9-.46 1.88-.72 2.93-.72h4.63z"/>
  </svg>
)

function CloudSync(): JSX.Element {
  const { t } = useTranslation()

  const services = [
    { id: 'gdrive', name: t('nav.googleDrive'), Icon: GoogleDriveIcon, connected: false },
    { id: 'dropbox', name: t('nav.dropbox'), Icon: DropboxIcon, connected: false },
    { id: 'onedrive', name: 'OneDrive', Icon: OneDriveIcon, connected: false },
  ]

  return (
    <div className="cloud-page animate-fadeIn">
      <div className="page-header">
        <h1>{t('nav.cloud')}</h1>
      </div>

      <div className="cloud-services">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">
              <service.Icon />
            </div>
            <div className="service-info">
              <span className="service-name">{service.name}</span>
              <span className="service-status">
                {service.connected ? (
                  <>
                    <CheckCircle size={12} />
                    {t('cloudPage.connected')}
                  </>
                ) : (
                  t('cloudPage.notConnected')
                )}
              </span>
            </div>
            <button className="connect-btn">
              <Link2 size={16} />
              <span>{t('cloudPage.connect')}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="sync-info">
        <div className="info-card">
          <Cloud size={24} />
          <div>
            <h3>{t('cloudPage.syncTitle')}</h3>
            <p>{t('cloudPage.syncDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CloudSync
