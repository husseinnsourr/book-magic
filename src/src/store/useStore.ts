import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Book {
  id: number
  title: string
  author: string
  coverImage?: string
  pageCount: number
  progress: number
  readingProgress?: number // Percentage 0-100
  fileSize: number // in bytes
  status: 'unread' | 'reading' | 'completed' | 'wishlist'
  rating: number
  isFavorite: boolean
}

interface AppState {
  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
  
  // Language
  language: 'ar' | 'en'
  setLanguage: (lang: 'ar' | 'en') => void
  
  // Font
  arabicFont: 'default' | 'alt' | 'alt2'
  englishFont: 'default' | 'alt' | 'alt2'
  setArabicFont: (font: 'default' | 'alt' | 'alt2') => void
  setEnglishFont: (font: 'default' | 'alt' | 'alt2') => void
  
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  
  // Library View
  libraryView: 'grid' | 'list' | 'shelf' | 'cover'
  setLibraryView: (view: 'grid' | 'list' | 'shelf' | 'cover') => void
  
  // Library Cover
  libraryCover: string
  setLibraryCover: (url: string) => void
  customCovers: string[]
  addCustomCover: (url: string) => void
  removeCustomCover: (url: string) => void
  libraryCoverHeight: 'small' | 'medium' | 'large'
  setLibraryCoverHeight: (height: 'small' | 'medium' | 'large') => void
  libraryCoverPosition: number
  setLibraryCoverPosition: (position: number) => void
  libraryTitle: string
  setLibraryTitle: (title: string) => void
  libraryDescription: string
  setLibraryDescription: (desc: string) => void
  libraryIcon: string
  setLibraryIcon: (icon: string) => void
  libraryIconColor: string
  setLibraryIconColor: (color: string) => void
  
  // Books cache
  books: Book[]
  setBooks: (books: Book[]) => void
  saveBook: (book: Book) => Promise<void>
  
  // Last read tracking
  lastReadBookId: number | null
  setLastReadBookId: (id: number) => void
  
  // Statistics
  statistics: {
    totalBooks: number
    booksRead: number
    currentlyReading: number
    pagesRead: number
    readingGoal: number
  }
  setStatistics: (stats: AppState['statistics']) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      // Language
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      
      // Font
      arabicFont: 'default',
      englishFont: 'default',
      setArabicFont: (font) => set({ arabicFont: font }),
      setEnglishFont: (font) => set({ englishFont: font }),
      
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      // Library View
      libraryView: 'grid',
      setLibraryView: (view) => set({ libraryView: view }),
      
      // Library Cover
      libraryCover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2800&auto=format&fit=crop',
      setLibraryCover: (url) => set({ libraryCover: url }),
      customCovers: [],
      addCustomCover: (url) => set((state) => ({ 
        customCovers: [url, ...state.customCovers.filter(c => c !== url)].slice(0, 10) 
      })),
      removeCustomCover: (url) => set((state) => ({
        customCovers: state.customCovers.filter(c => c !== url)
      })),
      libraryCoverHeight: 'medium',
      setLibraryCoverHeight: (height) => set({ libraryCoverHeight: height }),
      libraryCoverPosition: 50,
      setLibraryCoverPosition: (position) => set({ libraryCoverPosition: position }),
      libraryTitle: 'المكتبة',
      setLibraryTitle: (title) => set({ libraryTitle: title }),
      libraryDescription: 'المكتبة الشاملة',
      setLibraryDescription: (desc) => set({ libraryDescription: desc }),
      libraryIcon: '📚',
      setLibraryIcon: (icon) => set({ libraryIcon: icon }),
      libraryIconColor: '#2eaadc',
      setLibraryIconColor: (color) => set({ libraryIconColor: color }),
      
      // Books
      books: [],
      setBooks: (books) => set({ books }),
      saveBook: async (book) => {
        await (window as any).api.saveBook(book)
        const updatedBooks = await (window as any).api.getBooks()
        set({ books: updatedBooks })
      },
      
      // Last read tracking
      lastReadBookId: null,
      setLastReadBookId: (id) => set({ lastReadBookId: id }),
      
      // Statistics
      statistics: {
        totalBooks: 0,
        booksRead: 0,
        currentlyReading: 0,
        pagesRead: 0,
        readingGoal: 50
      },
      setStatistics: (stats) => set({ statistics: stats })
    }),
    {
      name: 'book-magic-storage'
    }
  )
)
