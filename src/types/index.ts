// Image Split Tool Types

export interface ImageInfo {
  file: File
  url: string
  width: number
  height: number
  name: string
}

export type SplitMode = 'uniform' | 'custom'

export type ExportFormat = 'png' | 'jpeg' | 'webp'

export interface SplitSettings {
  mode: SplitMode
  rows: number
  cols: number
  customWidth: number
  customHeight: number
  format: ExportFormat
  quality: number // 0-1, for jpeg/webp
}

export interface SplitResult {
  row: number
  col: number
  blob: Blob
  dataUrl: string
  width: number
  height: number
}

export interface GridCell {
  row: number
  col: number
  x: number
  y: number
  width: number
  height: number
}

