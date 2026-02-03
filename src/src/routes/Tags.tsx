import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, ImagePlus, Edit2 } from 'lucide-react'
import './Tags.css'

interface Tag {
  id: number
  name: string
  count: number
  color: string
  image?: string
}

function Tags(): JSX.Element {
  const { t } = useTranslation()

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'روايات', count: 12, color: '#3f3f46', image: '' }, 
    { id: 2, name: 'تطوير ذات', count: 8, color: '#3f3f46', image: '' },
    { id: 3, name: 'تاريخ', count: 5, color: '#3f3f46', image: '' },
    { id: 4, name: 'علوم', count: 3, color: '#3f3f46', image: '' },
    { id: 5, name: 'فلسفة', count: 2, color: '#3f3f46', image: '' },
  ])

  const handleImageUpload = async (tagId: number) => {
    // In real implementation, this would open file dialog
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setTags(prev => prev.map(tag => 
            tag.id === tagId ? { ...tag, image: event.target?.result as string } : tag
          ))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="tags-page animate-fadeIn">
      <div className="page-header">
        <h1>{t('nav.tags')}</h1>
        <button className="btn-primary">
          <Plus size={16} />
          <span>وسم جديد</span>
        </button>
      </div>

      <div className="tags-grid">
        {tags.map(tag => (
          <div 
            key={tag.id} 
            className="tag-card-vertical"
            style={{ '--tag-color': tag.color } as React.CSSProperties}
          >
            {/* Image Area */}
            <div 
              className="tag-image-area"
              onClick={() => handleImageUpload(tag.id)}
            >
              {tag.image ? (
                <img src={tag.image} alt={tag.name} className="tag-image" />
              ) : (
                <div className="tag-image-placeholder" style={{ background: tag.color }}>
                  <ImagePlus size={24} />
                  <span>إضافة صورة</span>
                </div>
              )}
              <div className="tag-image-overlay">
                <Edit2 size={16} />
              </div>
            </div>

            {/* Info Area */}
            <div className="tag-content">
              <div className="tag-color-dot" style={{ background: tag.color }} />
              <div className="tag-details">
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">{tag.count} كتاب</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Tag Card */}
        <div className="tag-card-vertical add-new-tag">
          <div className="add-tag-content">
            <Plus size={32} />
            <span>وسم جديد</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tags
