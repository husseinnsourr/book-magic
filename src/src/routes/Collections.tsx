import { useTranslation } from 'react-i18next'
import { FolderOpen, Plus, BookOpen } from 'lucide-react'
import './Collections.css'

function Collections(): JSX.Element {
  const { t } = useTranslation()

  const collections = [
    { id: 1, name: 'للقراءة في 2026', count: 5 },
    { id: 2, name: 'كتب مفضلة', count: 8 },
    { id: 3, name: 'كتب العمل', count: 3 },
  ]

  return (
    <div className="collections-page animate-fadeIn">
      <div className="page-header">
        <h1>{t('nav.collections')}</h1>
        <button className="btn-primary">
          <Plus size={16} />
          <span>مجموعة جديدة</span>
        </button>
      </div>

      <div className="collections-grid">
        {collections.map(col => (
          <div key={col.id} className="collection-card">
            <div className="collection-icon">
              <FolderOpen size={24} />
            </div>
            <div className="collection-info">
              <span className="collection-name">{col.name}</span>
              <span className="collection-count">
                <BookOpen size={12} />
                {col.count} كتاب
              </span>
            </div>
          </div>
        ))}

        <div className="collection-card add-new">
          <Plus size={24} />
          <span>إضافة مجموعة</span>
        </div>
      </div>
    </div>
  )
}

export default Collections
