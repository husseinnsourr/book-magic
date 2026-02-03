// Book Reader - A4 Page Component v2.0
// ═══════════════════════════════════════════════════════════════════════════
// 
// FEATURES:
// ✅ Separate Read/Edit Modes
// ✅ Visual indication for edit mode
// ✅ Character limit with indicator
// ✅ Line height support
// ✅ Empty state
//
// ═══════════════════════════════════════════════════════════════════════════

import { RefObject } from 'react'
import { PageContent } from '../hooks'
import { t, Language } from '../i18n'
import './styles/page.css'

interface A4PageProps {
  pageRef: RefObject<HTMLDivElement>
  editorRef: RefObject<HTMLDivElement>
  isEditMode: boolean
  currentContent: PageContent | undefined
  fontFamily: string
  fontSize: number
  lineHeight?: number
  maxChars: number
  onContentChange: () => void
  onUpdateFormats: () => void
  language: Language
}

export function A4Page({
  pageRef,
  editorRef,
  isEditMode,
  currentContent,
  fontFamily,
  fontSize,
  lineHeight = 1.8,
  maxChars,
  onContentChange,
  onUpdateFormats,
  language
}: A4PageProps): JSX.Element {
  
  // Get character count indicator class
  const getCharCountClass = () => {
    const length = editorRef.current?.innerText.length || 0
    const ratio = length / maxChars
    if (ratio >= 0.95) return 'danger'
    if (ratio >= 0.8) return 'warning'
    return ''
  }

  const hasContent = currentContent?.content && currentContent.content.trim().length > 0
  
  // Common text styles
  const textStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight
  }

  return (
    <div className="page-container">
      <div 
        className={`a4-page ${isEditMode ? 'editing' : ''}`} 
        ref={pageRef}
      >
        {isEditMode ? (
          // ═══════════════════════════════════════
          // EDIT MODE
          // ═══════════════════════════════════════
          <>
            <div
              ref={editorRef}
              className="page-editor"
              contentEditable
              onInput={onContentChange}
              onSelect={onUpdateFormats}
              onKeyUp={onUpdateFormats}
              onMouseUp={onUpdateFormats}
              dangerouslySetInnerHTML={{ __html: currentContent?.content || '' }}
              style={textStyles}
              dir="auto"
              data-placeholder={t('startWriting', language)}
            />
            <div className={`char-limit-indicator ${getCharCountClass()}`}>
              {editorRef.current?.innerText.length || 0} / {maxChars}
            </div>
          </>
        ) : (
          // ═══════════════════════════════════════
          // READ MODE
          // ═══════════════════════════════════════
          <>
            {hasContent ? (
              <article 
                className="page-text" 
                style={textStyles}
                dir="auto"
                dangerouslySetInnerHTML={{ __html: currentContent.content }}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <p>{t('emptyPage', language)}</p>
                <p className="empty-hint">
                  {language === 'ar' 
                    ? 'اضغط زر "تحرير" في الأعلى للكتابة'
                    : 'Click "Edit" button above to write'
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
