<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const progress = ref(0)
const showTools = ref(false)
const isHome = ref(false)
const previewImage = ref(null)
const previewScale = ref(1)
const previewX = ref(0)
const previewY = ref(0)
const route = useRoute()

const HIGHLIGHT_CLASS = 'sidebar-active-highlight'

function normalizePath(path) {
  return decodeURI(path)
    .replace(/[?#].*$/, '')
    .replace(/(?:(^|\/)index)?\.(?:md|html)$/, '$1')
}

function highlightActiveSidebar() {
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
    el.classList.remove(HIGHLIGHT_CLASS)
  })

  const currentPath = normalizePath(window.location.pathname)
  const sidebarLinks = document.querySelectorAll('.VPSidebarItem.is-link a[href]')

  for (const link of sidebarLinks) {
    let linkPath
    try {
      linkPath = normalizePath(new URL(link.href).pathname)
    } catch {
      linkPath = normalizePath(link.getAttribute('href') || '')
    }
    if (linkPath === currentPath) {
      const sidebarItem = link.closest('.VPSidebarItem')
      if (sidebarItem) {
        sidebarItem.classList.add(HIGHLIGHT_CLASS)
      }
      break
    }
  }
}

let ticking = false
const dragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0

const previewImageStyle = computed(() => ({
  transform: `translate(${previewX.value}px, ${previewY.value}px) scale(${previewScale.value})`,
  cursor: previewScale.value > 1 ? (dragging.value ? 'grabbing' : 'grab') : 'default',
}))

function updatePageType() {
  isHome.value = Boolean(document.querySelector('.VPHome'))
}

function updateReadingState() {
  updatePageType()
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0
  showTools.value = !isHome.value && scrollTop > 360
  ticking = false
}

function requestUpdate() {
  if (!ticking) {
    ticking = true
    window.requestAnimationFrame(updateReadingState)
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getPreviewTarget(target) {
  if (!(target instanceof Element)) {
    return null
  }

  const image = target.closest('.vp-doc img, .vp-doc image')
  if (!image || image.closest('a')) {
    return null
  }

  const src = image.currentSrc || image.src || image.getAttribute('href') || image.getAttribute('xlink:href')
  if (!src) {
    return null
  }

  return {
    src,
    alt: image.getAttribute('alt') || '',
  }
}

function openImagePreview(event) {
  const image = getPreviewTarget(event.target)
  if (!image) {
    return
  }

  resetImagePreview()
  previewImage.value = image
}

function closeImagePreview() {
  previewImage.value = null
  resetImagePreview()
}

function resetImagePreview() {
  previewScale.value = 1
  previewX.value = 0
  previewY.value = 0
  dragging.value = false
}

function clampScale(scale) {
  return Math.min(5, Math.max(0.5, Number(scale.toFixed(2))))
}

function zoomImage(delta) {
  previewScale.value = clampScale(previewScale.value + delta)
  if (previewScale.value <= 1) {
    previewX.value = 0
    previewY.value = 0
  }
}

function handlePreviewWheel(event) {
  zoomImage(event.deltaY > 0 ? -0.2 : 0.2)
}

function startImageDrag(event) {
  if (previewScale.value <= 1 || event.button !== 0) {
    return
  }

  dragging.value = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragOriginX = previewX.value
  dragOriginY = previewY.value
  event.currentTarget.setPointerCapture(event.pointerId)
}

function dragImage(event) {
  if (!dragging.value) {
    return
  }

  previewX.value = dragOriginX + event.clientX - dragStartX
  previewY.value = dragOriginY + event.clientY - dragStartY
}

function stopImageDrag(event) {
  if (!dragging.value) {
    return
  }

  dragging.value = false
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeImagePreview()
  }

  if (!previewImage.value) {
    return
  }

  if (event.key === '+' || event.key === '=') {
    zoomImage(0.2)
  }

  if (event.key === '-') {
    zoomImage(-0.2)
  }

  if (event.key === '0') {
    resetImagePreview()
  }
}

onMounted(() => {
  nextTick(updateReadingState)
  nextTick(highlightActiveSidebar)
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('click', openImagePreview)
  window.addEventListener('keydown', handleKeydown)
})

watch(
  () => route.path,
  () => {
    closeImagePreview()
    nextTick(updateReadingState)
    nextTick(highlightActiveSidebar)
  }
)

onUnmounted(() => {
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
  window.removeEventListener('click', openImagePreview)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="!isHome" class="site-progress" aria-hidden="true">
    <span :style="{ width: `${progress}%` }"></span>
  </div>

  <Transition name="reading-tools">
    <div
      v-if="showTools"
      class="reading-tools"
      aria-label="Reading tools"
      :style="{ '--reading-progress': `${progress * 3.6}deg` }"
    >
      <button class="reading-tools__button" type="button" aria-label="回到顶部" title="回到顶部" @click="scrollToTop">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4.25 5.25 11l1.5 1.5L11 8.25V20h2V8.25l4.25 4.25 1.5-1.5L12 4.25Z" />
        </svg>
      </button>
    </div>
  </Transition>

  <Teleport to="body">
    <Transition name="image-preview">
      <div
        v-if="previewImage"
        class="image-preview"
        role="dialog"
        aria-modal="true"
        @click.self="closeImagePreview"
        @wheel.prevent="handlePreviewWheel"
      >
        <div class="image-preview__toolbar" @click.stop>
          <button type="button" aria-label="Zoom out" title="Zoom out" @click="zoomImage(-0.2)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 11h14v2H5z" />
            </svg>
          </button>
          <span>{{ Math.round(previewScale * 100) }}%</span>
          <button type="button" aria-label="Zoom in" title="Zoom in" @click="zoomImage(0.2)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
            </svg>
          </button>
          <button type="button" aria-label="Reset zoom" title="Reset zoom" @click="resetImagePreview">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5V2L7 6.5l5 4.5V7a5 5 0 1 1-4.58 7H5.27A7 7 0 1 0 12 5Z" />
            </svg>
          </button>
        </div>
        <button class="image-preview__close" type="button" aria-label="Close image preview" title="Close image preview" @click="closeImagePreview">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m13.41 12 5.3-5.29-1.42-1.42-5.29 5.3-5.29-5.3-1.42 1.42 5.3 5.29-5.3 5.29 1.42 1.42 5.29-5.3 5.29 5.3 1.42-1.42-5.3-5.29Z" />
          </svg>
        </button>
        <img
          class="image-preview__img"
          :src="previewImage.src"
          :alt="previewImage.alt"
          :style="previewImageStyle"
          draggable="false"
          @click.stop
          @pointerdown.stop="startImageDrag"
          @pointermove.stop="dragImage"
          @pointerup.stop="stopImageDrag"
          @pointercancel.stop="stopImageDrag"
        />
      </div>
    </Transition>
  </Teleport>
</template>
