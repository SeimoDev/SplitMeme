<script setup lang="ts">
import { ref } from 'vue'
import type { ImageInfo, SplitSettings } from './types'

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

// Placeholder for future implementation
const handleImageLoad = (info: ImageInfo) => {
  imageInfo.value = info
}

const handleClearImage = () => {
  imageInfo.value = null
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
        <!-- Placeholder for ImageUploader -->
        <div class="workspace">
          <div class="preview-area card">
            <div class="upload-placeholder">
              <div class="upload-icon">📷</div>
              <h3>Drop your image here</h3>
              <p class="text-muted">or click to browse</p>
              <p class="text-sm text-muted mt-md">
                Supports PNG, JPG, WebP, GIF
              </p>
            </div>
          </div>

          <!-- Placeholder for SettingsPanel -->
          <aside class="settings-panel card">
            <h2>Settings</h2>
            <p class="text-muted mt-md">
              Upload an image to configure split settings
            </p>
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
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-lg);
  align-items: start;
}

.preview-area {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  text-align: center;
  padding: var(--spacing-2xl);
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.7;
}

.settings-panel {
  position: sticky;
  top: var(--spacing-lg);
}

.settings-panel h2 {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.footer {
  padding: var(--spacing-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
}

/* Responsive */
@media (max-width: 900px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .settings-panel {
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
