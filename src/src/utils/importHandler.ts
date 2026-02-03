
export interface ImportProgress {
  status: 'metadata' | 'saving' | 'processing' | 'completed' | 'error'
  current: number
  total: number
  message: string
}

// 1. Get Metadata
export const fetchMetadata = async (filePath: string) => {
  return await (window as any).api.getPdfMetadata(filePath)
}

// 2. Save Book (Wrapper)
export const saveBookToDb = async (bookData: any) => {
  return await (window as any).api.saveBook(bookData)
}

// 3. Process Book Contents (Background Job)
export const processBookContents = async (
  bookId: number, 
  filePath: string,
  pageCount: number,
  onProgress?: (progress: ImportProgress) => void
): Promise<void> => {
  try {
    onProgress?.({ status: 'processing', current: 0, total: pageCount, message: 'Starting extraction...' })

    for (let i = 1; i <= pageCount; i++) {
        // Extract Text
        const text = await (window as any).api.extractPdfText(filePath, i)
        
        // Save content to DB
        await (window as any).api.savePageContent(bookId, i, text || '')

        onProgress?.({ 
          status: 'processing', 
          current: i, 
          total: pageCount, 
          message: `Processing page ${i} of ${pageCount}` 
        })
    }

    onProgress?.({ status: 'completed', current: pageCount, total: pageCount, message: 'Processing completed!' })

  } catch (error: any) {
    console.error('Processing failed:', error)
    onProgress?.({ status: 'error', current: 0, total: 0, message: error.message || 'Unknown error' })
  }
}

// Full Auto Import (for testing or direct import)
export const importBook = async (
  filePath: string, 
  onProgress?: (progress: ImportProgress) => void
): Promise<void> => {
  try {
    onProgress?.({ status: 'metadata', current: 0, total: 100, message: 'Fetching metadata...' })
    const metadata = await fetchMetadata(filePath)
    
    onProgress?.({ status: 'saving', current: 0, total: 100, message: 'Saving to library...' })
    const bookData = { ...metadata, filePath, status: 'unread' }
    const result = await saveBookToDb(bookData)
    
    await processBookContents(result.id, filePath, metadata.pageCount, onProgress)

  } catch (error: any) {
    console.error('Import failed:', error)
    onProgress?.({ status: 'error', current: 0, total: 0, message: error.message })
  }
}
