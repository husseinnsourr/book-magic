# 🛠️ Utils

Utility functions for BookReader.

## 📁 Files

| File               | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `errorHandler.ts`  | Error recovery and user-friendly messages |
| `debounce.ts`      | Debounce function for auto-save           |
| `formatTime.ts`    | Time formatting utilities                 |
| `accessibility.ts` | A11y helpers (focus trap, announcements)  |

## 🔧 Usage

### Error Handler

```typescript
import { ErrorRecovery, getErrorMessage } from "./utils/errorHandler";

// Retry with exponential backoff
const result = await ErrorRecovery.retry(
  () => api.saveBook(data),
  3, // max attempts
  1000, // initial delay
);

// Get user-friendly message
const message = getErrorMessage(error, "ar");
```

### Debounce

```typescript
import { debounce } from "./utils/debounce";

const debouncedSave = debounce((data) => {
  saveToServer(data);
}, 2000);
```

### Format Time

```typescript
import { formatRelativeTime } from "./utils/formatTime";

formatRelativeTime(new Date(), "ar"); // "منذ ثوانٍ"
```
