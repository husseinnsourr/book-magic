# 🪝 Hooks

Custom React Hooks لصفحة BookReader.

## 📁 الملفات

| الملف                  | الوصف                      |
| ---------------------- | -------------------------- |
| `index.ts`             | تصدير الـ hooks            |
| `useBookLoader.ts`     | تحميل الكتاب واستخراج النص |
| `useTextFormatting.ts` | أدوات تنسيق النص           |

---

## 📚 useBookLoader

تحميل الكتاب من الـ API واستخراج النص من PDF.

### الاستخدام

```tsx
const {
  book, // بيانات الكتاب
  pages, // الصفحات المستخرجة
  setPages, // تعديل الصفحات
  currentPage, // الصفحة الحالية
  totalPages, // إجمالي الصفحات
  isLoading, // جاري التحميل؟
  isExtracting, // جاري الاستخراج؟
  extractProgress, // نسبة الاستخراج
  error, // رسالة الخطأ
  goToPage, // الانتقال لصفحة
  currentContent, // محتوى الصفحة الحالية
  retry, // إعادة المحاولة
} = useBookLoader(bookId, pageRef);
```

### الأنواع

```typescript
interface PageContent {
  pageNum: number;
  content: string;
  isEdited: boolean;
}

interface Book {
  id: number;
  title: string;
  author?: string;
  pageCount: number;
  filePath: string;
}
```

### Error Handling

- يتحقق من وجود الكتاب
- يتحقق من وجود محتوى
- رسالة واضحة إذا كان PDF صور فقط

---

## ✏️ useTextFormatting

أدوات تنسيق النص باستخدام `document.execCommand`.

### الاستخدام

```tsx
const {
  activeFormats, // التنسيقات النشطة
  execFormat, // تنفيذ تنسيق
  updateActiveFormats, // تحديث الحالة
  changeTextColor, // تغيير لون النص
  highlightText, // تظليل النص
  insertImage, // إدراج صورة
  insertLink, // إدراج رابط
} = useTextFormatting(editorRef, language);
```

### الأوامر المدعومة

| الأمر                 | الاختصار | الوصف       |
| --------------------- | -------- | ----------- |
| `bold`                | Ctrl+B   | عريض        |
| `italic`              | Ctrl+I   | مائل        |
| `underline`           | Ctrl+U   | تسطير       |
| `strikeThrough`       | -        | يتوسطه خط   |
| `justifyRight`        | -        | محاذاة يمين |
| `justifyCenter`       | -        | محاذاة وسط  |
| `justifyLeft`         | -        | محاذاة يسار |
| `justifyFull`         | -        | ضبط         |
| `insertUnorderedList` | -        | قائمة نقطية |
| `insertOrderedList`   | -        | قائمة مرقمة |
| `undo`                | Ctrl+Z   | تراجع       |
| `redo`                | Ctrl+Y   | إعادة       |

### ⚠️ تحذير

> `document.execCommand` مهجور (deprecated).
> يجب استبداله بـ TipTap أو Slate.js في المستقبل.

---

## 🔄 التصدير

```typescript
// hooks/index.ts
export { useBookLoader, PageContent, Book } from "./useBookLoader";
export { useTextFormatting, FormatCommand } from "./useTextFormatting";
```
