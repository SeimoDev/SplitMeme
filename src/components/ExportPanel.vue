<script setup lang="ts">
import { computed } from 'vue'
import type { SplitResult, ExportFormat } from '../types'

const props = defineProps<{
  results: SplitResult[]
  format: ExportFormat
  isProcessing: boolean
  isExporting: boolean
  progress: number
  exportProgress: number
  error: string | null
}>()

const emit = defineEmits<{
  split: []
  export: []
  'download-single': [result: SplitResult]
  clear: []
}>()

const hasResults = computed(() => props.results.length > 0)

const formatLabel = computed(() => {
  const labels: Record<ExportFormat, string> = {
    png: 'PNG',
    jpeg: 'JPG',
    webp: 'WebP'
  }
  return labels[props.format]
})

const totalSize = computed(() => {
  const bytes = props.results.reduce((sum, r) => sum + r.blob.size, 0)
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
})
</script>

<template>
  <div class="export-panel">
    <!-- Actions -->
    <div class="actions">
      <button
        v-if="!hasResults"
        class="btn btn-primary btn-lg btn-full"
        :disabled="isProcessing"
        @click="emit('split')"
      >
        <template v-if="isProcessing">
          <span class="spinner-sm"></span>
          Processing {{ progress }}%
        </template>
        <template v-else>
          <span class="btn-icon">✂️</span>
          Split Image
        </template>
      </button>

      <template v-else>
        <button
          class="btn btn-primary btn-lg btn-full"
          :disabled="isExporting"
          @click="emit('export')"
        >
          <template v-if="isExporting">
            <span class="spinner-sm"></span>
            Exporting {{ exportProgress }}%
          </template>
          <template v-else>
            <span class="btn-icon">📦</span>
            Download ZIP
          </template>
        </button>

        <button
          class="btn btn-secondary btn-full"
          @click="emit('clear')"
        >
          <span class="btn-icon">🔄</span>
          Split Again
        </button>
      </template>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>

    <!-- Results Preview -->
    <div v-if="hasResults" class="results-preview">
      <div class="results-header">
        <h3>Split Results</h3>
        <span class="results-meta">
          {{ results.length }} parts • {{ formatLabel }} • {{ totalSize }}
        </span>
      </div>

      <div class="results-grid">
        <div
          v-for="result in results"
          :key="`${result.row}-${result.col}`"
          class="result-item"
          @click="emit('download-single', result)"
          :title="`Click to download ${result.row + 1}-${result.col + 1}.${format === 'jpeg' ? 'jpg' : format}`"
        >
          <img :src="result.dataUrl" :alt="`Part ${result.row + 1}-${result.col + 1}`" />
          <div class="result-label">
            {{ result.row + 1 }}-{{ result.col + 1 }}
          </div>
          <div class="result-size">
            {{ result.width }}×{{ result.height }}
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="isProcessing || isExporting" class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: (isExporting ? exportProgress : progress) + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.export-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.btn-full {
  width: 100%;
}

.btn-icon {
  font-size: 1.125rem;
}

.spinner-sm {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: 0.8125rem;
}

.error-icon {
  flex-shrink: 0;
}

/* Results Preview */
.results-preview {
  margin-top: var(--spacing-md);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.results-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.results-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: var(--spacing-sm);
  max-height: 300px;
  overflow-y: auto;
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
}

.result-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.result-item:hover {
  border-color: var(--color-accent);
  transform: scale(1.05);
}

.result-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-label {
  position: absolute;
  bottom: 4px;
  left: 4px;
  padding: 2px 6px;
  background: rgba(0, 217, 165, 0.9);
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-bg-primary);
}

.result-size {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px 4px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  font-size: 0.5625rem;
  color: var(--color-text-secondary);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.result-item:hover .result-size {
  opacity: 1;
}

/* Progress Bar */
.progress-bar {
  height: 4px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width var(--transition-fast);
}
</style>

