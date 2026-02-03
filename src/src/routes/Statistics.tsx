import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  BookOpen, 
  Clock,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react'
import './Statistics.css'

function Statistics(): JSX.Element {
  const { t } = useTranslation()

  const monthlyData = [
    { month: 'يناير', books: 4 },
    { month: 'فبراير', books: 3 },
    { month: 'مارس', books: 5 },
    { month: 'أبريل', books: 2 },
    { month: 'مايو', books: 6 },
    { month: 'يونيو', books: 4 },
  ]

  const categoryData = [
    { name: 'روايات', count: 12, color: '#8b5cf6' },      // Violet
    { name: 'تطوير ذات', count: 8, color: '#ec4899' },    // Pink
    { name: 'تاريخ', count: 5, color: '#f59e0b' },        // Amber
    { name: 'علوم', count: 3, color: '#10b981' },         // Emerald
  ]

  const maxBooks = Math.max(...monthlyData.map(d => d.books))

  return (
    <div className="statistics animate-fadeIn">
      <h1>{t('statistics.title')}</h1>

      {/* Overview Cards */}
      <section className="stats-overview">
        <div className="overview-card">
          <div className="overview-icon">
            <BookOpen size={20} />
          </div>
          <div className="overview-content">
            <span className="overview-value">28</span>
            <span className="overview-label">{t('dashboard.totalBooks')}</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Clock size={20} />
          </div>
          <div className="overview-content">
            <span className="overview-value">156</span>
            <span className="overview-label">ساعات القراءة</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Calendar size={20} />
          </div>
          <div className="overview-content">
            <span className="overview-value">45</span>
            <span className="overview-label">يوم متتالي</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Award size={20} />
          </div>
          <div className="overview-content">
            <span className="overview-value">12</span>
            <span className="overview-label">إنجاز</span>
          </div>
        </div>
      </section>

      {/* Monthly Progress */}
      <section className="chart-section">
        <div className="section-header">
          <TrendingUp size={18} />
          <h2>{t('statistics.monthlyProgress')}</h2>
        </div>
        <div className="bar-chart">
          {monthlyData.map((data, index) => (
            <div key={index} className="bar-item">
              <div className="bar-wrapper">
                <div 
                  className="bar" 
                  style={{ height: `${(data.books / maxBooks) * 100}%` }}
                >
                  <span className="bar-value">{data.books}</span>
                </div>
              </div>
              <span className="bar-label">{data.month}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Distribution */}
      <section className="chart-section">
        <div className="section-header">
          <BarChart3 size={18} />
          <h2>{t('statistics.categoryDistribution')}</h2>
        </div>
        <div className="category-list">
          {categoryData.map((cat, index) => (
            <div key={index} className="category-item">
              <div className="category-info">
                <div 
                  className="category-color" 
                  style={{ backgroundColor: cat.color }}
                />
                <span className="category-name">{cat.name}</span>
              </div>
              <div className="category-bar-wrapper">
                <div 
                  className="category-bar" 
                  style={{ 
                    width: `${(cat.count / 12) * 100}%`,
                    backgroundColor: cat.color
                  }} 
                />
              </div>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trends */}
      <section className="chart-section">
        <div className="section-header">
          <TrendingUp size={18} />
          <h2>{t('statistics.readingTrends')}</h2>
        </div>
        <div className="trends-grid">
          <div className="trend-card">
            <span className="trend-label">أفضل شهر</span>
            <span className="trend-value">مايو</span>
            <span className="trend-detail">6 كتب</span>
          </div>
          <div className="trend-card">
            <span className="trend-label">متوسط / شهر</span>
            <span className="trend-value">4</span>
            <span className="trend-detail">كتب</span>
          </div>
          <div className="trend-card">
            <span className="trend-label">أسرع كتاب</span>
            <span className="trend-value">3</span>
            <span className="trend-detail">أيام</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Statistics
