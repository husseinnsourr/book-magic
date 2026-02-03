import React, { useState, useMemo } from 'react'
import { 
  X, 
  Search, 
  Book, 
  Star, 
  Heart, 
  Home, 
  Bookmark, 
  Library,
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
  Dices,
  PenTool,
  Map,
  Compass as CompassIcon,
  Coffee,
  Brain,
  History,
  Rocket,
  Wand2,
  Scroll,
  Sprout,
  Anchor,
  Check
} from 'lucide-react'
import './IconPicker.css'

interface IconPickerProps {
  onSelect: (icon: string) => void
  onSelectColor: (color: string) => void
  onClose: () => void
  currentIcon?: string
  currentColor?: string
}

export const IconPicker: React.FC<IconPickerProps> = ({ 
  onSelect, 
  onSelectColor, 
  onClose, 
  currentIcon,
  currentColor 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const colors = [
    '#6b7280', // Slate Gray (Balanced)
    '#6366f1', // Indigo (Professional)
    '#8b5cf6', // Violet (Creative)
    '#0ea5e9', // Sky Blue (Calm)
    '#10b981', // Emerald (Fresh)
    '#f43f5e', // Rose (Elegant)
    '#f59e0b'  // Amber (Classic)
  ]

  const iconCategories = useMemo(() => [
    {
      name: 'General',
      items: [
        { name: 'Library', icon: <Library size={24} /> },
        { name: 'Home', icon: <Home size={24} /> },
        { name: 'Star', icon: <Star size={24} /> },
        { name: 'Heart', icon: <Heart size={24} /> },
        { name: 'Globe', icon: <Globe size={24} /> },
        { name: 'Compass', icon: <CompassIcon size={24} /> },
      ]
    },
    {
      name: 'Learning & Writing',
      items: [
        { name: 'Book', icon: <Book size={24} /> },
        { name: 'Bookmark', icon: <Bookmark size={24} /> },
        { name: 'Feather', icon: <Feather size={24} /> },
        { name: 'PenTool', icon: <PenTool size={24} /> },
        { name: 'GraduationCap', icon: <GraduationCap size={24} /> },
        { name: 'Brain', icon: <Brain size={24} /> },
        { name: 'Scroll', icon: <Scroll size={24} /> },
        { name: 'History', icon: <History size={24} /> },
      ]
    },
    {
      name: 'Magic & Nature',
      items: [
        { name: 'Sparkles', icon: <Sparkles size={24} /> },
        { name: 'Wand2', icon: <Wand2 size={24} /> },
        { name: 'Crown', icon: <Crown size={24} /> },
        { name: 'Ghost', icon: <Ghost size={24} /> },
        { name: 'Flame', icon: <Flame size={24} /> },
        { name: 'Zap', icon: <Zap size={24} /> },
        { name: 'Moon', icon: <Moon size={24} /> },
        { name: 'Sun', icon: <Sun size={24} /> },
        { name: 'Sprout', icon: <Sprout size={24} /> },
      ]
    },
    {
      name: 'Lifestyle',
      items: [
        { name: 'Coffee', icon: <Coffee size={24} /> },
        { name: 'Music', icon: <Music size={24} /> },
        { name: 'Camera', icon: <Camera size={24} /> },
        { name: 'Laptop', icon: <Laptop size={24} /> },
        { name: 'Palette', icon: <Palette size={24} /> },
        { name: 'Rocket', icon: <Rocket size={24} /> },
        { name: 'Map', icon: <Map size={24} /> },
        { name: 'Anchor', icon: <Anchor size={24} /> },
      ]
    }
  ], [])

  const filteredCategories = iconCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(i => 
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  const handleRandom = () => {
    const allIcons = iconCategories.flatMap(c => c.items)
    const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    onSelect(randomIcon.name)
    onSelectColor(randomColor)
    onClose()
  }

  return (
    <div className="icon-picker-overlay animate-fadeIn" onClick={onClose}>
      <div className="icon-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="icon-picker-header">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="بحث في الأيقونات الاحترافية..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button className="random-btn" onClick={handleRandom} title="عشوائي">
            <Dices size={18} />
          </button>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="color-selection-area">
          <div className="section-label">تحديد اللون</div>
          <div className="color-grid">
            {colors.map((color, idx) => (
              <button 
                key={idx}
                className={`color-pill ${currentColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => onSelectColor(color)}
              >
                {currentColor === color && <Check size={12} color={color === '#ffffff' ? '#000' : '#fff'} />}
              </button>
            ))}
          </div>
        </div>

        <div className="icon-picker-content custom-scrollbar">
          <div className="categorized-icons">
            {filteredCategories.map((cat, idx) => (
              <div key={idx} className="category-section">
                <h3 className="category-title">{cat.name}</h3>
                <div className="icon-grid">
                  {cat.items.map((i, index) => (
                    <button 
                      key={index}
                      className={`icon-item ${currentIcon === i.name ? 'selected' : ''}`}
                      onClick={() => {
                        onSelect(i.name)
                        onClose()
                      }}
                      title={i.name}
                      style={{ color: currentIcon === i.name ? currentColor : undefined }}
                    >
                      {i.icon}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
