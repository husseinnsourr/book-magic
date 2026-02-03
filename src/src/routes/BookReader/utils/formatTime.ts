// ═══════════════════════════════════════════════════════════════════════════
// Format Time - Time formatting utilities
// ═══════════════════════════════════════════════════════════════════════════

type Language = 'ar' | 'en'

/**
 * Format date as relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date, language: Language): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (language === 'ar') {
    if (diffSeconds < 60) return 'منذ ثوانٍ'
    if (diffMinutes === 1) return 'منذ دقيقة'
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقائق`
    if (diffHours === 1) return 'منذ ساعة'
    if (diffHours < 24) return `منذ ${diffHours} ساعات`
    if (diffDays === 1) return 'منذ يوم'
    return `منذ ${diffDays} أيام`
  } else {
    if (diffSeconds < 60) return 'just now'
    if (diffMinutes === 1) return '1 minute ago'
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'yesterday'
    return `${diffDays} days ago`
  }
}

/**
 * Format time as HH:MM
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format date as readable string
 */
export function formatDate(date: Date, language: Language): string {
  return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format reading time estimate
 */
export function formatReadingTime(
  wordCount: number, 
  wpm: number = 200, 
  language: Language
): string {
  const minutes = Math.ceil(wordCount / wpm)
  
  if (language === 'ar') {
    if (minutes < 1) return 'أقل من دقيقة'
    if (minutes === 1) return 'دقيقة واحدة'
    if (minutes < 11) return `${minutes} دقائق`
    return `${minutes} دقيقة`
  } else {
    if (minutes < 1) return 'less than a minute'
    if (minutes === 1) return '1 minute'
    return `${minutes} minutes`
  }
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  const pad = (n: number) => n.toString().padStart(2, '0')
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  }
  return `${pad(minutes)}:${pad(secs)}`
}

/**
 * Format progress as percentage
 */
export function formatProgress(current: number, total: number): string {
  if (total === 0) return '0%'
  const percentage = Math.round((current / total) * 100)
  return `${percentage}%`
}
