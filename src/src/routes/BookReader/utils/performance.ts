/**
 * Performance metrics utility for BookReader
 * Tracks FPS and render times.
 */

export const performanceMetrics = {
    fps: 0,
    frames: 0,
    lastTime: performance.now(),
    
    startFPSMonitoring: () => {
        performanceMetrics.frames = 0
        performanceMetrics.lastTime = performance.now()
        requestAnimationFrame(performanceMetrics.loop)
    },
    
    loop: () => {
        const now = performance.now()
        performanceMetrics.frames++
        
        if (now >= performanceMetrics.lastTime + 1000) {
            performanceMetrics.fps = Math.round((performanceMetrics.frames * 1000) / (now - performanceMetrics.lastTime))
            performanceMetrics.frames = 0
            performanceMetrics.lastTime = now
            // Allow checking FPS externally if needed
            // console.debug(`FPS: ${performanceMetrics.fps}`)
        }
        
        requestAnimationFrame(performanceMetrics.loop)
    },

    measureRender: (Label: string, callback: () => void) => {
        const start = performance.now()
        callback()
        const end = performance.now()
        console.debug(`[Perf] ${Label}: ${(end - start).toFixed(2)}ms`)
    }
}
