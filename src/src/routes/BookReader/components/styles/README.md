# 🎨 Component Styles

أنماط CSS لمكونات BookReader.

## 📁 الملفات

| الملف          | المكون                 | الوصف                 |
| -------------- | ---------------------- | --------------------- |
| `header.css`   | ReaderHeader           | أنماط الهيدر          |
| `dock.css`     | ReaderDock, DockPanels | شريط الأدوات واللوحات |
| `page.css`     | A4Page                 | صفحة A4 والمحتوى      |
| `controls.css` | FloatingControls       | الأزرار العائمة       |
| `loading.css`  | LoadingStates          | حالات التحميل         |

---

## 📐 header.css

```css
.reader-header { ... }      /* الهيدر الرئيسي */
.header-left { ... }        /* العنوان والمؤلف */
.header-right { ... }       /* الأزرار */
.edit-toggle-btn { ... }    /* زر التحرير */
```

---

## 📐 dock.css

```css
.dynamic-dock { ... }       /* الحاوية */
.dock-btn { ... }           /* أيقونة */
.dock-tooltip { ... }       /* التلميح */
.dock-panel { ... }         /* لوحة منبثقة */
.tools-grid { ... }         /* شبكة الأدوات */
.grid-btn { ... }           /* زر أداة */
```

### RTL/LTR

```css
.dynamic-dock.ltr { ... }   /* إنجليزي */
.dock-panel.ltr { ... }     /* لوحة إنجليزي */
```

---

## 📐 page.css

```css
.page-container { ... }     /* حاوية الصفحة */
.a4-page { ... }            /* صفحة A4 */
.a4-page.editing { ... }    /* وضع التحرير */
.page-text { ... }          /* المحتوى (قراءة) */
.page-editor { ... }        /* المحرر (تحرير) */
.empty-state { ... }        /* صفحة فارغة */
.char-limit-indicator { ... } /* عداد الأحرف */
```

---

## 📐 controls.css

```css
.floating-controls { ... }  /* الحاوية */
.control-group { ... }      /* مجموعة أزرار */
.ctrl-btn { ... }           /* زر */
.ctrl-value { ... }         /* القيمة */
```

---

## 📐 loading.css

```css
.reader-loading { ... }     /* حاوية التحميل */
.spin { ... }               /* حركة الدوران */
.progress-track { ... }     /* مسار التقدم */
.progress-bar { ... }       /* شريط التقدم */
```

---

## ⚠️ قواعد مهمة

1. **استخدم متغيرات من main.css**

   ```css
   /* صح ✅ */
   background: var(--notion-surface);

   /* خطأ ❌ */
   background: #252525;
   ```

2. **دعم RTL/LTR**

   ```css
   .element { ... }
   .element.ltr { ... }
   ```

3. **Print Styles**
   ```css
   @media print {
     .element {
       display: none !important;
     }
   }
   ```
