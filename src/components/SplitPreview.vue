<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { ImageInfo, SplitSettings, GridCell } from '../types'
import { calculateGridCells, calculateCustomGridCells, loadImage } from '../utils/canvas'

const props = defineProps<{
  imageInfo: ImageInfo
  settings: SplitSettings
}>()

const emit = defineEmits<{
  'cells-updated': [cells: GridCell[]]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const loadedImage = ref<HTMLImageElement | null>(null)
const scale = ref(1)
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// Calculate grid cells based on settings
const gridCells = computed(() => {
  const { width, height } = props.imageInfo
  const { mode, rows, cols, customWidth, customHeight } = props.settings

  if (mode === 'uniform') {
    return calculateGridCells(width, height, rows, cols)
  } else {
    return calculateCustomGridCells(width, height, customWidth, customHeight)
  }
})

// Watch for grid cell changes and emit
watch(gridCells, (cells) => {
  emit('cells-updated', cells)
}, { immediate: true })

// Load the image when imageInfo changes
watch(() => props.imageInfo, async (info) => {
  if (info) {
    loadedImage.value = await loadImage(info.url)
    updateCanvasSize()
    draw()
  }
}, { immediate: true })

// Redraw when settings change
watch(() => props.settings, () => {
  draw()
}, { deep: true })

// Calculate canvas size to fit container while maintaining aspect ratio
const updateCanvasSize = () => {
  if (!containerRef.value || !props.imageInfo) return

  const containerWidth = containerRef.value.clientWidth - 32 // padding
  const maxHeight = 400

  const imageAspect = props.imageInfo.width / props.imageInfo.height
  
  let width = containerWidth
  let height = width / imageAspect

  if (height > maxHeight) {
    height = maxHeight
    width = height * imageAspect
  }

  canvasWidth.value = width
  canvasHeight.value = height
  scale.value = width / props.imageInfo.width
}

// Draw image and grid on canvas
const draw = () => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  const img = loadedImage.value

  if (!canvas || !ctx || !img) return

  // Set canvas size
  canvas.width = canvasWidth.value
  canvas.height = canvasHeight.value

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  // Draw grid overlay
  drawGrid(ctx)
}

// Draw grid lines
const drawGrid = (ctx: CanvasRenderingContext2D) => {
  const cells = gridCells.value
  
  ctx.strokeStyle = '#00d9a5'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])

  cells.forEach((cell) => {
    ctx.strokeRect(
      cell.x * scale.value,
      cell.y * scale.value,
      cell.width * scale.value,
      cell.height * scale.value
    )
  })

  ctx.setLineDash([])

  // Draw cell indices
  ctx.font = `${Math.max(12, 14 * scale.value)}px 'DM Sans', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  cells.forEach((cell) => {
    const centerX = (cell.x + cell.width / 2) * scale.value
    const centerY = (cell.y + cell.height / 2) * scale.value
    const label = `${cell.row + 1}-${cell.col + 1}`

    // Background for label
    const metrics = ctx.measureText(label)
    const padding = 6
    const bgWidth = metrics.width + padding * 2
    const bgHeight = 20

    ctx.fillStyle = 'rgba(0, 217, 165, 0.9)'
    ctx.beginPath()
    ctx.roundRect(
      centerX - bgWidth / 2,
      centerY - bgHeight / 2,
      bgWidth,
      bgHeight,
      4
    )
    ctx.fill()

    // Label text
    ctx.fillStyle = '#0f0f1a'
    ctx.fillText(label, centerX, centerY)
  })
}

// Handle resize
const handleResize = () => {
  updateCanvasSize()
  draw()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  updateCanvasSize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose grid cells for parent component
defineExpose({ gridCells })
</script>

<template>
  <div ref="containerRef" class="split-preview">
    <div class="canvas-container">
      <canvas 
        ref="canvasRef"
        class="preview-canvas"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      ></canvas>
    </div>
    
    <div class="preview-footer">
      <span class="preview-hint">
        <span class="hint-icon">ℹ️</span>
        Grid preview shows how your image will be split
      </span>
    </div>
  </div>
</template>

<style scoped>
.split-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  min-height: 300px;
}

.preview-canvas {
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}

.preview-footer {
  display: flex;
  justify-content: center;
}

.preview-hint {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.hint-icon {
  font-size: 1rem;
}
</style>

