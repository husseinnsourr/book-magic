// ═══════════════════════════════════════════════════════════════════════════
// useAutoSave - Automatic saving with debounce
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { debounceWithCancel } from '../utils/debounce'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  debounceMs?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

interface UseAutoSaveReturn {
  status: SaveStatus
  lastSaved: Date | null
  error: Error | null
  save: () => Promise<void>
  cancel: () => void
}

/**
 * Hook for auto-saving with debounce
 */
export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
  onError
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  
  const dataRef = useRef(data)
  const onSaveRef = useRef(onSave)
  const onErrorRef = useRef(onError)
  const isMounted = useRef(true)
  
  // Update refs
  useEffect(() => {
    dataRef.current = data
    onSaveRef.current = onSave
    onErrorRef.current = onError
  }, [data, onSave, onError])

  // Track mount status
  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  // Create debounced save function
  const debouncedSave = useRef(
    debounceWithCancel(async () => {
      try {
        if (!isMounted.current) return
        setStatus('saving')
        setError(null)
        
        await onSaveRef.current(dataRef.current)
        
        if (!isMounted.current) return
        setStatus('saved')
        setLastSaved(new Date())
        
        // Reset to idle after showing "saved" for 2 seconds
        setTimeout(() => {
          if (isMounted.current) {
            setStatus((current) => current === 'saved' ? 'idle' : current)
          }
        }, 2000)
      } catch (err) {
        if (!isMounted.current) return
        const error = err as Error
        setStatus('error')
        setError(error)
        onErrorRef.current?.(error)
      }
    }, debounceMs)
  ).current

  // Trigger save when data changes
  useEffect(() => {
    if (enabled) {
      debouncedSave.run()
    }
  }, [data, enabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [])

  // Manual save (immediate)
  const save = useCallback(async () => {
    debouncedSave.cancel()
    
    try {
      if (!isMounted.current) return
      setStatus('saving')
      setError(null)
      
      await onSaveRef.current(dataRef.current)
      
      if (!isMounted.current) return
      setStatus('saved')
      setLastSaved(new Date())
      
      setTimeout(() => {
        if (isMounted.current) {
          setStatus((current) => current === 'saved' ? 'idle' : current)
        }
      }, 2000)
    } catch (err) {
      if (!isMounted.current) return
      const error = err as Error
      setStatus('error')
      setError(error)
      onErrorRef.current?.(error)
    }
  }, [])

  const cancel = useCallback(() => {
    debouncedSave.cancel()
    setStatus('idle')
  }, [])

  return {
    status,
    lastSaved,
    error,
    save,
    cancel
  }
}
