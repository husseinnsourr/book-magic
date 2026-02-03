// ═══════════════════════════════════════════════════════════════════════════
// Debounce - Delay function execution
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, wait)
  }
}

/**
 * Creates a debounced function that can be cancelled
 */
export function debounceWithCancel<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): {
  run: (...args: Parameters<T>) => void
  cancel: () => void
  flush: () => void
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: unknown = null

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const flush = () => {
    if (timeoutId && lastArgs) {
      cancel()
      func.apply(lastThis, lastArgs)
    }
  }

  const run = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args
    lastThis = this
    cancel()

    timeoutId = setTimeout(() => {
      func.apply(lastThis, lastArgs!)
      timeoutId = null
    }, wait)
  }

  return { run, cancel, flush }
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastTime >= wait) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastTime = now
      func.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now()
        timeoutId = null
        func.apply(this, args)
      }, wait - (now - lastTime))
    }
  }
}
