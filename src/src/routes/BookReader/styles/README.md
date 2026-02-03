# 🎨 Styles

الأنماط الرئيسية لصفحة BookReader.

## 📁 الملفات

| الملف      | الوصف                         |
| ---------- | ----------------------------- |
| `main.css` | المتغيرات CSS والأنماط العامة |

---

## 🎨 Notion Theme

### المتغيرات الأساسية

```css
:root {
  /* الخلفيات */
  --notion-bg: #191919;
  --notion-bg-secondary: #202020;
  --notion-surface: #252525;
  --notion-surface-hover: #2d2d2d;

  /* الحدود */
  --notion-border: rgba(255, 255, 255, 0.1);

  /* النصوص */
  --notion-text: #ebebeb;
  --notion-text-secondary: #9b9b9b;
  --notion-text-muted: #5a5a5a;

  /* الألوان */
  --notion-accent: #2383e2;
  --notion-success: #4ade80;
  --notion-warning: #fbbf24;
  --notion-error: #f87171;
}
```

### متغيرات الصفحة

```css
:root {
  /* قياسات A4 */
  --a4-width: 794px;
  --a4-height: 1123px;

  /* ألوان الصفحة */
  --page-bg: #2f2f2f;
  --page-text: #e0e0e0;
  --page-text-secondary: #888888;

  /* الـ Dock */
  --dock-width: 52px;
  --dock-icon-size: 38px;
}
```

---

## 📐 الأقسام

### Container

```css
.reader-container { ... }
```

- الحاوية الرئيسية
- 100vh ارتفاع

### Header

```css
.reader-header { ... }
.edit-toggle-btn { ... }
```

- الهيدر العلوي
- زر التحرير

### Main Layout

```css
.reader-main-layout { ... }
.reader-main-layout.ltr { ... }
```

- RTL: الـ Dock يمين
- LTR: الـ Dock يسار

### Error Banner

```css
.error-banner { ... }
```

- رسائل الخطأ
- أحمر مع زر إعادة

---

## 🖨️ Print Styles

```css
@media print {
  .reader-header,
  .dynamic-dock,
  .floating-controls {
    display: none !important;
  }

  .a4-page {
    background: white !important;
    color: black !important;
  }
}
```

---

## ⚠️ ملاحظات

1. **استخدم المتغيرات** - لا تكتب ألوان مباشرة
2. **RTL/LTR** - استخدم الـ class `.ltr` للإنجليزي
3. **Print** - تأكد من إخفاء العناصر غير الضرورية
