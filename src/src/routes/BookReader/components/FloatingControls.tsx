// Book Reader - Floating Controls Component
// ═══════════════════════════════════════════════════════════════════════════

import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { t, Language } from '../i18n'
import './styles/controls.css'

interface FloatingControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  currentPage: number
  totalPages: number
  onNextPage: () => void
  onPrevPage: () => void
  language: Language
}

export function FloatingControls({
  zoom,
  onZoomIn,
  onZoomOut,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  language
}: FloatingControlsProps): JSX.Element {
  return (
    <div className="floating-controls">
      {/* Zoom Controls */}
      <div className="control-group">
        <button 
          className="ctrl-btn" 
          onClick={onZoomOut} 
          title={t('zoomOut', language)}
          disabled={zoom <= 50}
        >
          <ZoomOut size={16} />
        </button>
        <span className="ctrl-value">{zoom}%</span>
        <button 
          className="ctrl-btn" 
          onClick={onZoomIn} 
          title={t('zoomIn', language)}
          disabled={zoom >= 200}
        >
          <ZoomIn size={16} />
        </button>
      </div>
      
      <div className="control-divider" />
      
      {/* Page Navigation */}
      <div className="control-group">
        <button 
          className="ctrl-btn" 
          onClick={onNextPage} 
          disabled={currentPage >= totalPages} 
          title={t('nextPage', language)}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="ctrl-value">{totalPages} / {currentPage}</span>
        <button 
          className="ctrl-btn" 
          onClick={onPrevPage} 
          disabled={currentPage <= 1} 
          title={t('prevPage', language)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
