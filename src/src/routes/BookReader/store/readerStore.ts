// ═══════════════════════════════════════════════════════════════════════════
// Reader Store - Main state for BookReader
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'

// Types
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
  [key: string]: unknown
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface ReaderState {
  // Book Data
  book: Book | null
  pages: PageContent[]
  currentPage: number
  totalPages: number
  
  // Loading States
  isLoading: boolean
  isExtracting: boolean
  extractProgress: number
  error: string | null
  
  // UI State
  isEditMode: boolean
  isImmersiveMode: boolean
  activePanel: string | null
  
  // Save State
  saveStatus: SaveStatus
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  
  // Actions
  setBook: (book: Book | null) => void
  setPages: (pages: PageContent[]) => void
  updatePage: (pageNum: number, content: string) => void
  setCurrentPage: (page: number) => void
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  
  setLoading: (loading: boolean) => void
  setExtracting: (extracting: boolean, progress?: number) => void
  setError: (error: string | null) => void
  
  toggleEditMode: () => void
  setEditMode: (mode: boolean) => void
  toggleImmersiveMode: () => void
  setActivePanel: (panel: string | null) => void
  
  setSaveStatus: (status: SaveStatus) => void
  markSaved: () => void
  
  reset: () => void
}

const initialState = {
  book: null,
  pages: [],
  currentPage: 1,
  totalPages: 0,
  isLoading: true,
  isExtracting: false,
  extractProgress: 0,
  error: null,
  isEditMode: false,
  isImmersiveMode: false,
  activePanel: null,
  saveStatus: 'idle' as SaveStatus,
  lastSaved: null,
  hasUnsavedChanges: false,
}

export const useReaderStore = create<ReaderState>((set, get) => ({
  ...initialState,

  // Book Actions
  setBook: (book) => set({ 
    book, 
    totalPages: book?.pageCount || 0,
    isLoading: false 
  }),
  
  setPages: (pages) => set({ 
    pages, 
    totalPages: pages.length,
    isExtracting: false 
  }),
  
  updatePage: (pageNum, content) => set((state) => ({
    pages: state.pages.map(p => 
      p.pageNum === pageNum 
        ? { ...p, content, isEdited: true }
        : p
    ),
    hasUnsavedChanges: true,
    saveStatus: 'idle'
  })),

  // Navigation
  setCurrentPage: (page) => set({ currentPage: page }),
  
  goToPage: (page) => {
    const { totalPages } = get()
    if (page >= 1 && page <= totalPages) {
      set({ currentPage: page })
    }
  },
  
  nextPage: () => {
    const { currentPage, totalPages } = get()
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 })
    }
  },
  
  prevPage: () => {
    const { currentPage } = get()
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 })
    }
  },

  // Loading States
  setLoading: (isLoading) => set({ isLoading }),
  
  setExtracting: (isExtracting, progress = 0) => set({ 
    isExtracting, 
    extractProgress: progress 
  }),
  
  setError: (error) => set({ error }),

  // UI State
  toggleEditMode: () => set((state) => ({ 
    isEditMode: !state.isEditMode,
    activePanel: state.isEditMode ? null : state.activePanel // Close panel when exiting edit mode
  })),
  
  setEditMode: (isEditMode) => set({ 
    isEditMode,
    activePanel: isEditMode ? null : null
  }),
  
  toggleImmersiveMode: () => set((state) => ({ 
    isImmersiveMode: !state.isImmersiveMode 
  })),
  
  setActivePanel: (activePanel) => set({ activePanel }),

  // Save State
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  
  markSaved: () => set({
    saveStatus: 'saved',
    lastSaved: new Date(),
    hasUnsavedChanges: false,
    pages: get().pages.map(p => ({ ...p, isEdited: false }))
  }),

  // Reset
  reset: () => set(initialState),
}))

// Selectors
export const selectCurrentContent = (state: ReaderState) => 
  state.pages.find(p => p.pageNum === state.currentPage)

export const selectHasContent = (state: ReaderState) =>
  state.pages.some(p => p.content.trim().length > 0)
