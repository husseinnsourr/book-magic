// Book Reader - Translations
// ═══════════════════════════════════════════════════════════════════════════

export const translations = {
  ar: {
    // Dock buttons
    font: 'الخط',
    format: 'تنسيق',
    align: 'محاذاة',
    insert: 'إدراج',
    save: 'حفظ',
    settings: 'إعدادات',
    back: 'رجوع',
    
    // Font panel
    fontAndSize: 'الخط والحجم',
    textColor: 'لون النص',
    
    // Format panel
    textFormatting: 'تنسيق النص',
    bold: 'عريض',
    italic: 'مائل',
    underline: 'تسطير',
    strikethrough: 'يتوسطه خط',
    highlightYellow: 'تظليل أصفر',
    highlightGreen: 'تظليل أخضر',
    undoRedo: 'تراجع/إعادة',
    undo: 'تراجع',
    redo: 'إعادة',
    
    // Align panel
    alignment: 'المحاذاة',
    alignRight: 'يمين',
    alignCenter: 'وسط',
    alignLeft: 'يسار',
    justify: 'ضبط',
    lists: 'القوائم',
    bulletList: 'قائمة نقطية',
    numberedList: 'قائمة مرقمة',
    
    // Insert panel
    insertElements: 'إدراج عناصر',
    image: 'صورة',
    link: 'رابط',
    
    // Settings panel
    displaySettings: 'إعدادات العرض',
    fontLabel: 'خط',
    
    // Colors
    black: 'أسود',
    red: 'أحمر',
    blue: 'أزرق',
    green: 'أخضر',
    orange: 'برتقالي',
    purple: 'بنفسجي',
    Colors: 'الألوان',
    highlightColor: 'لون التظليل',
    'Text Color': 'لون النص',
    Highlight: 'تظليل',
    
    // Font picker
    'Font Family': 'نوع الخط',
    Size: 'الحجم',
    
    // Settings
    settingsMoved: 'تم نقل الإعدادات إلى الشريط العلوي',
    
    // Page
    emptyPage: 'هذه الصفحة فارغة',
    clickToWrite: 'انقر للبدء بالكتابة',
    startWriting: 'ابدأ الكتابة...',
    
    // Loading
    loading: 'جاري التحميل...',
    extractingText: 'جاري استخراج النص',
    bookNotFound: 'لم يتم العثور على الكتاب',
    backToLibrary: 'العودة للمكتبة',
    
    // Controls
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    nextPage: 'الصفحة التالية',
    prevPage: 'الصفحة السابقة',
    
    // Prompts
    enterImageUrl: 'أدخل رابط الصورة:',
    enterLinkUrl: 'أدخل الرابط:'
  },
  
  en: {
    // Dock buttons
    font: 'Font',
    format: 'Format',
    align: 'Align',
    insert: 'Insert',
    save: 'Save',
    settings: 'Settings',
    back: 'Back',
    
    // Font panel
    fontAndSize: 'Font & Size',
    textColor: 'Text Color',
    
    // Format panel
    textFormatting: 'Text Formatting',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    highlightYellow: 'Highlight Yellow',
    highlightGreen: 'Highlight Green',
    undoRedo: 'Undo/Redo',
    undo: 'Undo',
    redo: 'Redo',
    
    // Align panel
    alignment: 'Alignment',
    alignRight: 'Right',
    alignCenter: 'Center',
    alignLeft: 'Left',
    justify: 'Justify',
    lists: 'Lists',
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    
    // Insert panel
    insertElements: 'Insert Elements',
    image: 'Image',
    link: 'Link',
    
    // Settings panel
    displaySettings: 'Display Settings',
    fontLabel: 'Font',
    
    // Colors
    black: 'Black',
    red: 'Red',
    blue: 'Blue',
    green: 'Green',
    orange: 'Orange',
    purple: 'Purple',
    Colors: 'Colors',
    highlightColor: 'Highlight Color',
    'Text Color': 'Text Color',
    Highlight: 'Highlight',
    
    // Font picker
    'Font Family': 'Font Family',
    Size: 'Size',
    
    // Settings
    settingsMoved: 'Settings are now in the top bar',
    
    // Page
    emptyPage: 'This page is empty',
    clickToWrite: 'Click to start writing',
    startWriting: 'Start writing...',
    
    // Loading
    loading: 'Loading...',
    extractingText: 'Extracting text',
    bookNotFound: 'Book not found',
    backToLibrary: 'Back to Library',
    
    // Controls
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    nextPage: 'Next Page',
    prevPage: 'Previous Page',
    
    // Prompts
    enterImageUrl: 'Enter image URL:',
    enterLinkUrl: 'Enter link URL:'
  }
}

export type Language = 'ar' | 'en'
export type TranslationKey = keyof typeof translations.ar

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || key
}
