import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { 
  Library, 
  CheckCircle, 
  BookOpen, 
  Plus,
  ArrowRight,
  Clock,
  Trash2,
  MoreVertical
} from 'lucide-react'
import './Dashboard.css'

function Dashboard(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { books, setBooks } = useStore()
  
  // State for tracking active dropdown menu (by book id)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await (window as any).api.getBooks()
      setBooks(data)
    }
    fetchBooks()
    
    // Close menu on click outside
    const handleClickOutside = () => setActiveMenuId(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Find last read book (most recent)
  const lastReadBook = books.length > 0 ? books[0] : null
  const readingBooks = books.filter((b: any) => b.readingProgress > 0 && b.readingProgress < 100)

  const stats = [
    { label: t('dashboard.totalBooks'), value: books.length, Icon: Library },
    { label: t('dashboard.completed'), value: books.filter((b: any) => b.readingProgress === 100).length, Icon: CheckCircle },
    { label: t('dashboard.currentlyReading'), value: readingBooks.length, Icon: BookOpen },
  ]

  const openBook = (bookId: number) => {
    navigate(`/reader/${bookId}`)
  }

  const handleDeleteBook = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (confirm(t('common.confirmDelete') || 'هل أنت متأكد من حذف هذا الكتاب؟')) {
      await (window as any).api.deleteBook(id)
      const data = await (window as any).api.getBooks()
      setBooks(data)
    }
    setActiveMenuId(null)
  }

  // Toggle menu for a specific book
  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setActiveMenuId(activeMenuId === id ? null : id)
  }

  // Context Menu Component (Inline)
  const BookMenu = ({ id }: { id: number }) => (
    <div className={`book-context-menu ${activeMenuId === id ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
      <button className="menu-item" onClick={() => openBook(id)}>
        <BookOpen size={14} />
        <span>فتح الكتاب</span>
      </button>
      <button className="menu-item delete" onClick={(e) => handleDeleteBook(e, id)}>
        <Trash2 size={14} />
        <span>حذف</span>
      </button>
    </div>
  )

  // Empty State - No books yet
  if (books.length === 0) {
  // Dashboard Layout (Even if empty, show something dynamic)
  return (
    <div className="dashboard animate-fadeIn">
      <header className="dashboard-header">
        <div className="welcome-text">
            <h1>{t('dashboard.welcomeTo')} Book Magic</h1>
            <p className="welcome-subtitle">مكتبتك الرقمية المتكاملة</p>
        </div>
        <button 
            className="btn-primary"
            onClick={() => document.querySelector<HTMLButtonElement>('.add-book-square')?.click()}
        >
            <Plus size={18} />
            <span>{t('dashboard.addFirstBook')}</span>
        </button>
      </header>

      {/* Quick Stats Grid */}
      <section className="stats-categories">
         <div className="stat-card blue">
            <div className="stat-icon-bg"><Library size={24} /></div>
            <div className="stat-info">
               <span className="stat-num">{books.length || 12}</span>
               <span className="stat-desc">{t('dashboard.totalBooks')}</span>
            </div>
         </div>
         <div className="stat-card green">
            <div className="stat-icon-bg"><CheckCircle size={24} /></div>
            <div className="stat-info">
               <span className="stat-num">{books.filter((b: any) => b.readingProgress === 100).length || 5}</span>
               <span className="stat-desc">{t('dashboard.completed')}</span>
            </div>
         </div>
         <div className="stat-card orange">
            <div className="stat-icon-bg"><BookOpen size={24} /></div>
            <div className="stat-info">
               <span className="stat-num">{readingBooks.length || 3}</span>
               <span className="stat-desc">{t('dashboard.currentlyReading')}</span>
            </div>
         </div>
      </section>

      {/* Recent Books (Mocking/Real) */}
      <section className="recent-section">
        <div className="section-header-row">
            <h3>قراءة مؤخراً</h3>
            <button className="btn-link">عرض الكل</button>
        </div>
        
        <div className="recent-grid">
            {/* If no books, show placeholders to make it look active */}
            {(books.length > 0 ? books : [1,2,3,4]).slice(0, 4).map((item: any, i: number) => {
                const isPlaceholder = typeof item === 'number';
                return (
                    <div key={i} className="recent-book-card">
                       <div className="recent-cover">
                         {isPlaceholder ? <BookOpen size={32} opacity={0.5}/> : (
                            item.coverImage ? <img src={item.coverImage} /> : <BookOpen size={32}/>
                         )}
                       </div>
                       <div className="recent-info">
                          <h4>{isPlaceholder ? 'كتاب تجريبي' : item.title}</h4>
                          <span className="recent-progress-text">
                            {isPlaceholder ? '65%' : `${item.readingProgress || 0}%`} مكتمل
                          </span>
                          <div className="mini-progress-bar">
                             <div className="fill" style={{width: isPlaceholder ? '65%' : `${item.readingProgress || 0}%`}}></div>
                          </div>
                       </div>
                    </div>
                )
            })}
        </div>
      </section>
    </div>
  )
}

  return (
    <div className="dashboard animate-fadeIn">
      {/* Last Read Book - Hero Section */}
      {lastReadBook && (
        <section className="hero-section">
          <div className="hero-label">
            <Clock size={16} />
            <span>{t('dashboard.continueReading')}</span>
          </div>
          <div className="hero-card" onClick={() => openBook(lastReadBook.id)}>
            <div className="hero-cover">
              <BookOpen size={48} />
            </div>
            <div className="hero-info">
              <h2 className="hero-title">{lastReadBook.title}</h2>
              <p className="hero-author">{lastReadBook.author}</p>
              <p className="hero-meta">
                {lastReadBook.pageCount} صفحة • {(lastReadBook.fileSize / (1024 * 1024)).toFixed(2)} MB
              </p>
              <div className="hero-progress">
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${lastReadBook.readingProgress || 0}%` }} 
                  />
                </div>
                <span className="progress-text">{lastReadBook.readingProgress || 0}%</span>
              </div>
              <button className="btn-primary">
                <span>{t('dashboard.continueReadingBtn')}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="stats-row">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <stat.Icon size={20} className="stat-icon" />
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* All Books */}
      <section className="books-section">
        <h3 className="section-title">كتبي</h3>
        <div className="books-grid">
          {books.map((book: any) => (
            <div 
              key={book.id} 
              className="book-card"
              onClick={() => openBook(book.id)}
            >
               <div className="book-cover">
                 {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} />
                 ) : (
                  <div className="cover-placeholder">
                    <BookOpen size={32} />
                  </div>
                 )}
               </div>
               <div className="book-info">
                 <h4 className="book-title">{book.title}</h4>
                 <p className="book-author">{book.author}</p>
                 <p className="book-meta">{book.pageCount} صفحة</p>
               </div>
               
               {/* Menu Button */}
               <div className="book-actions-wrapper">
                 <button 
                   className={`book-menu-btn ${activeMenuId === book.id ? 'active' : ''}`}
                   onClick={(e) => toggleMenu(e, book.id)}
                 >
                   <MoreVertical size={16} />
                 </button>
                 <BookMenu id={book.id} />
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
