import { useState, useRef } from 'react'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'
import './ImageCropper.css'

interface ImageCropperProps {
  imageSrc: string
  onCancel: () => void
  onSave: (croppedImage: string) => void
  aspectRatio?: number // e.g., 16/9 or 4/1 for banners
  title?: string
  saveLabel?: string
}

export function ImageCropper({ 
  imageSrc, 
  onCancel, 
  onSave, 
  aspectRatio = 5,
  title = "Adjust Cover",
  saveLabel = "Save"
}: ImageCropperProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - startPan.x
    const newY = e.clientY - startPan.y
    setPan({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Generate Cropped Image
  const handleSave = () => {
    if (!imageRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    
    // Output size
    canvas.width = 1200
    canvas.height = 1200 / aspectRatio
    
    // Fill background
    ctx.fillStyle = '#202020'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Screen container props
    const containerW = containerRef.current?.clientWidth || 600
    
    // Center point on canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)
    
    // Apply pan (scaled up to canvas size from screen pixels)
    const screenToCanvasRatio = canvas.width / containerW
    ctx.translate(pan.x * screenToCanvasRatio, pan.y * screenToCanvasRatio)
    
    // Scale (Zoom)
    ctx.scale(zoom, zoom)
    
    // Draw image centered
    const drawW = canvas.width
    const drawH = (img.naturalHeight / img.naturalWidth) * drawW
    
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    
    onSave(canvas.toDataURL('image/jpeg', 0.85))
  }

  return (
    <div className="cropper-overlay">
      <div className="cropper-modal">
        <div className="cropper-header">
          <h3>{title}</h3>
          <button onClick={onCancel} className="icon-btn"><X size={20} /></button>
        </div>
        
        <div 
          className="cropper-viewport" 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt="Crop" 
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            draggable={false}
          />
          <div className="cropper-guide" />
        </div>
        
        <div className="cropper-controls">
          <button onClick={() => setZoom(z => Math.max(1, z - 0.1))}><ZoomOut size={16} /></button>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.1" 
            value={zoom} 
            onChange={(e) => setZoom(Number(e.target.value))} 
            className="zoom-slider"
          />
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))}><ZoomIn size={16} /></button>
          
          <button className="save-btn" onClick={handleSave}>
            <Check size={16} /> {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
