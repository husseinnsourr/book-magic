// ═══════════════════════════════════════════════════════════════════════════
// Book Reader - Main Component v2.0
// Professional Book Reader & Editor with Notion-Inspired Design
// ═══════════════════════════════════════════════════════════════════════════
//
// FEATURES:
// ✅ Notion Theme with Design Tokens
// ✅ Separate Read/Edit Modes
// ✅ Selection Toolbar (Medium/Notion-style)
// ✅ Keyboard Shortcuts (⌘B, ⌘I, ⌘S, etc.)
// ✅ Auto-save with Status Indicator
// ✅ RTL/LTR Support
// ✅ Error Handling with Recovery
// ✅ Theme Switching (Dark/Sepia/Light)
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit3, Eye, Settings, ArrowLeft } from 'lucide-react'

// Global Store
import { useStore } from '@/store/useStore'

// Local Stores
import { useReaderStore, useSettingsStore, getLineHeightValue } from './store'

// Hooks
import { 
  useBookLoader, 
  useTextFormatting,
  useKeyboardShortcuts,
  createEditorShortcuts,
  createNavigationShortcuts,
  useAutoSave
} from './hooks'

// Components
import { 
  ReaderDock,
  A4Page,
  FloatingControls,
  LoadingSpinner,
  ExtractionProgress,
  BookNotFound,
  SettingsPanel,
  LoadingSkeleton,
  ErrorBanner
} from './components'

// Reading Components
import { ImmersiveMode } from './components/reading/ImmersiveMode'
import { FocusOverlay } from './components/reading/FocusOverlay'
import { ReadingProgress } from './components/reading/ReadingProgress'

// Editor Components
import { SelectionToolbar } from './components/editor'

// Feedback Components
import { SaveIndicator } from './components/feedback'

// Translations
import { t, Language } from './i18n'

// Styles
// Styles
import './styles/tokens.css'
import './styles/themes.css'
import './styles/animations.css'
import './styles/main.css'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function BookReader(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // ─────────────────────────────────────────────────────────────────────────
  // STORES
  // ─────────────────────────────────────────────────────────────────────────
  
  // Global language store
  const { language } = useStore()
  const isRTL = language === 'ar'
  
  // Reader store
  const {
    isEditMode,
    isImmersiveMode,
    toggleEditMode,
    setEditMode,
    activePanel,
    setActivePanel,
    hasUnsavedChanges,
    setError
  } = useReaderStore()
  
  // Settings store
  const {
    theme,
    fontSize: settingsFontSize,
    setFontSize,
    lineHeight,
    fontFamily,
    setFontFamily
  } = useSettingsStore()
  
  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────
  
  const pageRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // ─────────────────────────────────────────────────────────────────────────
  // BOOK LOADING
  // ─────────────────────────────────────────────────────────────────────────
  
  const {
    book,
    pages,
    setPages,
    currentPage,
    totalPages,
    isLoading,
    isExtracting,
    extractProgress,
    extractionComplete,
    error,
    goToPage,
    currentContent,
    retry
  } = useBookLoader(id, pageRef)

  // ─────────────────────────────────────────────────────────────────────────
  // TEXT FORMATTING
  // ─────────────────────────────────────────────────────────────────────────
  
  const {
    activeFormats,
    execFormat,
    updateActiveFormats,
    changeTextColor,
    highlightText,
    insertImage,
    insertLink
  } = useTextFormatting(editorRef, language as Language)

  // ─────────────────────────────────────────────────────────────────────────
  // LOCAL STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  const [zoom, setZoom] = useState(100)
  const [showSettings, setShowSettings] = useState(false)

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-SAVE
  // ─────────────────────────────────────────────────────────────────────────
  
  const { status: saveStatus, lastSaved, save: manualSave } = useAutoSave({
    data: pages,
    onSave: async (pagesToSave) => {
      if (!book) return
      
      const editedPages = pagesToSave.filter(p => p.isEdited)
      if (editedPages.length === 0) return

      console.log(`Saving ${editedPages.length} pages to database...`)
      
      try {
        // Save each edited page
        for (const page of editedPages) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (window as any).electron.ipcRenderer.invoke('db:savePageContent', {
            bookId: book.id,
            pageNum: page.pageNum,
            content: page.content
          })
        }
        
        // Update store state
        useReaderStore.getState().markSaved()
        console.log('Save completed successfully')
      } catch (err) {
        console.error('Failed to save pages:', err)
        throw err
      }
    },
    debounceMs: 2000,
    enabled: isEditMode && hasUnsavedChanges
  })

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleBack = useCallback(() => navigate('/'), [navigate])
  
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return
    const content = editorRef.current.innerHTML
    
    setPages(prev => prev.map(p => 
      p.pageNum === currentPage ? { ...p, content, isEdited: true } : p
    ))
  }, [currentPage, setPages])
  
  const handleExitEditMode = useCallback(() => {
    if (hasUnsavedChanges) {
      manualSave()
    }
    setEditMode(false)
  }, [hasUnsavedChanges, manualSave, setEditMode])

  const handleFormat = useCallback((command: string, value?: string) => {
    execFormat(command as any, value)
  }, [execFormat])

  // Zoom
  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 10, 200)), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - 10, 50)), [])
  const resetZoom = useCallback(() => setZoom(100), [])
  
  const calculatedFontSize = Math.round(settingsFontSize * (zoom / 100))
  const calculatedLineHeight = getLineHeightValue(lineHeight)

  // ─────────────────────────────────────────────────────────────────────────
  // KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────────────────────────────────────
  
  // Editor shortcuts (only in edit mode)
  useKeyboardShortcuts(
    createEditorShortcuts({
      bold: () => execFormat('bold'),
      italic: () => execFormat('italic'),
      underline: () => execFormat('underline'),
      save: manualSave,
      exitEdit: handleExitEditMode
    }),
    { enabled: isEditMode }
  )
  
  // Navigation shortcuts (only in read mode)
  useKeyboardShortcuts(
    createNavigationShortcuts({
      nextPage: () => goToPage(currentPage + 1),
      prevPage: () => goToPage(currentPage - 1),
      zoomIn,
      zoomOut,
      resetZoom
    }),
    { enabled: !isEditMode }
  )

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────
  
  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  // Close panel when exiting edit mode
  useEffect(() => {
    if (!isEditMode) {
      setActivePanel(null)
    }
  }, [isEditMode, setActivePanel])

  // Close book when unmounting
  useEffect(() => {
    return () => {
      if (book?.filePath) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).api.closeBook(book.filePath)
      }
    }
  }, [book?.filePath])

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER - Loading
  // ─────────────────────────────────────────────────────────────────────────
  
  if (isLoading) {
    return (
      <div className="reader-container" data-theme={theme}>
        <div className="absolute inset-0 flex items-center justify-center z-50">
             <LoadingSpinner message={t('loading', language as Language)} />
        </div>
        <div className="opacity-50 pointer-events-none filter blur-sm">
             <LoadingSkeleton />
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER - Not Found
  // ─────────────────────────────────────────────────────────────────────────
  
  if (!book) {
    return (
      <div className="reader-container" data-theme={theme}>
        <BookNotFound 
          onBack={handleBack} 
          message={t('bookNotFound', language as Language)}
          buttonText={t('backToLibrary', language as Language)}
        />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER - Main
  // ─────────────────────────────────────────────────────────────────────────
  
  return (
    <div className="reader-container" data-theme={theme} dir={isRTL ? 'rtl' : 'ltr'}>
      <ImmersiveMode />
      <FocusOverlay contentRef={pageRef} />
      <ReadingProgress language={language as Language} isRTL={isRTL} />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      {!isImmersiveMode && (
      <header className="reader-header">
        <div className="header-left">
          <button 
            className="header-btn icon-btn"
            onClick={handleBack}
            title={t('backToLibrary', language as Language)}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="header-info">
            <span className="header-title">{book.title}</span>
            {book.author && <span className="header-author">{book.author}</span>}
          </div>
        </div>
        
        <div className="header-center">
          {/* Save Indicator - Only show in edit mode */}
          {isEditMode && (
            <SaveIndicator 
              status={saveStatus}
              lastSaved={lastSaved}
              language={language as Language}
            />
          )}
        </div>
        
        <div className="header-right">
          {/* Settings Button */}
          <button 
            className="header-btn icon-btn"
            onClick={() => setShowSettings(!showSettings)}
            title={language === 'ar' ? 'الإعدادات' : 'Settings'}
          >
            <Settings size={18} />
          </button>
          
          {/* Edit Mode Toggle */}
          <button 
            className={`edit-toggle-btn ${isEditMode ? 'active' : ''}`}
            onClick={toggleEditMode}
          >
            {isEditMode ? (
              <>
                <Eye size={16} />
                <span>{language === 'ar' ? 'قراءة' : 'Read'}</span>
              </>
            ) : (
              <>
                <Edit3 size={16} />
                <span>{language === 'ar' ? 'تحرير' : 'Edit'}</span>
              </>
            )}
          </button>
        </div>
      </header>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ERROR BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      {error && (
        <ErrorBanner 
            message={error} 
            onRetry={retry}
            onDismiss={() => setError(null)}
            language={language as Language}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN LAYOUT
          ═══════════════════════════════════════════════════════════════════ */}
      <div className={`reader-main-layout ${isRTL ? 'rtl' : 'ltr'}`}>
        
        {/* Dock - Only in Edit Mode */}
        {isEditMode && (

          <ReaderDock
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            setIsEditMode={setEditMode}
            activeFormats={activeFormats}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={settingsFontSize}
            setFontSize={setFontSize}
            execFormat={execFormat}
            changeTextColor={changeTextColor}
            highlightText={highlightText}
            insertImage={insertImage}
            insertLink={insertLink}
            onSave={manualSave}
            onBack={handleBack}
            language={language as Language}
            isRTL={isRTL}
          />
        )}

        {/* Content Area */}
        <main className="reader-content">
          {isExtracting && pages.length === 0 ? (
            <ExtractionProgress 
              progress={extractProgress} 
              message={t('extractingText', language as Language)}
            />
          ) : (
            <>
              {/* Selection Toolbar - Only in Edit Mode */}
              {isEditMode && (
                <SelectionToolbar
                  onFormat={handleFormat}
                  language={language as Language}
                  isRTL={isRTL}
                />
              )}

              {/* A4 Page */}
              <A4Page
                pageRef={pageRef}
                editorRef={editorRef}
                isEditMode={isEditMode}
                currentContent={currentContent}
                fontFamily={fontFamily}
                fontSize={calculatedFontSize}
                lineHeight={calculatedLineHeight}
                maxChars={2500}
                onContentChange={handleContentChange}
                onUpdateFormats={updateActiveFormats}
                language={language as Language}
              />

              {/* Floating Controls */}
              <FloatingControls
                zoom={zoom}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={() => goToPage(currentPage + 1)}
                onPrevPage={() => goToPage(currentPage - 1)}
                language={language as Language}
              />
            </>
          )}
        </main>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          SETTINGS PANEL
          ═══════════════════════════════════════════════════════════════════ */}
      {showSettings && (
        <SettingsPanel 
            onClose={() => setShowSettings(false)}
            language={language as Language}
            isRTL={isRTL}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BACKGROUND EXTRACTION PROGRESS
          ═══════════════════════════════════════════════════════════════════ */}
      {isExtracting && pages.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-surface-paper shadow-lg rounded-full px-4 py-2 flex items-center gap-3 z-50 animate-fadeIn border border-border-default">
          <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-text-secondary">
             {language === 'ar' ? 'جاري تحميل باقي الصفحات...' : 'Loading remaining pages...'} {extractProgress}%
          </span>
          <div className="w-24 h-1 bg-surface-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${extractProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUCCESS NOTIFICATION
          ═══════════════════════════════════════════════════════════════════ */}
      {extractionComplete && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-50 animate-bounce-in border border-green-200 dark:border-green-800">
          <span className="text-sm font-medium">
            {language === 'ar' ? '✅ تم تحميل الكتاب بالكامل' : '✅ Book fully loaded'}
          </span>
        </div>
      )}

    </div>
  )
}

export default BookReader
