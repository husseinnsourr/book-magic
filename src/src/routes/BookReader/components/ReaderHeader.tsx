// Book Reader - Header Component
// ═══════════════════════════════════════════════════════════════════════════
//
// المسؤولية:
// - عرض عنوان الكتاب والمؤلف
// - زر التحرير/القراءة (يُدار من المكون الرئيسي)
//
// ═══════════════════════════════════════════════════════════════════════════

import { Book } from '../hooks'
import './styles/header.css'

interface ReaderHeaderProps {
  book: Book
}

export function ReaderHeader({ book }: ReaderHeaderProps): JSX.Element {
  return (
    <header className="reader-header">
      <div className="header-left">
        <span className="header-title">{book.title}</span>
        {book.author && <span className="header-author">{book.author}</span>}
      </div>
      {/* Edit button is now in the main index.tsx */}
    </header>
  )
}
