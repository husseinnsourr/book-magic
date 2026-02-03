// Mock API Service for Browser Environment
// ═══════════════════════════════════════════════════════════════════════════

export interface Book {
  id: number
  title: string
  author?: string
  pageCount: number
  filePath: string
  cover?: string
}

const MOCK_BOOKS: Book[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    pageCount: 15,
    filePath: '/mock/gatsby.pdf',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    pageCount: 12,
    filePath: '/mock/1984.pdf',
    cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=800'
  }
]

const LOREM_IPSUM = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. 
Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. 
Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. 
Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. 
Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. 
Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.
`

class MockApiService {
  constructor() {
    console.log('🔌 Mock API Service Initialized')
    this.setupWindowObjects()
  }

  setupWindowObjects() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).api = {
      getBook: async (id: number) => {
        console.log(`[MockAPI] getBook(${id})`)
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
        return MOCK_BOOKS.find(b => b.id === id) || null
      },
      
      extractPdfText: async (filePath: string, pageNum: number) => {
        console.log(`[MockAPI] extractPdfText(${filePath}, ${pageNum})`)
        await new Promise(resolve => setTimeout(resolve, 300))
        return `Page ${pageNum}\n\n${LOREM_IPSUM}`
      },
      
      getPageAsImage: async (filePath: string, pageNum: number) => {
        console.log(`[MockAPI] getPageAsImage(${filePath}, ${pageNum})`)
        // Return null or a placeholder if needed, but for now just simulate void/null return likely expected by buffer logic
        // In real app this returns a Buffer. We might need to mock that if frontend relies on it directly.
        // For now, let's return null to trigger the "fail" path or see what happens.
        return null 
      },
      
      performOcr: async (imageBuffer: any, lang: string) => {
        console.log(`[MockAPI] performOcr(buffer, ${lang})`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return `[OCR] Page content extracted from image...\n\n${LOREM_IPSUM}`
      },
      
      closeBook: (filePath: string) => {
        console.log(`[MockAPI] closeBook(${filePath})`)
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).electron = {
      ipcRenderer: {
        invoke: async (channel: string, ...args: any[]) => {
          console.log(`[MockAPI] IPC Invoke: ${channel}`, args)
          
          if (channel === 'db:savePageContent') {
             await new Promise(resolve => setTimeout(resolve, 800))
             return { success: true }
          }
          
          return null
        },
        on: (channel: string, func: any) => {
             console.log(`[MockAPI] IPC Listener registered: ${channel}`)
        },
        removeListener: (channel: string, func: any) => {
             console.log(`[MockAPI] IPC Listener removed: ${channel}`)
        }
      }
    }
  }
}

export const initMockApi = () => {
  new MockApiService()
}
