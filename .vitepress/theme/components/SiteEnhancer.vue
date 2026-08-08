<!--
 * SiteEnhancer — 站点增强组件
 *
 * 功能：阅读进度条、回到顶部按钮、侧边栏高亮、图片预览、时间线动画
 * 样式：_components.css（进度条、按钮）、_layout.css（侧边栏高亮）
 *
 * 改这里：
 *   - 回顶按钮显示阈值 → SCROLL_SHOW_THRESHOLD（当前 360px）
 *   - 时间线动画延迟   → TIMELINE_OBSERVE_DELAY / TIMELINE_STAGGER_DELAY
-->
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

/* ── 常量 ─────────────────────────────────────────────────── */
const SCROLL_SHOW_THRESHOLD = 360   // 滚动超过此距离时显示回顶按钮（px）
const TIMELINE_OBSERVE_DELAY = 100  // 时间线初始观察延迟（ms）
const TIMELINE_STAGGER_DELAY = 80   // 时间线卡片入场错开延迟（ms/张）

/* ── 响应式状态 ───────────────────────────────────────────── */
const progress = ref(0)        // 阅读进度百分比（0-100）
const showTools = ref(false)   // 是否显示回到顶部按钮
const isHome = ref(false)      // 当前是否为首页
const route = useRoute()

/* ── 侧边栏高亮（路径匹配 → 添加 sidebar-active-highlight 类） */
const HIGHLIGHT_CLASS = 'sidebar-active-highlight'

/** 判断当前是否为首页，供阅读进度和回顶工具显隐使用 */
function isHomePage() {
  const path = route.path
  return path === '/' || path === '/index.html' || path.endsWith('/index')
}

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

/* ── 滚动状态（rAF 节流，每帧最多执行一次） ──────────────── */
let ticking = false

/** 更新阅读进度与工具栏显隐状态 */
function updateReadingState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0
  // 滚动超过阈值时显示回顶按钮（首页也显示）
  showTools.value = !isHome.value && scrollTop > SCROLL_SHOW_THRESHOLD
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

const PREVIEW_IMAGE_CLASS = 'site-preview-image'
let imageLightbox = null

/** 标记当前页面中的非链接正文图片，交由 PhotoSwipe Gallery 接管 */
function markPreviewImages() {
  document.querySelectorAll('.vp-doc img, .VPPage img').forEach(image => {
    image.classList.toggle(PREVIEW_IMAGE_CLASS, !image.closest('a'))
  })
}

/** 创建 PhotoSwipe 官方 Gallery，缩放、拖拽和边界均由组件处理 */
function createImageLightbox() {
  imageLightbox = new PhotoSwipeLightbox({
    gallery: document.body,
    children: '.site-preview-image',
    pswpModule: () => import('photoswipe'),
    wheelToZoom: true,
    allowPanToNext: false,
    closeOnVerticalDrag: false,
    pinchToClose: false,
  })
  imageLightbox.addFilter('domItemData', (itemData, image) => {
    const rect = image.getBoundingClientRect()
    const src = image.currentSrc || image.src
    return {
      ...itemData,
      src,
      msrc: src,
      alt: image.alt || '',
      width: Math.max(1, image.naturalWidth || Math.round(rect.width)),
      height: Math.max(1, image.naturalHeight || Math.round(rect.height)),
    }
  })
  imageLightbox.init()
}

/* ── 时间线入场动画（IntersectionObserver 触发） ──────────── */
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
      el.style.transitionDelay = `${i * TIMELINE_STAGGER_DELAY}ms`
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
  markPreviewImages()
  createImageLightbox()
  isHome.value = isHomePage()
  nextTick(updateReadingState)
  nextTick(highlightActiveSidebar)
  setTimeout(observeTimelineItems, TIMELINE_OBSERVE_DELAY)
  setupTimelineDomObserver()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('scroll', requestTimelineScrollCheck, { passive: true })
  window.addEventListener('resize', requestUpdate)
})

// 路由切换时重新计算页面类型、状态与高亮
watch(
  () => route.path,
  () => {
    imageLightbox?.pswp?.close()
    isHome.value = isHomePage()
    nextTick(updateReadingState)
    nextTick(highlightActiveSidebar)
    nextTick(markPreviewImages)
    setTimeout(observeTimelineItems, TIMELINE_OBSERVE_DELAY)
  }
)

onUnmounted(() => {
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('scroll', requestTimelineScrollCheck)
  window.removeEventListener('resize', requestUpdate)
  imageLightbox?.destroy()
  imageLightbox = null
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

</template>
