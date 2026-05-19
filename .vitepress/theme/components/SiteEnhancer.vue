<!--
 * SiteEnhancer — 站点增强组件
 *
 * 功能清单：
 *   1. 阅读进度条（顶部蓝色进度条）
 *   2. 回到顶部按钮（右下角，带 conic-gradient 进度环）
 *   3. 侧边栏当前文章高亮（MutationObserver 风格的路径匹配）
 *   4. 图片预览（点击放大、滚轮缩放、拖拽平移、键盘快捷键）
 *
 * 使用方式：在 Layout.vue 中作为子组件挂载，无需手动注册
 * 依赖样式：_components.css（进度条、按钮、图片预览样式）
 *          _layout.css（sidebar-active-highlight 高亮样式）
-->
<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/* ── 响应式状态 ───────────────────────────────────────────── */
const progress = ref(0)        // 阅读进度百分比（0-100）
const showTools = ref(false)   // 是否显示回到顶部按钮
const isHome = ref(false)      // 当前是否为首页
const previewImage = ref(null) // 预览图片信息 { src, alt }，null 表示关闭
const previewScale = ref(1)    // 图片缩放比例（0.5 ~ 5）
const previewX = ref(0)        // 图片平移 X 偏移量
const previewY = ref(0)        // 图片平移 Y 偏移量
const route = useRoute()

/* ── 侧边栏高亮 ──────────────────────────────────────────────
 *  原理：比对当前 URL 路径与侧边栏所有链接的 href，
 *  匹配到的 .VPSidebarItem 添加 sidebar-active-highlight 类，
 *  该类的样式定义在 _layout.css 中
 * ──────────────────────────────────────────────────────────── */
const HIGHLIGHT_CLASS = 'sidebar-active-highlight'

/** 标准化路径：解码 URL、去除 query/hash、去除 index.html/.md 后缀 */
function normalizePath(path) {
  return decodeURI(path)
    .replace(/[?#].*$/, '')
    .replace(/(?:(^|\/)index)?\.(?:md|html)$/, '$1')
}

/** 高亮当前文章对应的侧边栏项 */
function highlightActiveSidebar() {
  // 清除旧的高亮
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

/* ── 滚动状态（requestAnimationFrame 节流） ───────────────────
 *  ticking 标志位确保每帧最多执行一次 updateReadingState，
 *  避免高频 scroll 事件导致性能问题
 * ──────────────────────────────────────────────────────────── */
let ticking = false

/* ── 图片预览拖拽状态 ──────────────────────────────────────── */
const dragging = ref(false)
let dragStartX = 0     // 拖拽起始鼠标 X
let dragStartY = 0     // 拖拽起始鼠标 Y
let dragOriginX = 0    // 拖拽起始图片平移 X
let dragOriginY = 0    // 拖拽起始图片平移 Y

/** 图片预览的 transform + cursor 样式（计算属性） */
const previewImageStyle = computed(() => ({
  transform: `translate(${previewX.value}px, ${previewY.value}px) scale(${previewScale.value})`,
  cursor: previewScale.value > 1 ? (dragging.value ? 'grabbing' : 'grab') : 'default',
}))

/** 更新阅读进度与工具栏显隐状态 */
function updateReadingState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0
  // 滚动超过 360px 时显示回顶按钮（首页也显示）
  showTools.value = scrollTop > 360
  ticking = false
}

/** rAF 节流 — 每帧最多调用一次 updateReadingState */
function requestUpdate() {
  if (!ticking) {
    ticking = true
    window.requestAnimationFrame(updateReadingState)
  }
}

/** 平滑滚动到顶部 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ── 图片预览逻辑 ──────────────────────────────────────────── */

/**
 * 判断点击目标是否为可预览的文档图片
 * 排除：<a> 包裹的图片（应跳转链接而非预览）
 * 返回：{ src, alt } 或 null
 */
function getPreviewTarget(target) {
  if (!(target instanceof Element)) {
    return null
  }

  const image = target.closest('.vp-doc img, .vp-doc image, .VPPage img, .VPPage image')
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

/** 点击文档图片时打开预览 */
function openImagePreview(event) {
  const image = getPreviewTarget(event.target)
  if (!image) {
    return
  }

  resetImagePreview()
  previewImage.value = image
}

/** 关闭预览并重置所有状态 */
function closeImagePreview() {
  previewImage.value = null
  resetImagePreview()
}

/** 重置缩放与平移状态 */
function resetImagePreview() {
  previewScale.value = 1
  previewX.value = 0
  previewY.value = 0
  dragging.value = false
}

/** 限制缩放范围在 0.5x ~ 5x */
function clampScale(scale) {
  return Math.min(5, Math.max(0.5, Number(scale.toFixed(2))))
}

/** 缩放图片（delta 为正值放大，负值缩小） */
function zoomImage(delta) {
  previewScale.value = clampScale(previewScale.value + delta)
  // 缩放到 1x 以下时自动归位平移
  if (previewScale.value <= 1) {
    previewX.value = 0
    previewY.value = 0
  }
}

/** 滚轮缩放 — deltaY > 0 向下滚动（缩小），反之放大 */
function handlePreviewWheel(event) {
  zoomImage(event.deltaY > 0 ? -0.2 : 0.2)
}

/** 开始拖拽 — 仅在放大状态下生效，捕获指针事件 */
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

/** 拖拽中 — 更新图片平移偏移量 */
function dragImage(event) {
  if (!dragging.value) {
    return
  }

  previewX.value = dragOriginX + event.clientX - dragStartX
  previewY.value = dragOriginY + event.clientY - dragStartY
}

/** 结束拖拽 — 释放指针捕获 */
function stopImageDrag(event) {
  if (!dragging.value) {
    return
  }

  dragging.value = false
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

/** 键盘快捷键：Esc 关闭、+/- 缩放、0 重置 */
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

/* ── 时间线入场动画 ────────────────────────────────────────── */
let timelineObserver = null
let timelineDomObserver = null

function observeTimelineItems() {
  const items = document.querySelectorAll('.site-timeline p:not(:has(strong))')
  if (!items.length) return

  if (!timelineObserver) {
    timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            timelineObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )
  }

  items.forEach((el, i) => {
    if (!el.classList.contains('is-visible')) {
      el.style.transitionDelay = `${i * 80}ms`
      timelineObserver.observe(el)
    }
  })
}

/** 监听 DOM 变化，确保 VitePress 重渲染后时间线卡片仍能正确显示 */
function setupTimelineDomObserver() {
  if (timelineDomObserver) return
  timelineDomObserver = new MutationObserver(() => {
    nextTick(observeTimelineItems)
  })
  timelineDomObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

let timelineScrollTicking = false

/** 滚动时兜底检查，防止 IntersectionObserver 漏掉的卡片 */
function requestTimelineScrollCheck() {
  if (timelineScrollTicking) return
  timelineScrollTicking = true
  requestAnimationFrame(() => {
    observeTimelineItems()
    timelineScrollTicking = false
  })
}

/* ── 生命周期 ──────────────────────────────────────────────── */

onMounted(() => {
  isHome.value = Boolean(document.querySelector('.VPHome'))
  nextTick(updateReadingState)
  nextTick(highlightActiveSidebar)
  setTimeout(observeTimelineItems, 100)
  setupTimelineDomObserver()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('scroll', requestTimelineScrollCheck, { passive: true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('click', openImagePreview)
  window.addEventListener('keydown', handleKeydown)
})

// 路由切换时重新计算页面类型、状态与高亮
watch(
  () => route.path,
  () => {
    closeImagePreview()
    isHome.value = Boolean(document.querySelector('.VPHome'))
    nextTick(updateReadingState)
    nextTick(highlightActiveSidebar)
    setTimeout(observeTimelineItems, 100)
  }
)

onUnmounted(() => {
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('scroll', requestTimelineScrollCheck)
  window.removeEventListener('resize', requestUpdate)
  window.removeEventListener('click', openImagePreview)
  window.removeEventListener('keydown', handleKeydown)
  if (timelineObserver) {
    timelineObserver.disconnect()
    timelineObserver = null
  }
  if (timelineDomObserver) {
    timelineDomObserver.disconnect()
    timelineDomObserver = null
  }
})
</script>

<template>
  <!-- 阅读进度条 — 首页隐藏，aria-hidden 因为纯装饰性 -->
  <div v-if="!isHome" class="site-progress" aria-hidden="true">
    <span :style="{ width: `${progress}%` }"></span>
  </div>

  <!-- 回到顶部按钮 — 滚动超过 360px 后淡入显示
       --reading-progress 用于 conic-gradient 进度环（百分比转角度：progress * 3.6deg） -->
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

  <!-- 图片预览 — Teleport 到 body 避免被父容器裁切
       使用 <Transition> 实现淡入 + 缩放动画（样式在 _components.css） -->
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
        <!-- 工具栏 — 缩放控制 -->
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
        <!-- 关闭按钮 -->
        <button class="image-preview__close" type="button" aria-label="Close image preview" title="Close image preview" @click="closeImagePreview">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m13.41 12 5.3-5.29-1.42-1.42-5.29 5.3-5.29-5.3-1.42 1.42 5.3 5.29-5.3 5.29 1.42 1.42 5.29-5.3 5.29 5.3 1.42-1.42-5.3-5.29Z" />
          </svg>
        </button>
        <!-- 预览图片 — pointer 事件用于拖拽 -->
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
