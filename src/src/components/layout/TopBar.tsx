import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AddBookModal } from '../book/AddBookModal'
import { Search, Plus, Bell, User, Settings, LogOut, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './TopBar.css'

function TopBar(): JSX.Element {
  const { t } = useTranslation()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccount(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, text: t('notifications.empty'), read: false },
  ]

  return (
    <header className="topbar">
      {/* Left side - Search + Add Book */}
      <div className="topbar-left">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder={t('library.search')} />
          <kbd className="search-shortcut">Ctrl+K</kbd>
        </div>

        <button 
          className="add-book-square" 
          onClick={() => setIsAddModalOpen(true)}
          title={t('library.addBook')}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="topbar-right">


        {/* Notifications Dropdown */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <button 
            className="action-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title={t('notifications.title')}
          >
            <Bell size={18} />
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <span>{t('notifications.title')}</span>
                <button className="mark-read-btn">{t('notifications.markAllRead')}</button>
              </div>
              <div className="dropdown-content">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">
                    <Bell size={24} />
                    <span>{t('notifications.empty')}</span>
                  </div>
                ) : (
                  <div className="dropdown-empty">
                    <CheckCircle size={24} />
                    <span>{t('notifications.empty')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Account Dropdown */}
        <div className="dropdown-wrapper" ref={accountRef}>
          <button 
            className="user-avatar" 
            onClick={() => setShowAccount(!showAccount)}
            title={t('account.title')}
          >
            <User size={18} />
          </button>
          
          {showAccount && (
            <div className="dropdown-menu account-dropdown">
              <div className="account-header">
                <div className="account-avatar">
                  <User size={24} />
                </div>
                <div className="account-info">
                  <span className="account-name">Book Magic</span>
                  <span className="account-email">{t('account.profile')}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowAccount(false); }}>
                <Settings size={16} />
                <span>{t('nav.settings')}</span>
              </button>
              <button className="dropdown-item">
                <LogOut size={16} />
                <span>{t('account.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AddBookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </header>
  )
}

export default TopBar
