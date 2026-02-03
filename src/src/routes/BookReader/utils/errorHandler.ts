// ═══════════════════════════════════════════════════════════════════════════
// Error Handler - Recovery and User-Friendly Messages
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  FILE = 'FILE',
  PARSE = 'PARSE',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Structured error with type and context
 */
export interface AppError {
  type: ErrorType
  message: string
  originalError?: Error
  context?: Record<string, unknown>
  recoverable: boolean
}

/**
 * Create a typed error
 */
export function createError(
  type: ErrorType,
  message: string,
  originalError?: Error,
  context?: Record<string, unknown>
): AppError {
  return {
    type,
    message,
    originalError,
    context,
    recoverable: type !== ErrorType.PERMISSION && type !== ErrorType.NOT_FOUND
  }
}

/**
 * Error Recovery utilities
 */
export class ErrorRecovery {
  /**
   * Retry a function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt < maxAttempts) {
          const delay = initialDelay * Math.pow(2, attempt - 1)
          await this.delay(delay)
          console.warn(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`)
        }
      }
    }
    
    throw lastError
  }

  /**
   * Execute with timeout
   */
  static async withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number = 10000
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })
    
    return Promise.race([fn(), timeoutPromise])
  }

  /**
   * Execute with fallback
   */
  static async withFallback<T>(
    fn: () => Promise<T>,
    fallbackFn: () => T | Promise<T>
  ): Promise<T> {
    try {
      return await fn()
    } catch {
      console.warn('Primary operation failed, using fallback')
      return fallbackFn()
    }
  }

  /**
   * Delay execution
   */
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Classify error type from native Error
 */
export function classifyError(error: Error): ErrorType {
  const message = error.message.toLowerCase()
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return ErrorType.NETWORK
  }
  
  if (message.includes('file') || message.includes('read') || message.includes('write') || message.includes('enoent')) {
    return ErrorType.FILE
  }
  
  if (message.includes('parse') || message.includes('json') || message.includes('syntax')) {
    return ErrorType.PARSE
  }
  
  if (message.includes('permission') || message.includes('access') || message.includes('denied')) {
    return ErrorType.PERMISSION
  }
  
  if (message.includes('not found') || message.includes('404') || message.includes('missing')) {
    return ErrorType.NOT_FOUND
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return ErrorType.TIMEOUT
  }
  
  return ErrorType.UNKNOWN
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: Error | AppError, language: 'ar' | 'en'): string {
  const type = 'type' in error ? error.type : classifyError(error)
  
  const messages: Record<ErrorType, { ar: string; en: string }> = {
    [ErrorType.NETWORK]: {
      ar: 'فشل الاتصال بالشبكة. تحقق من اتصالك بالإنترنت.',
      en: 'Network connection failed. Check your internet connection.'
    },
    [ErrorType.FILE]: {
      ar: 'فشل قراءة أو كتابة الملف. تأكد من وجود الملف وصلاحيات الوصول.',
      en: 'Failed to read or write file. Make sure the file exists and you have access.'
    },
    [ErrorType.PARSE]: {
      ar: 'فشل تحليل البيانات. الملف قد يكون تالفًا.',
      en: 'Failed to parse data. The file might be corrupted.'
    },
    [ErrorType.PERMISSION]: {
      ar: 'ليس لديك صلاحية للوصول إلى هذا المورد.',
      en: 'You don\'t have permission to access this resource.'
    },
    [ErrorType.NOT_FOUND]: {
      ar: 'المورد المطلوب غير موجود.',
      en: 'The requested resource was not found.'
    },
    [ErrorType.TIMEOUT]: {
      ar: 'انتهت مهلة العملية. حاول مرة أخرى.',
      en: 'Operation timed out. Please try again.'
    },
    [ErrorType.UNKNOWN]: {
      ar: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      en: 'An unexpected error occurred. Please try again.'
    }
  }
  
  return messages[type][language]
}

/**
 * Log error with context (for debugging)
 */
export function logError(error: Error | AppError, context?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    message: error.message,
    type: 'type' in error ? error.type : classifyError(error),
    context,
    stack: error instanceof Error ? error.stack : undefined
  }
  
  console.error('[BookReader Error]', errorInfo)
  
  // In production, you might want to send this to a logging service
  // sendToLoggingService(errorInfo)
}
