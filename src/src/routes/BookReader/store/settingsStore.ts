// ═══════════════════════════════════════════════════════════════════════════
// Settings Store - User preferences with persistence
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'sepia' | 'light'
export type PageWidth = 'narrow' | 'normal' | 'wide'
export type LineSpacing = 'compact' | 'normal' | 'relaxed'
export type FocusMode = 'none' | 'paragraph' | 'sentence'

interface SettingsState {
  // Theme
  theme: Theme
  
  // Typography
  fontSize: number           // 12-32
  lineHeight: LineSpacing
  fontFamily: string
  
  // Layout
  pageWidth: PageWidth
  margins: number            // 20-80
  
  // Reading
  focusMode: FocusMode
  dimming: number            // 0-75
  lineHighlight: boolean
  
  // Speed Reading
  speedReadEnabled: boolean
  speedReadWpm: number       // Words per minute
  
  // Actions
  setTheme: (theme: Theme) => void
  setFontSize: (size: number) => void
  setLineHeight: (height: LineSpacing) => void
  setFontFamily: (family: string) => void
  setPageWidth: (width: PageWidth) => void
  setMargins: (margins: number) => void
  setFocusMode: (mode: FocusMode) => void
  setDimming: (level: number) => void
  setLineHighlight: (enabled: boolean) => void
  setSpeedRead: (enabled: boolean, wpm?: number) => void
  
  // Presets
  applyPreset: (preset: 'default' | 'comfortable' | 'compact') => void
  resetToDefaults: () => void
}

const defaultSettings = {
  theme: 'dark' as Theme,
  fontSize: 18,
  lineHeight: 'normal' as LineSpacing,
  fontFamily: 'Cairo',
  pageWidth: 'normal' as PageWidth,
  margins: 60,
  focusMode: 'none' as FocusMode,
  dimming: 0,
  lineHighlight: false,
  speedReadEnabled: false,
  speedReadWpm: 300,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      // Theme
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },

      // Typography
      setFontSize: (fontSize) => {
        const clamped = Math.min(32, Math.max(12, fontSize))
        set({ fontSize: clamped })
      },
      
      setLineHeight: (lineHeight) => set({ lineHeight }),
      
      setFontFamily: (fontFamily) => set({ fontFamily }),

      // Layout
      setPageWidth: (pageWidth) => set({ pageWidth }),
      
      setMargins: (margins) => {
        const clamped = Math.min(80, Math.max(20, margins))
        set({ margins: clamped })
      },

      // Reading
      setFocusMode: (focusMode) => set({ focusMode }),
      
      setDimming: (dimming) => {
        const clamped = Math.min(75, Math.max(0, dimming))
        set({ dimming: clamped })
      },
      
      setLineHighlight: (lineHighlight) => set({ lineHighlight }),
      
      setSpeedRead: (speedReadEnabled, wpm) => set((state) => ({ 
        speedReadEnabled,
        speedReadWpm: wpm ?? state.speedReadWpm
      })),

      // Presets
      applyPreset: (preset) => {
        switch (preset) {
          case 'comfortable':
            set({
              fontSize: 20,
              lineHeight: 'relaxed',
              pageWidth: 'narrow',
              margins: 80,
            })
            break
          case 'compact':
            set({
              fontSize: 14,
              lineHeight: 'compact',
              pageWidth: 'wide',
              margins: 40,
            })
            break
          default:
            set({
              fontSize: 18,
              lineHeight: 'normal',
              pageWidth: 'normal',
              margins: 60,
            })
        }
      },
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'book-reader-settings',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        fontFamily: state.fontFamily,
        pageWidth: state.pageWidth,
        margins: state.margins,
        focusMode: state.focusMode,
        dimming: state.dimming,
        lineHighlight: state.lineHighlight,
        speedReadEnabled: state.speedReadEnabled,
        speedReadWpm: state.speedReadWpm,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on load
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme)
        }
      },
    }
  )
)

// Helper to get line height value
export const getLineHeightValue = (spacing: LineSpacing): number => {
  switch (spacing) {
    case 'compact': return 1.5
    case 'relaxed': return 2.0
    default: return 1.75
  }
}

// Helper to get page width value
export const getPageWidthValue = (width: PageWidth): string => {
  switch (width) {
    case 'narrow': return '70%'
    case 'wide': return '100%'
    default: return '85%'
  }
}
