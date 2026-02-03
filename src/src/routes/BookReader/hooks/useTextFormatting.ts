// Book Reader - Text Formatting Utilities
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, RefObject } from 'react'
import { t, Language } from '../i18n'

// Text formatting commands
export type FormatCommand = 
  | 'bold' 
  | 'italic' 
  | 'underline' 
  | 'strikeThrough'
  | 'justifyRight' 
  | 'justifyCenter' 
  | 'justifyLeft' 
  | 'justifyFull'
  | 'insertUnorderedList' 
  | 'insertOrderedList'
  | 'undo' 
  | 'redo'

export interface UseTextFormattingReturn {
  activeFormats: Set<string>
  execFormat: (command: FormatCommand, value?: string) => void
  updateActiveFormats: () => void
  changeTextColor: (color: string) => void
  highlightText: (color?: string) => void
  insertImage: () => void
  insertLink: () => void
}

export function useTextFormatting(
  editorRef: RefObject<HTMLDivElement>,
  language: Language = 'ar'
): UseTextFormattingReturn {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Execute formatting command
  const execFormat = useCallback((command: FormatCommand, value?: string) => {
    document.execCommand(command, false, value)
    updateActiveFormats()
    editorRef.current?.focus()
  }, [])

  // Update active format states based on selection
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()
    
    const commands: FormatCommand[] = [
      'bold', 'italic', 'underline', 'strikeThrough',
      'justifyRight', 'justifyCenter', 'justifyLeft', 'justifyFull',
      'insertUnorderedList', 'insertOrderedList'
    ]
    
    commands.forEach(cmd => {
      if (document.queryCommandState(cmd)) {
        formats.add(cmd)
      }
    })
    
    setActiveFormats(formats)
  }, [])

  // Change text color
  const changeTextColor = useCallback((color: string) => {
    document.execCommand('foreColor', false, color)
    editorRef.current?.focus()
  }, [])

  // Highlight text
  const highlightText = useCallback((color: string = '#ffff00') => {
    document.execCommand('hiliteColor', false, color)
    editorRef.current?.focus()
  }, [])

  // Insert image - use translated prompt
  const insertImage = useCallback(() => {
    const url = prompt(t('enterImageUrl', language))
    if (url) {
      document.execCommand('insertImage', false, url)
      editorRef.current?.focus()
    }
  }, [language])

  // Insert link - use translated prompt
  const insertLink = useCallback(() => {
    const url = prompt(t('enterLinkUrl', language))
    if (url) {
      document.execCommand('createLink', false, url)
      editorRef.current?.focus()
    }
  }, [language])

  return {
    activeFormats,
    execFormat,
    updateActiveFormats,
    changeTextColor,
    highlightText,
    insertImage,
    insertLink
  }
}
