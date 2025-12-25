<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ImageInfo } from '../types'

const emit = defineEmits<{
  load: [info: ImageInfo]
  clear: []
}>()

const props = defineProps<{
  imageInfo: ImageInfo | null
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const acceptedFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

const hasImage = computed(() => props.imageInfo !== null)

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const handleClick = () => {
  if (!hasImage.value) {
    fileInput.value?.click()
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
  // Reset input for re-uploading same file
  target.value = ''
}

const processFile = async (file: File) => {
  error.value = null
  
  if (!acceptedFormats.includes(file.type)) {
    error.value = 'Please upload a valid image file (PNG, JPG, WebP, GIF)'
    return
  }

  isLoading.value = true

  try {
    const url = URL.createObjectURL(file)
    const img = new Image()
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url
    })

    const imageInfo: ImageInfo = {
      file,
      url,
      width: img.width,
      height: img.height,
      name: file.name
    }

    emit('load', imageInfo)
  } catch (err) {
    error.value = 'Failed to load image. Please try another file.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleClear = () => {
  if (props.imageInfo?.url) {
    URL.revokeObjectURL(props.imageInfo.url)
  }
  emit('clear')
  error.value = null
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="image-uploader">
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif"
      class="file-input"
      @change="handleFileChange"
    />

    <div
      class="upload-zone"
      :class="{
        'is-dragging': isDragging,
        'has-image': hasImage,
        'is-loading': isLoading
      }"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @click="handleClick"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading image...</p>
      </div>

      <!-- Image Preview -->
      <div v-else-if="hasImage && imageInfo" class="image-preview">
        <img :src="imageInfo.url" :alt="imageInfo.name" class="preview-image" />
        
        <div class="image-info">
          <div class="info-row">
            <span class="info-label">File:</span>
            <span class="info-value">{{ imageInfo.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Size:</span>
            <span class="info-value">
              {{ imageInfo.width }} × {{ imageInfo.height }} px
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">File size:</span>
            <span class="info-value">{{ formatFileSize(imageInfo.file.size) }}</span>
          </div>
        </div>

        <button class="clear-btn" @click.stop="handleClear" title="Remove image">
          ✕
        </button>
      </div>

      <!-- Upload Placeholder -->
      <div v-else class="upload-placeholder">
        <div class="upload-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3>Drop your image here</h3>
        <p class="text-muted">or click to browse</p>
        <div class="format-hint">
          <span class="format-tag">PNG</span>
          <span class="format-tag">JPG</span>
          <span class="format-tag">WebP</span>
          <span class="format-tag">GIF</span>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.image-uploader {
  width: 100%;
}

.file-input {
  display: none;
}

.upload-zone {
  position: relative;
  min-height: 400px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: var(--color-bg-secondary);
  overflow: hidden;
}

.upload-zone:hover:not(.has-image) {
  border-color: var(--color-accent);
  background: var(--color-accent-muted);
}

.upload-zone.is-dragging {
  border-color: var(--color-accent);
  background: var(--color-accent-muted);
  transform: scale(1.01);
}

.upload-zone.has-image {
  cursor: default;
  border-style: solid;
  border-color: var(--color-border);
}

.upload-zone.is-loading {
  pointer-events: none;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Upload Placeholder */
.upload-placeholder {
  text-align: center;
  padding: var(--spacing-2xl);
}

.upload-icon {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  transition: color var(--transition-fast);
}

.upload-zone:hover .upload-icon {
  color: var(--color-accent);
}

.upload-placeholder h3 {
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.format-hint {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.format-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

/* Image Preview */
.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
}

.preview-image {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
  border-radius: var(--radius-md);
  margin: 0 auto;
  display: block;
}

.image-info {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md) var(--spacing-xl);
}

.info-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.info-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.clear-btn {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: 0.875rem;
}

.error-icon {
  flex-shrink: 0;
}
</style>

