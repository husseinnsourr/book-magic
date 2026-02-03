import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutGrid, 
  Book as BookIcon, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  MoreVertical,
  Trash2,
  BookOpen,
  Heart,
  Star,
  Check,
  Edit2,
  Upload,
  Move,
  Smile,
  Library as LibraryIcon,
  Bookmark,
  Home,
  Feather,
  Sparkles,
  Crown,
  GraduationCap,
  Globe,
  Zap,
  Flame,
  Moon,
  Sun,
  Palette,
  Music,
  Camera,
  Laptop,
  Ghost,
  PenTool,
  Map,
  Scroll,
  Sprout,
  Anchor,
  User,
  Bell,
  Grid3X3,
  List as ListIcon,
  Layout as LayoutIcon,
  Layers,
  MoreHorizontal,
  Menu,
  Settings as SettingsIcon,
  X,
  Wand2,
  Compass as CompassIcon,
  Coffee as CoffeeIcon
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { IconPicker } from '../components/IconPicker'
import { ImageCropper } from '../components/ImageCropper'
import { dummyBooks } from '../constants/dummyData'
import './Library.css'

type FilterStatus = 'all' | 'reading' | 'completed' | 'unread' | 'wishlist' | 'favorites'
type SortOption = 'title' | 'author' | 'date' | 'progress' | 'rating'

function Library() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { 
    libraryView, 
    setLibraryView,
    books, 
    setBooks, 
    libraryCover,
    setLibraryCover,
    libraryCoverHeight,
    libraryCoverPosition,
    libraryTitle,
    setLibraryTitle,
    libraryDescription,
    setLibraryDescription,
    libraryIcon,
    setLibraryIcon,
    libraryIconColor,
    setLibraryIconColor
  } = useStore()
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const IconMap: { [key: string]: React.ReactNode } = useMemo(() => ({
    'Library': <LibraryIcon size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Book': <BookIcon size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Bookmark': <Bookmark size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Star': <Star size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Heart': <Heart size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Home': <Home size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Feather': <Feather size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Sparkles': <Sparkles size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Crown': <Crown size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'GraduationCap': <GraduationCap size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Globe': <Globe size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Compass': <CompassIcon size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Zap': <Zap size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Flame': <Flame size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Moon': <Moon size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Sun': <Sun size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Palette': <Palette size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Music': <Music size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Camera': <Camera size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'CoffeeIcon': <CoffeeIcon size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Laptop': <Laptop size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Ghost': <Ghost size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'PenTool': <PenTool size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Map': <Map size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Scroll': <Scroll size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Sprout': <Sprout size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Anchor': <Anchor size={32} strokeWidth={1.5} color={libraryIconColor} />,
    'Wand2': <Wand2 size={32} strokeWidth={1.5} color={libraryIconColor} />,
  }), [libraryIconColor])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortOption>('title')
  const [sortAsc, setSortAsc] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [showCoverControls, setShowCoverControls] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showViewMenu, setShowViewMenu] = useState(false)
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false)
  const [showSectionsMenu, setShowSectionsMenu] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await (window as any).api.getBooks()
      if (data.length === 0) {
        setBooks(dummyBooks as any)
      } else {
        setBooks(data)
      }
    }
    fetchBooks()
    
    const libraryContainer = document.querySelector('.library-content')
    const handleScroll = () => {
      if (libraryContainer) {
        const scrolled = libraryContainer.scrollTop > 100
        document.querySelector('.library')?.classList.toggle('is-scrolled', scrolled)
      }
    }
    libraryContainer?.addEventListener('scroll', handleScroll)

    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowFilters(false)
        setShowSort(false)
        setShowViewMenu(false)
        setShowSectionsMenu(false)
      }
      setActiveMenuId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      libraryContainer?.removeEventListener('scroll', handleScroll)
    }
  }, [setBooks])

  const handleOpenBook = (id: number) => {
    navigate(`/reader/${id}`)
  }

  const viewModes: ('grid' | 'list' | 'shelf' | 'cover')[] = ['grid', 'list', 'shelf', 'cover']
  const handleToggleView = () => {
    const currentIndex = viewModes.indexOf(libraryView)
    const nextIndex = (currentIndex + 1) % viewModes.length
    setLibraryView(viewModes[nextIndex])
  }

  const ViewIconMap = {
    grid: <Grid3X3 size={18} />,
    list: <ListIcon size={18} />,
    shelf: <Layers size={18} />,
    cover: <LayoutIcon size={18} />
  }

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const handleViewMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setShowViewMenu(true)
    }, 4000)
  }
  const handleViewMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const coverInputRef = useRef<HTMLInputElement>(null)
  const [tempCoverSrc, setTempCoverSrc] = useState<string | null>(null)

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setTempCoverSrc(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleLibraryCropSave = (croppedDataUrl: string) => {
    setLibraryCover(croppedDataUrl)
    setTempCoverSrc(null)
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

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setActiveMenuId(activeMenuId === id ? null : id)
  }

  const filterOptions = [
    { key: 'all', label: 'الكل', icon: <LayoutGrid size={16} /> },
    { key: 'reading', label: 'قيد القراءة', icon: <BookOpen size={16} /> },
    { key: 'completed', label: 'مكتمل', icon: <Check size={16} /> },
    { key: 'unread', label: 'لم يُقرأ', icon: <BookIcon size={16} /> },
    { key: 'wishlist', label: 'قائمة الرغبات', icon: <Bookmark size={16} /> },
    { key: 'favorites', label: 'المفضلة', icon: <Heart size={16} /> },
  ]

  const quickTags = [
    { label: 'روايات', icon: <BookIcon size={12} /> },
    { label: 'تاريخ', icon: <Scroll size={12} /> },
    { label: 'علوم', icon: <Sparkles size={12} /> },
    { label: 'فن', icon: <Palette size={12} /> },
    { label: 'برمجة', icon: <Laptop size={12} /> },
  ]

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'title', label: 'العنوان' },
    { key: 'author', label: 'المؤلف' },
    { key: 'date', label: 'تاريخ الإضافة' },
    { key: 'progress', label: 'التقدم' },
    { key: 'rating', label: 'التقييم' },
  ]

  const filteredBooks = useMemo(() => {
    let result = [...books]
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((book: any) =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query)
      )
    }
    if (filterStatus !== 'all') {
      result = result.filter((book: any) => {
        switch (filterStatus) {
          case 'reading': return book.progress > 0 && book.progress < 100
          case 'completed': return book.progress === 100
          case 'unread': return !book.progress || book.progress === 0
          case 'wishlist': return book.status === 'wishlist'
          case 'favorites': return book.isFavorite
          default: return true
        }
      })
    }
    result.sort((a: any, b: any) => {
      let comparison = 0
      switch (sortBy) {
        case 'title': comparison = (a.title || '').localeCompare(b.title || ''); break
        case 'author': comparison = (a.author || '').localeCompare(b.author || ''); break
        case 'progress': comparison = (a.progress || 0) - (b.progress || 0); break
        case 'rating': comparison = (a.rating || 0) - (b.rating || 0); break
        case 'date': comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(); break
        default: break
      }
      return sortAsc ? comparison : -comparison
    })
    return result
  }, [books, searchQuery, filterStatus, sortBy, sortAsc])

  const BookMenu = ({ id }: { id: number }) => (
    <div className={`book-context-menu ${activeMenuId === id ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
      <button className="menu-item" onClick={() => handleOpenBook(id)}>
        <BookOpen size={14} />
        <span>فتح الكتاب</span>
      </button>
      <button className="menu-item delete" onClick={(e) => handleDeleteBook(e, id)}>
        <Trash2 size={14} />
        <span>حذف</span>
      </button>
    </div>
  )

  const renderEmptyState = () => (
    <div className="library-empty">
      <div className="empty-icon-wrapper"><BookOpen size={48} /></div>
      <h2>{searchQuery ? 'لا توجد نتائج' : t('library.empty')}</h2>
      <p>{searchQuery ? 'جرب كلمات بحث مختلفة' : 'أضف كتباً لتظهر هنا'}</p>
      {!searchQuery && (
        <button className="btn-primary" onClick={() => (window as any).api.openFile() || document.querySelector<HTMLButtonElement>('.action-btn.primary')?.click()}>
          <Plus size={18} /><span>{t('library.addBook')}</span>
        </button>
      )}
    </div>
  )

  const renderGridView = () => (
    <div className="books-grid">
      {filteredBooks.map((book: any) => (
        <div key={book.id} className="book-card animate-fadeIn" onClick={() => handleOpenBook(book.id)}>
          <div className="book-cover">
            <div className="cover-placeholder"><BookOpen size={40} /></div>
            {book.progress > 0 && book.progress < 100 && <div className="progress-indicator"><span>{book.progress}%</span></div>}
            {book.progress === 100 && <div className="completed-badge"><Check size={12} /></div>}
            <button className="favorite-btn" title="المفضلة" onClick={(e) => e.stopPropagation()}>
              <Heart size={16} fill={book.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
          </div>
          <div className="book-actions-wrapper">
            <button className={`book-menu-btn ${activeMenuId === book.id ? 'active' : ''}`} onClick={(e) => toggleMenu(e, book.id)}><MoreVertical size={16} /></button>
            <BookMenu id={book.id} />
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="books-list">
      {filteredBooks.map((book: any) => (
        <div key={book.id} className="book-list-item animate-slideUp" onClick={() => handleOpenBook(book.id)}>
          <div className="list-cover"><div className="cover-placeholder-small"><BookOpen size={20} /></div></div>
          <div className="list-info"><h3>{book.title}</h3><p>{book.author}</p></div>
          <div className="list-progress"><div className="mini-progress-bar"><div className="mini-progress-fill" style={{ width: `${book.progress || 0}%` }} /></div><span>{book.progress || 0}%</span></div>
          <div className="list-actions-wrapper">
            <button className="list-menu-btn" onClick={(e) => toggleMenu(e, book.id)}><MoreVertical size={16} /></button>
            <BookMenu id={book.id} />
          </div>
        </div>
      ))}
    </div>
  )

  const renderShelfView = () => (
    <div className="books-shelf">
      <div className="shelf-row">
        {filteredBooks.slice(0, 8).map((book: any) => (
          <div key={book.id} className="shelf-book" title={book.title} onClick={() => handleOpenBook(book.id)}>
            <div className="shelf-spine"><span>{book.title?.substring(0, 20)}</span><BookMenu id={book.id} /></div>
          </div>
        ))}
      </div>
      <div className="shelf-wood" />
    </div>
  )

  const renderCoverFlowView = () => (
    <div className="cover-flow">
      {filteredBooks.map((book: any) => (
        <div key={book.id} className="flow-cover" onClick={() => handleOpenBook(book.id)}>
          <div className="flow-cover-inner">
            <div className="cover-placeholder-large"><BookOpen size={48} /><span>{book.title}</span></div>
            <div className="flow-actions"><BookMenu id={book.id} /><button onClick={(e) => toggleMenu(e, book.id)}><MoreVertical/></button></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderPageHeader = () => {
    const heightMap = { small: '140px', medium: '220px', large: '320px' } as const
    const heightValue = heightMap[(libraryCoverHeight as keyof typeof heightMap) || 'medium']

    return (
      <div className="notion-header">
        <div className="notion-cover" style={{ height: heightValue, maxHeight: 'none' }} onMouseEnter={() => setShowCoverControls(true)} onMouseLeave={() => setShowCoverControls(false)}>
          <img src={libraryCover || ''} alt="Cover" className="cover-image" style={{ objectPosition: `center ${libraryCoverPosition}%` }} />
          <div className="cover-gradient-overlay" />
          {showCoverControls && (
            <div className="cover-controls-overlay animate-fadeIn">
              <button className="cover-control-btn" onClick={() => coverInputRef.current?.click()} title="تغيير الغلاف"><Upload size={18} strokeWidth={1.5} /></button>
              {libraryCover && <button className="cover-control-btn" onClick={() => setTempCoverSrc(libraryCover)} title="تغيير الموضع"><Move size={18} strokeWidth={1.5} /></button>}
            </div>
          )}
          <input type="file" ref={coverInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleCoverUpload} />
          
          <div className="notion-page-actions">
            <div className="header-left-group">
              <button className="action-icon-btn mobile-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="breadcrumb-nav">
                <span className="breadcrumb-current">المكتبة</span>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div className="header-right-actions">
              <button className="action-icon-btn" onClick={() => navigate('/')} title="الرئيسية">
                <Home size={19} strokeWidth={1.5} />
              </button>
              <button className="action-icon-btn" onClick={() => {
                setSearchExpanded(true)
                setTimeout(() => {
                  const searchInput = document.querySelector('.search-wrapper input') as HTMLInputElement
                  searchInput?.focus()
                }, 100)
              }} title="بحث">
                <Search size={19} strokeWidth={1.5} />
              </button>
              <button className="action-icon-btn" title="المزيد">
                <MoreHorizontal size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {mobileSidebarOpen && (
          <div className="mobile-sidebar-overlay animate-fadeIn" onClick={() => setMobileSidebarOpen(false)}>
            <div className="mobile-sidebar-drawer animate-slideLeft" onClick={e => e.stopPropagation()}>
              <div className="drawer-header">
                  <span className="logo-text">Book Magic</span>
                  <button className="close-btn" onClick={() => setMobileSidebarOpen(false)}><X size={24} /></button>
              </div>
              <nav className="drawer-nav">
                  <button onClick={() => { navigate('/'); setMobileSidebarOpen(false) }}><Home size={20} /><span>الرئيسية</span></button>
                  <button className="active"><LibraryIcon size={20} /><span>المكتبة</span></button>
                  <button onClick={() => { navigate('/settings'); setMobileSidebarOpen(false) }}><SettingsIcon size={20} /><span>الإعدادات</span></button>
              </nav>
            </div>
          </div>
        )}

        <div className="notion-page-info">
          <div className="header-top-row">
            <div className="page-icon-box shadow-glow clickable" onClick={() => setShowIconPicker(true)}>
              {IconMap[libraryIcon] ? <div className="library-custom-icon">{IconMap[libraryIcon]}</div> : libraryIcon && libraryIcon.length < 5 ? <span className="library-emoji">{libraryIcon}</span> : <LibraryIcon size={32} strokeWidth={1.5} color="white" />}
              <div className="icon-edit-hint"><Smile size={14} /></div>
            </div>

            <div className={`header-dashboard-actions inline-actions ${showMobileUserMenu ? 'active' : ''}`}>
              <button className="dash-menu-trigger" onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}>
                  {showMobileUserMenu ? <Plus style={{ transform: 'rotate(45deg)' }} size={20} /> : <MoreVertical size={20} />}
              </button>
              <div className="mobile-action-bar-wrapper">
                  <div className="mobile-action-bar animate-slideIn">
                    <button className="dash-icon-btn profile"><User size={20} /></button>
                    <button className="dash-icon-btn"><Bell size={18} /></button>
                  </div>
              </div>
            </div>
          </div>

          <div className="title-group">
            {isEditingTitle ? <input autoFocus className="page-title-input" value={libraryTitle} onChange={(e) => setLibraryTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} /> : <h1 className="page-title" onClick={() => setIsEditingTitle(true)}>{libraryTitle}</h1>}
          </div>
          <div className="page-description">
            {isEditingDesc ? <input autoFocus className="page-desc-input" value={libraryDescription} onChange={(e) => setLibraryDescription(e.target.value)} onBlur={() => setIsEditingDesc(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingDesc(false)} /> : <div className="desc-text-wrapper" onClick={() => setIsEditingDesc(true)}><span>{filteredBooks.length} كتب</span><span className="dot-separator">•</span><span className="library-desc-text">{libraryDescription}</span></div>}
          </div>
        </div>
      </div>
    )
  }

  const renderToolbar = () => (
    <div className="toolbar-container" ref={toolbarRef}>
      <div className="database-toolbar">
        <div className="view-tabs">
          <div className="tabs-desktop-only">
            {filterOptions.slice(0, 4).map(opt => (
              <button key={opt.key} className={`view-tab ${filterStatus === opt.key ? 'active' : ''}`} onClick={() => setFilterStatus(opt.key as FilterStatus)}>
                <span>{opt.label}</span>
                {opt.icon}
              </button>
            ))}
          </div>

          <div className="tabs-mobile-only">
              <button className="view-tab active" onClick={() => { setShowFilters(!showFilters); setShowSort(false); setShowViewMenu(false); setShowSectionsMenu(false) }}>
                {searchQuery ? (
                  <>
                    <span className="tab-title-text">{searchQuery}</span>
                    {quickTags.find(t => t.label === searchQuery)?.icon || <Bookmark size={16} />}
                  </>
                ) : filterStatus === 'all' ? (
                  <>
                    <span className="tab-title-text">الكل</span>
                    <LayoutGrid size={16} />
                  </>
                ) : (
                  <>
                    <span className="tab-title-text">{filterOptions.find(o => o.key === filterStatus)?.label}</span>
                    {filterOptions.find(o => o.key === filterStatus)?.icon}
                  </>
                )}
              </button>
          </div>

          <div className="search-integrated">
            {searchExpanded || (window.innerWidth > 768) ? (
              <div className={`search-wrapper ${searchExpanded ? 'expanded' : ''}`}>
                <Search size={16} className="search-icon-inline" />
                <input 
                  type="text" 
                  placeholder="بحث في المكتبة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => window.innerWidth <= 768 && !searchQuery && setSearchExpanded(false)}
                  autoFocus={searchExpanded}
                />
              </div>
            ) : (
              <button className="action-icon-btn search-trigger" onClick={() => setSearchExpanded(true)}>
                <Search size={18} />
              </button>
            )}
          </div>
          <div className="separator-vertical" />
        </div>

        <div className="toolbar-actions">
          <div className="secondary-actions-group">
            <div className="popover-wrapper">
              <button className={`action-icon-btn ${showFilters ? 'active' : ''}`} onClick={() => { setShowFilters(!showFilters); setShowSort(false); setShowViewMenu(false); setShowSectionsMenu(false) }} title={t('library.filter')}><SlidersHorizontal size={18} /></button>
              {showFilters && (
                <div className="notion-popover filter-popover animate-scaleIn">
                  {filterOptions.map(opt => (
                    <button key={opt.key} className={`popover-item ${filterStatus === opt.key ? 'active' : ''}`} onClick={() => { setFilterStatus(opt.key as FilterStatus); setShowFilters(false) }}>
                      {opt.icon}<span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="popover-wrapper">
              <button className={`action-icon-btn ${showSort ? 'active' : ''}`} onClick={() => { setShowSort(!showSort); setShowFilters(false); setShowViewMenu(false); setShowSectionsMenu(false) }} title={t('library.sort')}><ArrowUpDown size={18} /></button>
              {showSort && (
                <div className="notion-popover sort-popover animate-scaleIn">
                  <div className="popover-header">ترتيب حسب</div>
                  {sortOptions.map(opt => (
                    <button key={opt.key} className={`popover-item ${sortBy === opt.key ? 'active' : ''}`} onClick={() => { setSortBy(opt.key); setSortAsc(!sortAsc); setShowSort(false) }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="separator-vertical" />
            
            <div className="view-switcher-dynamic popover-wrapper" onMouseEnter={() => setShowViewMenu(true)} onMouseLeave={() => setShowViewMenu(false)}>
              <button 
                className="action-icon-btn view-btn" 
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    setShowViewMenu(!showViewMenu);
                    setShowFilters(false);
                    setShowSort(false);
                    setShowSectionsMenu(false);
                  } else {
                    handleToggleView();
                  }
                }}
                onMouseDown={handleViewMouseDown}
                onMouseUp={handleViewMouseUp}
              >
                {ViewIconMap[libraryView]}
              </button>
              {showViewMenu && (
                <div className="notion-popover view-mode-popover animate-scaleIn">
                  {viewModes.map(mode => (
                    <button key={mode} className={`popover-item ${libraryView === mode ? 'active' : ''}`} onClick={() => { setLibraryView(mode); setShowViewMenu(false) }}>
                      {ViewIconMap[mode]}<span>{mode === 'grid' ? 'شبكة' : mode === 'list' ? 'قائمة' : mode === 'shelf' ? 'رفوف' : 'أغلفة'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="primary-actions-group">
            <div className="popover-wrapper">
              <button className={`action-icon-btn more-filter-btn mobile-only-sparkle ${showSectionsMenu ? 'active' : ''}`} onClick={() => setShowSectionsMenu(!showSectionsMenu)}>
                  <Sparkles size={18} />
              </button>
              {showSectionsMenu && (
                <div className="notion-popover sections-popover animate-scaleIn">
                  <div className="popover-header">الأقسام</div>
                  <button className="popover-item"><Star size={14} /><span>مميز</span></button>
                  <button className="popover-item"><Bookmark size={14} /><span>إشارات مرجعية</span></button>
                  {quickTags.map(tag => (
                    <button key={tag.label} className={`popover-item ${searchQuery === tag.label ? 'active' : ''}`} onClick={() => { setSearchQuery(tag.label); setShowSectionsMenu(false) }}>
                      {tag.icon}<span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="action-icon-btn new-icon primary-glow square" title="إضافة كتاب" onClick={() => (window as any).api.openFile?.() || document.querySelector<HTMLButtonElement>('.action-btn.primary')?.click()}>
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderQuickTags = () => (
    <div className="quick-tags-container">
      {quickTags.map(tag => (
        <button key={tag.label} className="quick-tag" onClick={() => setSearchQuery(tag.label)}>
          <span>{tag.label}</span>
          {tag.icon}
        </button>
      ))}
    </div>
  )

  return (
    <div className="library animate-fadeIn notion-theme">
      {renderPageHeader()}
      {renderToolbar()}
      {renderQuickTags()}
      <div className="library-content notion-content">
        {filteredBooks.length === 0 ? renderEmptyState() : (
          <>
            {libraryView === 'grid' && renderGridView()}
            {libraryView === 'list' && renderListView()}
            {libraryView === 'shelf' && renderShelfView()}
            {libraryView === 'cover' && renderCoverFlowView()}
          </>
        )}
      </div>
      {tempCoverSrc && <ImageCropper imageSrc={tempCoverSrc} onCancel={() => setTempCoverSrc(null)} onSave={handleLibraryCropSave} title={t('settings.adjustCover') || 'تعديل الغلاف'} saveLabel={t('common.save')} aspectRatio={4.5} />}
      {showIconPicker && <IconPicker currentIcon={libraryIcon} currentColor={libraryIconColor} onSelect={setLibraryIcon} onSelectColor={setLibraryIconColor} onClose={() => setShowIconPicker(false)} />}
    </div>
  )
}

export default Library
