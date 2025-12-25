<script setup lang="ts">
import { ref } from 'vue'
import type { ImageInfo, SplitSettings, GridCell } from './types'
import ImageUploader from './components/ImageUploader.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import SplitPreview from './components/SplitPreview.vue'

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

const handleImageLoad = (info: ImageInfo) => {
  imageInfo.value = info
  // Auto-adjust custom dimensions based on image size
  settings.value.customWidth = Math.round(info.width / 2)
  settings.value.customHeight = Math.round(info.height / 2)
}

const handleClearImage = () => {
  if (imageInfo.value?.url) {
    URL.revokeObjectURL(imageInfo.value.url)
  }
  imageInfo.value = null
  gridCells.value = []
}

const handleCellsUpdated = (cells: GridCell[]) => {
  gridCells.value = cells
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">
          <span class="logo-icon">✂️</span>
          SpiltMeme
        </h1>
        <p class="tagline">Image Splitter Tool</p>
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
                  Change Image
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

            <!-- Export Button Placeholder -->
            <div v-if="imageInfo" class="export-section">
              <button class="btn btn-primary btn-lg btn-export" disabled>
                <span class="btn-icon">📦</span>
                Export {{ gridCells.length }} Parts
              </button>
              <p class="export-hint">Coming in next update...</p>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p class="text-muted text-sm">
        Built with Vue 3 + TypeScript + Vite
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
  gap: var(--spacing-md);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 1.75rem;
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
  grid-template-columns: 1fr 340px;
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

.btn-export {
  width: 100%;
}

.btn-icon {
  font-size: 1.25rem;
}

.export-hint {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: var(--spacing-sm);
}

.footer {
  padding: var(--spacing-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
}

/* Responsive */
@media (max-width: 960px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .settings-area {
    position: static;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .tagline {
    padding-left: 0;
    border-left: none;
  }
}
</style>
