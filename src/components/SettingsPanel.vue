<script setup lang="ts">
import { computed } from 'vue'
import type { ImageInfo, SplitSettings, SplitMode, ExportFormat } from '../types'

const props = defineProps<{
  settings: SplitSettings
  imageInfo: ImageInfo | null
}>()

const emit = defineEmits<{
  'update:settings': [settings: SplitSettings]
}>()

const updateSetting = <K extends keyof SplitSettings>(
  key: K,
  value: SplitSettings[K]
) => {
  emit('update:settings', { ...props.settings, [key]: value })
}

const splitModes: { value: SplitMode; label: string; icon: string }[] = [
  { value: 'uniform', label: 'Uniform Grid', icon: '⊞' },
  { value: 'custom', label: 'Custom Size', icon: '⊟' }
]

const exportFormats: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPG' },
  { value: 'webp', label: 'WebP' }
]

// Calculate grid info based on current settings
const gridInfo = computed(() => {
  if (!props.imageInfo) return null

  const { width, height } = props.imageInfo
  const { mode, rows, cols, customWidth, customHeight } = props.settings

  if (mode === 'uniform') {
    return {
      rows,
      cols,
      totalParts: rows * cols,
      partWidth: Math.round(width / cols),
      partHeight: Math.round(height / rows)
    }
  } else {
    const calcCols = Math.ceil(width / customWidth)
    const calcRows = Math.ceil(height / customHeight)
    return {
      rows: calcRows,
      cols: calcCols,
      totalParts: calcRows * calcCols,
      partWidth: customWidth,
      partHeight: customHeight
    }
  }
})

// Validation
const isValid = computed(() => {
  if (!props.imageInfo) return false
  const { mode, rows, cols, customWidth, customHeight } = props.settings
  
  if (mode === 'uniform') {
    return rows >= 1 && rows <= 50 && cols >= 1 && cols <= 50
  } else {
    return customWidth >= 10 && customHeight >= 10
  }
})

defineExpose({ isValid, gridInfo })
</script>

<template>
  <div class="settings-panel">
    <h2 class="panel-title">Settings</h2>

    <template v-if="imageInfo">
      <!-- Image Info -->
      <div class="image-summary">
        <div class="summary-item">
          <span class="summary-label">Image Size</span>
          <span class="summary-value">{{ imageInfo.width }} × {{ imageInfo.height }}</span>
        </div>
      </div>

      <!-- Split Mode -->
      <div class="section">
        <label class="section-label">Split Mode</label>
        <div class="mode-tabs">
          <button
            v-for="mode in splitModes"
            :key="mode.value"
            class="mode-tab"
            :class="{ active: settings.mode === mode.value }"
            @click="updateSetting('mode', mode.value)"
          >
            <span class="mode-icon">{{ mode.icon }}</span>
            <span class="mode-label">{{ mode.label }}</span>
          </button>
        </div>
      </div>

      <!-- Uniform Mode Settings -->
      <div v-if="settings.mode === 'uniform'" class="section">
        <label class="section-label">Grid Size</label>
        <div class="form-row">
          <div class="form-group">
            <label>Rows</label>
            <input
              type="number"
              :value="settings.rows"
              min="1"
              max="50"
              @input="updateSetting('rows', Math.max(1, Math.min(50, parseInt(($event.target as HTMLInputElement).value) || 1)))"
            />
          </div>
          <div class="form-group">
            <label>Columns</label>
            <input
              type="number"
              :value="settings.cols"
              min="1"
              max="50"
              @input="updateSetting('cols', Math.max(1, Math.min(50, parseInt(($event.target as HTMLInputElement).value) || 1)))"
            />
          </div>
        </div>
      </div>

      <!-- Custom Mode Settings -->
      <div v-else class="section">
        <label class="section-label">Tile Size (px)</label>
        <div class="form-row">
          <div class="form-group">
            <label>Width</label>
            <input
              type="number"
              :value="settings.customWidth"
              min="10"
              :max="imageInfo.width"
              @input="updateSetting('customWidth', Math.max(10, parseInt(($event.target as HTMLInputElement).value) || 10))"
            />
          </div>
          <div class="form-group">
            <label>Height</label>
            <input
              type="number"
              :value="settings.customHeight"
              min="10"
              :max="imageInfo.height"
              @input="updateSetting('customHeight', Math.max(10, parseInt(($event.target as HTMLInputElement).value) || 10))"
            />
          </div>
        </div>
      </div>

      <!-- Grid Preview Info -->
      <div v-if="gridInfo" class="section">
        <div class="grid-info">
          <div class="info-item">
            <span class="info-value text-accent">{{ gridInfo.totalParts }}</span>
            <span class="info-label">Total Parts</span>
          </div>
          <div class="info-item">
            <span class="info-value">{{ gridInfo.rows }} × {{ gridInfo.cols }}</span>
            <span class="info-label">Grid</span>
          </div>
          <div class="info-item">
            <span class="info-value">{{ gridInfo.partWidth }} × {{ gridInfo.partHeight }}</span>
            <span class="info-label">Part Size</span>
          </div>
        </div>
      </div>

      <!-- Export Format -->
      <div class="section">
        <label class="section-label">Export Format</label>
        <div class="format-options">
          <button
            v-for="format in exportFormats"
            :key="format.value"
            class="format-btn"
            :class="{ active: settings.format === format.value }"
            @click="updateSetting('format', format.value)"
          >
            {{ format.label }}
          </button>
        </div>
      </div>

      <!-- Quality Slider (for jpeg/webp) -->
      <div v-if="settings.format !== 'png'" class="section">
        <label class="section-label">
          Quality: {{ Math.round(settings.quality * 100) }}%
        </label>
        <input
          type="range"
          :value="settings.quality"
          min="0.1"
          max="1"
          step="0.05"
          @input="updateSetting('quality', parseFloat(($event.target as HTMLInputElement).value))"
        />
      </div>
    </template>

    <!-- No Image State -->
    <template v-else>
      <div class="empty-state">
        <div class="empty-icon">📷</div>
        <p>Upload an image to configure split settings</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.panel-title {
  font-size: 1.25rem;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

/* Image Summary */
.image-summary {
  padding: var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.summary-value {
  font-weight: 600;
  font-size: 0.9375rem;
}

/* Sections */
.section {
  padding-top: var(--spacing-md);
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

/* Mode Tabs */
.mode-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.mode-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  color: var(--color-text-secondary);
}

.mode-tab:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-secondary);
}

.mode-tab.active {
  border-color: var(--color-accent);
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.mode-icon {
  font-size: 1.5rem;
}

.mode-label {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Grid Info */
.grid-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  text-align: center;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 600;
}

.info-label {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Format Options */
.format-options {
  display: flex;
  gap: var(--spacing-sm);
}

.format-btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.format-btn:hover {
  border-color: var(--color-border-hover);
}

.format-btn.active {
  border-color: var(--color-accent);
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.9375rem;
}
</style>

