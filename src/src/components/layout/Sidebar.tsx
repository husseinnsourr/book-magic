import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store/useStore'
import { 
  Home, 
  Library, 
  BookOpen, 
  CheckCircle, 
  Heart, 
  Star,
  BarChart3, 
  Tags, 
  FolderOpen, 
  Cloud, 
  Settings,
  PanelLeft,
  BookMarked
} from 'lucide-react'
import './Sidebar.css'

function Sidebar(): JSX.Element {
  const { t } = useTranslation()
  const { sidebarCollapsed, toggleSidebar } = useStore()

  const mainNavItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/library', icon: Library, label: t('nav.library') },
    { path: '/statistics', icon: BarChart3, label: t('nav.statistics') },
  ]

  const librarySubItems = [
    { path: '/library?filter=all', icon: BookMarked, label: t('nav.allBooks') },
    { path: '/library?filter=reading', icon: BookOpen, label: t('nav.reading') },
    { path: '/library?filter=completed', icon: CheckCircle, label: t('nav.completed') },
    { path: '/library?filter=wishlist', icon: Star, label: t('nav.wishlist') },
    { path: '/library?filter=favorites', icon: Heart, label: t('nav.favorites') },
  ]

  const organizationItems = [
    { path: '/tags', icon: Tags, label: t('nav.tags') },
    { path: '/collections', icon: FolderOpen, label: t('nav.collections') },
    { path: '/cloud', icon: Cloud, label: t('nav.cloud') },
  ]

  // Larger icons for both states now
  const iconSize = sidebarCollapsed ? 22 : 20
  const subIconSize = sidebarCollapsed ? 22 : 18

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="logo-btn" 
          onClick={toggleSidebar}
          title={sidebarCollapsed ? t('nav.openMenu') : t('nav.closeMenu')}
        >
          <PanelLeft size={22} />
        </button>
        {!sidebarCollapsed && <span className="logo-text">Book Magic</span>}
      </div>

      <nav className="sidebar-nav">
        {/* Main Navigation */}
        <div className="nav-section">
          {mainNavItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={iconSize} className="nav-icon" />
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Library Sub-items */}
        <div className="nav-section">
          {!sidebarCollapsed && <span className="section-title">{t('nav.library')}</span>}
          {librarySubItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${!sidebarCollapsed ? 'sub-item' : ''} ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={subIconSize} className="nav-icon" />
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Organization Items */}
        <div className="nav-section">
          {!sidebarCollapsed && <span className="section-title">{t('nav.categories')}</span>}
          {organizationItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${!sidebarCollapsed ? 'sub-item' : ''} ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={subIconSize} className="nav-icon" />
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Settings */}
        <div className="nav-section nav-footer">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? t('nav.settings') : undefined}
          >
            <Settings size={iconSize} className="nav-icon" />
            {!sidebarCollapsed && <span className="nav-label">{t('nav.settings')}</span>}
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
