# Book Reader Component v2.0

Professional book reading and editing interface for Book Magic.

## Features

### 📖 Reading Experience

- **Immersive Mode**: Toggle with `F11` or `Esc`.
- **Focus Mode**: Line and paragraph highlighting for deep focus.
- **Reading Progress**: Visual progress bar and time estimates.
- **Floating Controls**: Auto-hiding controls for navigation and zoom.

### ✍️ Editor Experience

- **Rich Text Editing**: Formatting support (Bold, Italic, Underline).
- **Selection Toolbar**: Floating Medium-style toolbar.
- **Dock Panels**: Properties panel for layout and typography.
- **Auto-Save**: Changes persist to database automatically.

### 🎨 Customization

- **Themes**: Light, Sepia, Dark (Notion-inspired).
- **Typography**: Custom fonts (Inter, Cairo, Georgia) and dynamic scaling.
- **A4 Layout**: Print-ready pagination.

## Architecture

### Components

- `BookReader/index.tsx`: Main container and state orchestrator.
- `A4Page.tsx`: The core rendering surface.
- `ReaderDock.tsx`: Application dock for tools.
- `SettingsPanel.tsx`: Overlay for global preferences.

### State Management

- `readerStore.ts`: Manages book content, edit modes, and UI state.
- `settingsStore.ts`: Persists user preferences (theme, fonts).

### Database

- Uses `sql.js` (SQLite) via IPC for persistence.
- Handles concurrent edits with conflict resolution strategies (Last Write Wins).

## Shortcuts

| Action           | Shortcut       |
| ---------------- | -------------- |
| Toggle Edit Mode | `Cmd/Ctrl + E` |
| Save             | `Cmd/Ctrl + S` |
| Immersive Mode   | `F11`          |
| Next Page        | `Right Arrow`  |
| Prev Page        | `Left Arrow`   |
| Zoom In          | `Cmd/Ctrl + +` |
| Zoom Out         | `Cmd/Ctrl + -` |

## Usage

```tsx
import BookReader from "./routes/BookReader";

<Routes>
  <Route path="/book/:id" element={<BookReader />} />
</Routes>;
```
