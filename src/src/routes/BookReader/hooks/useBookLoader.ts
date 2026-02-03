// Book Reader - Book Loading Hook (Background Extraction + OCR)
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef, RefObject } from 'react'

export interface PageContent {
  pageNum: number
  content: string
  isEdited: boolean
}

export interface Book {
  id: number
  title: string
  author?: string
  pageCount: number
  filePath: string
  [key: string]: any
}

export interface UseBookLoaderReturn {
  book: Book | null
  pages: PageContent[]
  setPages: React.Dispatch<React.SetStateAction<PageContent[]>>
  currentPage: number
  totalPages: number
  isLoading: boolean
  isExtracting: boolean
  extractProgress: number
  extractionComplete: boolean
  error: string | null
  goToPage: (page: number) => void
  currentContent: PageContent | undefined
  retry: () => void
}

export function useBookLoader(
  bookId: string | undefined,
  pageRef: RefObject<HTMLDivElement>
): UseBookLoaderReturn {
  const [book, setBook] = useState<Book | null>(null)
  const [pages, setPages] = useState<PageContent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  
  // Background extraction state
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractProgress, setExtractProgress] = useState(0)
  const [extractionComplete, setExtractionComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for control
  const shouldExtract = useRef(true)
  const isExtractingRef = useRef(false)

  // Load book metadata
  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) return
      setError(null)
      try {
        const foundBook = await (window as any).api.getBook(Number(bookId))
        if (foundBook) {
          setBook(foundBook)
        } else {
          setError('الكتاب غير موجود')
        }
      } catch (err) {
        console.error('Error loading book:', err)
        setError('فشل تحميل الكتاب')
      } finally {
        setIsLoading(false)
      }
    }
    loadBook()
  }, [bookId])

  // MAIN EXTRACTION LOGIC
  useEffect(() => {
    if (!book?.filePath || isExtractingRef.current) return
    
    async function extractAllPages() {
      if (!book) return
      isExtractingRef.current = true
      setIsExtracting(true)
      shouldExtract.current = true
      
      try {
        const totalPages = book.pageCount
        const currentPagesMap = new Map<number, PageContent>()
        
        // Helper to process a single page (Text or OCR)
        const processPage = async (pageNum: number) => {
          try {
            // Try extracting digital text first
            let text = await (window as any).api.extractPdfText(book.filePath, pageNum)
            
            // Check if text is "empty" or garbage (less than 20 chars usually means artifacts or page numbers)
            // Or if it's just whitespace
            const isDigitalTextEmpty = !text || text.trim().length < 20
            
            if (isDigitalTextEmpty) {
              console.log(`Page ${pageNum}: Text is empty or minimal (${text?.length || 0} chars). Attempting OCR...`)
              
              // Get page as image buffer
              const imageBuffer = await (window as any).api.getPageAsImage(book.filePath, pageNum)
              
              if (imageBuffer) {
                // Perform OCR
                const ocrText = await (window as any).api.performOcr(imageBuffer, 'ara+eng')
                
                if (ocrText && ocrText.trim().length > 0) {
                   console.log(`Page ${pageNum}: OCR success! Extracted ${ocrText.length} characters.`)
                   text = ocrText
                } else {
                   console.warn(`Page ${pageNum}: OCR returned empty text.`)
                }
              } else {
                 console.error(`Page ${pageNum}: Failed to generate image buffer from PDF.`)
              }
            } else {
               // console.log(`Page ${pageNum}: Found valid digital text (${text.length} chars).`)
            }
            
            const content = text?.trim() || ''
            return content
          } catch (e) {
            console.warn(`Failed to extract page ${pageNum}`, e)
            return ''
          }
        }

        // PHASE 1: Extract first 10 pages (FAST - for immediate display)
        console.log('Phase 1: Extracting first 10 pages...')
        const initialLimit = Math.min(10, totalPages)
        
        for (let i = 1; i <= initialLimit; i++) {
          if (!shouldExtract.current) break
          
          const content = await processPage(i)
          currentPagesMap.set(i, { pageNum: i, content, isEdited: false })
          
          // Update state immediately so user can start reading
          setPages(Array.from(currentPagesMap.values()).sort((a, b) => a.pageNum - b.pageNum))
          setExtractProgress(Math.round((i / totalPages) * 100))
        }
        
        console.log('Phase 1 complete! User can now read.')
        
        // PHASE 2: Extract remaining pages in background
        if (totalPages > 10 && shouldExtract.current) {
          console.log(`Phase 2: Extracting remaining ${totalPages - 10} pages...`)
          
          // Extract in batches of 5 for better UI responsiveness
          for (let i = 11; i <= totalPages; i++) {
            if (!shouldExtract.current) break
            
            const content = await processPage(i)
            currentPagesMap.set(i, { pageNum: i, content, isEdited: false })
            
            // Update every 5 pages or at the end
            if (i % 5 === 0 || i === totalPages) {
              setPages(Array.from(currentPagesMap.values()).sort((a, b) => a.pageNum - b.pageNum))
              setExtractProgress(Math.round((i / totalPages) * 100))
            }
          }
        }
        
        // DONE!
        if (shouldExtract.current) {
          setExtractProgress(100)
          setExtractionComplete(true)
          console.log('All pages extracted successfully!')
        }
        
      } catch (err) {
        console.error('Extraction failed:', err)
        setError('حدث خطأ أثناء استخراج النص')
      } finally {
        setIsExtracting(false)
        isExtractingRef.current = false
      }
    }
    
    extractAllPages()
    
    // Cleanup: Stop extraction if component unmounts or book changes
    return () => {
      shouldExtract.current = false
    }
  }, [book])

  // Page navigation
  const goToPage = useCallback((page: number) => {
    const max = book?.pageCount || 1
    if (page >= 1 && page <= max) {
      setCurrentPage(page)
      if (pageRef.current) {
        pageRef.current.scrollTop = 0
      }
    }
  }, [book?.pageCount])

  // Retry extraction
  const retry = useCallback(() => {
    isExtractingRef.current = false
    setPages([])
    setExtractProgress(0)
    setError(null)
    if (book) {
       const b = { ...book }
       setBook(null)
       setTimeout(() => setBook(b), 10)
    }
  }, [book])

  const totalPages = book?.pageCount || 0
  const currentContent = pages.find(p => p.pageNum === currentPage)

  return {
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
  }
}