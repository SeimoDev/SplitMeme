<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ImageInfo, SplitSettings, GridCell, SplitResult } from './types'
import ImageUploader from './components/ImageUploader.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import SplitPreview from './components/SplitPreview.vue'
import ExportPanel from './components/ExportPanel.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useImageSplitter } from './composables/useImageSplitter'
import { useExporter } from './composables/useExporter'

const { t } = useI18n()

// State
const imageInfo = ref<ImageInfo | null>(null)
const settings = ref<SplitSettings>({
  mode: 'uniform',
  rows: 2,
  cols: 2,
  customWidth: 100,
  customHeight: 100,
  format: 'png',
  quality: 0.9
})
const gridCells = ref<GridCell[]>([])

// Toast notifications
interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}
const toasts = ref<Toast[]>([])
let toastId = 0

const showToast = (type: Toast['type'], message: string) => {
  const id = ++toastId
  toasts.value.push({ id, type, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

// Animation state
const isAppReady = ref(false)
onMounted(() => {
  setTimeout(() => {
    isAppReady.value = true
  }, 100)
})

// Composables
const { 
  isProcessing, 
  progress, 
  results, 
  error: splitError, 
  splitImage, 
  clearResults 
} = useImageSplitter()

const { 
  isExporting, 
  exportProgress, 
  error: exportError, 
  exportAsZip, 
  downloadSingle 
} = useExporter()

// Computed
const error = computed(() => splitError.value || exportError.value)

// Handlers
const handleImageLoad = (info: ImageInfo) => {
  imageInfo.value = info
  // Auto-adjust custom dimensions based on image size
  settings.value.customWidth = Math.round(info.width / 2)
  settings.value.customHeight = Math.round(info.height / 2)
  clearResults()
}

const handleClearImage = () => {
  if (imageInfo.value?.url) {
    URL.revokeObjectURL(imageInfo.value.url)
  }
  imageInfo.value = null
  gridCells.value = []
  clearResults()
}

const handleCellsUpdated = (cells: GridCell[]) => {
  gridCells.value = cells
  // Clear results when grid changes
  if (results.value.length > 0) {
    clearResults()
  }
}

const handleSplit = async () => {
  if (!imageInfo.value || gridCells.value.length === 0) return
  
  try {
    await splitImage(
      imageInfo.value,
      gridCells.value,
      settings.value.format,
      settings.value.quality
    )
    showToast('success', t('toast.splitSuccess', { count: gridCells.value.length }))
  } catch {
    showToast('error', t('toast.splitError'))
  }
}

const handleExport = async () => {
  if (results.value.length === 0) return
  
  try {
    const baseName = imageInfo.value?.name.replace(/\.[^/.]+$/, '') || 'split_image'
    await exportAsZip(results.value, settings.value.format, baseName)
    showToast('success', t('toast.exportSuccess'))
  } catch {
    showToast('error', t('toast.exportError'))
  }
}

const handleDownloadSingle = (result: SplitResult) => {
  const baseName = imageInfo.value?.name.replace(/\.[^/.]+$/, '') || 'image'
  downloadSingle(result, settings.value.format, baseName)
  showToast('info', t('toast.downloadPart', { part: `${result.row + 1}-${result.col + 1}` }))
}

const handleClearResults = () => {
  clearResults()
}
</script>

<template>
  <div class="app" :class="{ 'app-ready': isAppReady }">
    <!-- Toast Notifications -->
    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
      >
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
        </span>
        {{ toast.message }}
      </div>
    </div>

    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="logo">
            <img src="/logo.png" alt="SplitMeme" class="logo-img" />
            {{ t('header.title') }}
          </h1>
          <p class="tagline">{{ t('header.tagline') }}</p>
        </div>
        <div class="header-right">
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <div class="workspace">
          <div class="preview-area card">
            <!-- Upload Zone (when no image) -->
            <ImageUploader 
              v-if="!imageInfo"
              :image-info="imageInfo"
              @load="handleImageLoad"
              @clear="handleClearImage"
            />

            <!-- Split Preview (when image loaded) -->
            <template v-else>
              <div class="preview-header">
                <div class="image-name">
                  <span class="name-icon">🖼️</span>
                  {{ imageInfo.name }}
                </div>
                <button class="btn btn-secondary" @click="handleClearImage">
                  {{ t('uploader.changeImage') }}
                </button>
              </div>
              <SplitPreview 
                :image-info="imageInfo"
                :settings="settings"
                @cells-updated="handleCellsUpdated"
              />
            </template>
          </div>

          <aside class="settings-area card">
            <SettingsPanel 
              :settings="settings"
              :image-info="imageInfo"
              @update:settings="settings = $event"
            />

            <!-- Export Section -->
            <div v-if="imageInfo" class="export-section">
              <ExportPanel 
                :results="results"
                :format="settings.format"
                :is-processing="isProcessing"
                :is-exporting="isExporting"
                :progress="progress"
                :export-progress="exportProgress"
                :error="error"
                @split="handleSplit"
                @export="handleExport"
                @download-single="handleDownloadSingle"
                @clear="handleClearResults"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p class="footer-text">
        {{ t('footer.builtBy') }}
        <a href="https://x.com/seimodev" target="_blank" rel="noopener" class="footer-link">Seimo</a>
        <span class="footer-divider">·</span>
        <a href="https://github.com/SeimoDev/SplitMeme" target="_blank" rel="noopener" class="footer-link">
          <span class="github-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </span>
          GitHub
        </a>
      </p>
      <p class="footer-license">
        {{ t('footer.openSource') }} <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener" class="footer-link">GPL-3.0</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: 
    radial-gradient(ellipse at top left, rgba(0, 217, 165, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(0, 150, 255, 0.05) 0%, transparent 50%),
    var(--color-bg-primary);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.app.app-ready {
  opacity: 1;
  transform: translateY(0);
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  animation: slideInRight 0.3s ease-out;
  font-size: 0.875rem;
}

.toast-success {
  border-color: var(--color-accent);
}

.toast-success .toast-icon {
  color: var(--color-accent);
}

.toast-error {
  border-color: var(--color-danger);
}

.toast-error .toast-icon {
  color: var(--color-danger);
}

.toast-info .toast-icon {
  color: var(--color-text-muted);
}

.toast-icon {
  font-weight: bold;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.header {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  background: rgba(15, 15, 26, 0.8);
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-right {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.tagline {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  padding-left: var(--spacing-md);
  border-left: 1px solid var(--color-border);
}

.main {
  flex: 1;
  padding: var(--spacing-xl);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.workspace {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--spacing-lg);
  align-items: start;
}

.preview-area {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.image-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.name-icon {
  font-size: 1.25rem;
}

.settings-area {
  position: sticky;
  top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.export-section {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.footer {
  padding: var(--spacing-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-accent);
}

.footer-divider {
  color: var(--color-text-muted);
}

.github-icon {
  display: inline-flex;
  align-items: center;
}

.footer-license {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}

/* Responsive */
@media (max-width: 1024px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .settings-area {
    position: static;
  }
}

@media (max-width: 600px) {
  .header-content {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .tagline {
    padding-left: 0;
    border-left: none;
  }

  .main {
    padding: var(--spacing-md);
  }
}
</style>
