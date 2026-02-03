# 📦 Store

State management using Zustand for BookReader.

## 📁 Files

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `readerStore.ts`   | Main reader state (book, pages, UI)           |
| `editorStore.ts`   | Editor-specific state (selection, formatting) |
| `settingsStore.ts` | User preferences (theme, font, etc.)          |

## 🔧 Usage

```tsx
import { useReaderStore, useSettingsStore } from './store'

function Component() {
  const { book, currentPage, goToPage } = useReaderStore()
  const { theme, setTheme } = useSettingsStore()

  return (...)
}
```

## 📊 State Structure

### readerStore

```typescript
{
  book: Book | null
  pages: PageContent[]
  currentPage: number
  isEditMode: boolean
  isImmersiveMode: boolean
  activePanel: string | null
}
```

### settingsStore

```typescript
{
  theme: "dark" | "sepia" | "light";
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  pageWidth: "narrow" | "normal" | "wide";
  margins: number;
}
```

## 💾 Persistence

Settings are persisted to `localStorage` using Zustand's `persist` middleware.
