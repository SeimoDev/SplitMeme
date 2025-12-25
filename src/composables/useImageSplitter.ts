import { ref, computed } from 'vue'
import type { ImageInfo, SplitSettings, SplitResult, GridCell, ExportFormat } from '../types'
import { loadImage, getMimeType, getFileExtension } from '../utils/canvas'

export function useImageSplitter() {
  const isProcessing = ref(false)
  const progress = ref(0)
  const results = ref<SplitResult[]>([])
  const error = ref<string | null>(null)

  /**
   * Split image into parts based on grid cells
   */
  const splitImage = async (
    imageInfo: ImageInfo,
    cells: GridCell[],
    format: ExportFormat,
    quality: number
  ): Promise<SplitResult[]> => {
    isProcessing.value = true
    progress.value = 0
    results.value = []
    error.value = null

    try {
      const img = await loadImage(imageInfo.url)
      const splitResults: SplitResult[] = []
      const totalCells = cells.length

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        
        // Create canvas for this cell
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(cell.width)
        canvas.height = Math.round(cell.height)

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Cannot get canvas context')

        // Draw the portion of the image
        ctx.drawImage(
          img,
          cell.x,
          cell.y,
          cell.width,
          cell.height,
          0,
          0,
          canvas.width,
          canvas.height
        )

        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b)
              else reject(new Error('Failed to create blob'))
            },
            getMimeType(format),
            quality
          )
        })

        // Create data URL for preview
        const dataUrl = canvas.toDataURL(getMimeType(format), quality)

        splitResults.push({
          row: cell.row,
          col: cell.col,
          blob,
          dataUrl,
          width: canvas.width,
          height: canvas.height
        })

        // Update progress
        progress.value = Math.round(((i + 1) / totalCells) * 100)
      }

      results.value = splitResults
      return splitResults
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to split image'
      error.value = message
      throw new Error(message)
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Generate filename for a split result
   */
  const generateFilename = (
    result: SplitResult,
    format: ExportFormat,
    baseName: string = 'image'
  ): string => {
    const ext = getFileExtension(format)
    return `${baseName}_${result.row + 1}-${result.col + 1}.${ext}`
  }

  /**
   * Clear results
   */
  const clearResults = () => {
    results.value = []
    progress.value = 0
    error.value = null
  }

  return {
    isProcessing,
    progress,
    results,
    error,
    splitImage,
    generateFilename,
    clearResults
  }
}

