import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store/useStore'
import { X, Loader2, Check, FileUp, ImagePlus, Tag } from 'lucide-react'
import { processBookContents } from '../../utils/importHandler'
import './AddBookModal.css'

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { id: 'novels', name: 'روايات', color: '#8b5cf6' },
  { id: 'self-dev', name: 'تطوير ذات', color: '#06b6d4' },
  { id: 'history', name: 'تاريخ', color: '#f59e0b' },
  { id: 'science', name: 'علوم', color: '#10b981' },
  { id: 'philosophy', name: 'فلسفة', color: '#ec4899' },
  { id: 'religion', name: 'دين', color: '#6366f1' },
  { id: 'tech', name: 'تقنية', color: '#3b82f6' },
  { id: 'other', name: 'أخرى', color: '#6b7280' },
]

export function AddBookModal({ isOpen, onClose }: AddBookModalProps): JSX.Element | null {
  const { t } = useTranslation()
  const { setBooks } = useStore()
  const [step, setStep] = useState<'select' | 'processing' | 'result'>('select')
  const [filePath, setFilePath] = useState<string>('')
  const [metadata, setMetadata] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [coverImage, setCoverImage] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  if (!isOpen) return null

  const handleSelectFile = async () => {
    try {
      const selectedPath = await (window as any).api.selectPdfFile()
      if (selectedPath) {
        setFilePath(selectedPath)
        setStep('processing')
        await startProcessing(selectedPath)
      }
    } catch (error) {
      console.error('Error selecting file:', error)
    }
  }

  const startProcessing = async (path: string) => {
    setStatusText(t('pdf.fetchingMetadata'))
    setProgress(10)
    
    try {
      const meta = await (window as any).api.getPdfMetadata(path)
      setMetadata(meta)
      setProgress(40)
      setStatusText(t('pdf.analyzingPages'))
      
      setStatusText(t('pdf.completing'))
      setProgress(100)
      setTimeout(() => setStep('result'), 500)
    } catch (error) {
      console.error('Processing error:', error)
      setStatusText(t('common.error'))
    }
  }

  const handleSelectCover = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setCoverImage(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSave = async () => {
    const bookData = {
      title: metadata.title,
      author: metadata.author,
      pageCount: metadata.pageCount,
      fileSize: metadata.fileSize,
      filePath: filePath,
      coverImage: coverImage,
      category: selectedCategory,
      status: 'unread'
    }
    
    // Save to DB
    const result = await (window as any).api.saveBook(bookData)
    
    // Refresh books list
    const books = await (window as any).api.getBooks()
    setBooks(books)
    
    // Trigger background processing (OCR/Extraction)
    processBookContents(result.id, filePath, metadata.pageCount, (progress: any) => {
      console.log('Processing:', progress.message)
    })

    handleClose()
  }

  const handleClose = () => {
    setStep('select')
    setFilePath('')
    setMetadata(null)
    setProgress(0)
    setCoverImage('')
    setSelectedCategory('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('library.addBook')}</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {step === 'select' && (
            <div className="select-step">
              <div className="upload-box" onClick={handleSelectFile}>
                <FileUp size={48} className="upload-icon" />
                <p>{t('pdf.dragOrClick')}</p>
                <button className="btn-primary">
                  {t('pdf.selectFile')}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="processing-step">
              <div className="processing-loader">
                <Loader2 size={48} className="spinner-icon" />
              </div>
              <h3>{statusText}</h3>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              <p>{progress}%</p>
            </div>
          )}

          {step === 'result' && metadata && (
            <div className="result-step">
              <div className="book-preview-large">
                {/* Cover Section */}
                <div className="preview-cover clickable" onClick={handleSelectCover}>
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="cover-img" />
                  ) : (
                    <>
                      <ImagePlus size={32} />
                      <span className="cover-hint">إضافة غلاف</span>
                    </>
                  )}
                </div>
                
                <div className="preview-info">
                  <div className="input-group">
                    <label>{t('book.title')}</label>
                    <input 
                      type="text" 
                      value={metadata.title} 
                      onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>{t('book.author')}</label>
                    <input 
                      type="text" 
                      value={metadata.author} 
                      onChange={(e) => setMetadata({...metadata, author: e.target.value})}
                    />
                  </div>
                  <div className="meta-info">
                    <span>{metadata.pageCount} {t('book.pages')}</span>
                    <span>{(metadata.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="category-section">
                <label className="section-label">
                  <Tag size={16} />
                  <span>التصنيف</span>
                </label>
                <div className="category-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                      style={{ '--cat-color': cat.color } as React.CSSProperties}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="cat-dot" style={{ background: cat.color }} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setStep('select')}>
                  {t('common.back')}
                </button>
                <button className="btn-primary" onClick={handleSave}>
                  <Check size={18} />
                  {t('common.save')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}