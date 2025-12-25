import { ref } from 'vue'
import JSZip from 'jszip'
import type { SplitResult, ExportFormat } from '../types'
import { getFileExtension } from '../utils/canvas'

export function useExporter() {
  const isExporting = ref(false)
  const exportProgress = ref(0)
  const error = ref<string | null>(null)

  /**
   * Export split results as a ZIP file
   */
  const exportAsZip = async (
    results: SplitResult[],
    format: ExportFormat,
    baseName: string = 'split_image'
  ): Promise<void> => {
    if (results.length === 0) {
      error.value = 'No images to export'
      return
    }

    isExporting.value = true
    exportProgress.value = 0
    error.value = null

    try {
      const zip = new JSZip()
      const ext = getFileExtension(format)
      const folder = zip.folder(baseName)

      if (!folder) throw new Error('Failed to create zip folder')

      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (!result) continue
        const filename = `${result.row + 1}-${result.col + 1}.${ext}`
        
        folder.file(filename, result.blob)
        
        exportProgress.value = Math.round(((i + 1) / results.length) * 50)
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          exportProgress.value = 50 + Math.round(metadata.percent / 2)
        }
      )

      // Download the zip file
      downloadBlob(zipBlob, `${baseName}.zip`)

      exportProgress.value = 100
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export'
      error.value = message
      throw new Error(message)
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Download a single image
   */
  const downloadSingle = (
    result: SplitResult,
    format: ExportFormat,
    baseName: string = 'image'
  ): void => {
    const ext = getFileExtension(format)
    const filename = `${baseName}_${result.row + 1}-${result.col + 1}.${ext}`
    downloadBlob(result.blob, filename)
  }

  /**
   * Helper function to download a blob
   */
  const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    isExporting,
    exportProgress,
    error,
    exportAsZip,
    downloadSingle
  }
}

