import type { GridCell, ExportFormat } from '../types'

/**
 * Load an image from URL and return HTMLImageElement
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Calculate grid cells based on split settings
 */
export function calculateGridCells(
  imageWidth: number,
  imageHeight: number,
  rows: number,
  cols: number
): GridCell[] {
  const cells: GridCell[] = []
  const cellWidth = imageWidth / cols
  const cellHeight = imageHeight / rows

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        row,
        col,
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight
      })
    }
  }

  return cells
}

/**
 * Calculate grid cells based on custom dimensions
 */
export function calculateCustomGridCells(
  imageWidth: number,
  imageHeight: number,
  cellWidth: number,
  cellHeight: number
): GridCell[] {
  const cells: GridCell[] = []
  const cols = Math.ceil(imageWidth / cellWidth)
  const rows = Math.ceil(imageHeight / cellHeight)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellWidth
      const y = row * cellHeight
      const w = Math.min(cellWidth, imageWidth - x)
      const h = Math.min(cellHeight, imageHeight - y)

      if (w > 0 && h > 0) {
        cells.push({
          row,
          col,
          x,
          y,
          width: w,
          height: h
        })
      }
    }
  }

  return cells
}

/**
 * Draw grid lines on canvas for preview
 */
export function drawGridPreview(
  ctx: CanvasRenderingContext2D,
  cells: GridCell[],
  scale: number,
  strokeColor: string = '#00d9a5'
) {
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])

  cells.forEach((cell) => {
    ctx.strokeRect(
      cell.x * scale,
      cell.y * scale,
      cell.width * scale,
      cell.height * scale
    )
  })

  ctx.setLineDash([])
}

/**
 * Get MIME type from export format
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
  }
  return mimeTypes[format]
}

/**
 * Get file extension from export format
 */
export function getFileExtension(format: ExportFormat): string {
  return format === 'jpeg' ? 'jpg' : format
}

/**
 * Extract a portion of an image as a Blob
 */
export async function extractImagePortion(
  img: HTMLImageElement,
  cell: GridCell,
  format: ExportFormat,
  quality: number
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = cell.width
  canvas.height = cell.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Cannot get canvas context')

  ctx.drawImage(
    img,
    cell.x,
    cell.y,
    cell.width,
    cell.height,
    0,
    0,
    cell.width,
    cell.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to create blob'))
      },
      getMimeType(format),
      quality
    )
  })
}

