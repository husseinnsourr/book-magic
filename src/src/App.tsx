import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Dashboard from './routes/Dashboard'
import Library from './routes/Library'
import Statistics from './routes/Statistics'
import Settings from './routes/Settings'
import Tags from './routes/Tags'
import Collections from './routes/Collections'
import CloudSync from './routes/CloudSync'
import BookReader from './routes/BookReader/index'
import { useStore } from './store/useStore'

function App(): JSX.Element {
  const { theme, language, arabicFont, englishFont } = useStore()
  const location = useLocation()
  
  // Check if we're in the reader view
  const isReaderView = location.pathname.startsWith('/reader/')

  // Update document direction and language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  // Update font class based on language and font selection
  useEffect(() => {
    let fontClass: string
    if (language === 'ar') {
      fontClass = arabicFont === 'alt2' ? 'font-ar-alt2' 
        : arabicFont === 'alt' ? 'font-ar-alt' 
        : 'font-ar-default'
    } else {
      fontClass = englishFont === 'alt2' ? 'font-en-alt2'
        : englishFont === 'alt' ? 'font-en-alt'
        : 'font-en-default'
    }
    
    document.body.className = fontClass
  }, [language, arabicFont, englishFont])

  // Reader view - full screen without sidebar/topbar
  if (isReaderView) {
    return (
      <div className={`app-container ${theme}`}>
        <Routes>
          <Route path="/reader/:id" element={<BookReader />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar />
      <main className="main-content">
        {location.pathname !== '/library' && <TopBar />}
        <div className={`page-content ${location.pathname === '/library' ? 'full-page' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/cloud" element={<CloudSync />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
