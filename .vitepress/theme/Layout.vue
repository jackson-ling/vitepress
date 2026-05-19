<script setup>
import { ref, reactive, nextTick, onMounted, onUnmounted, provide } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SiteEnhancer from './components/SiteEnhancer.vue'
import HomeExtras from './components/HomeExtras.vue'
import WelcomeOverlay from './components/WelcomeOverlay.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()
const router = useRouter()

/* ── 欢迎遮罩共享状态（组件销毁后仍保留） ─────────────────── */
const overlayState = reactive({
  show: false,
  exiting: false,
  hasShownOnce: false,
  firstDismissDone: false,
  _autoTimer: null,
  open() {
    if (this.show) return
    // 清除待触发的自动展示定时器，防止冲突
    if (this._autoTimer) {
      clearTimeout(this._autoTimer)
      this._autoTimer = null
    }
    this.hasShownOnce = true
    this.exiting = false
    this.show = true
  },
  close() {
    if (!this.show || this.exiting) return
    this.exiting = true
    setTimeout(() => {
      this.show = false
      this.exiting = false
    }, 900)
  },
})

provide('overlayState', overlayState)

// 首次访问时给 body 加标记，用 CSS 隐藏首页内容
if (typeof document !== 'undefined' && !localStorage.getItem('welcome-overlay-shown')) {
  document.body.classList.add('welcome-blocking')
}

provide('toggle-overlay', () => {
  if (overlayState.show) {
    overlayState.close()
  } else {
    overlayState.open()
  }
})

/* ── 主题切换动画（View Transition API + 圆形裁剪） ────────── */
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})

/* ── 欢迎遮罩关闭后首页内容入场动画 ──────────────────────── */
function onWelcomeDismissed() {
  document.body.classList.remove('welcome-blocking')

  if (overlayState.firstDismissDone) {
    // 后续通过按钮关闭遮罩 — 直接展示
    const home = document.querySelector('.VPHome')
    if (home) {
      home.style.visibility = ''
      home.style.opacity = ''
    }
    return
  }

  overlayState.firstDismissDone = true
}

/* ── 侧边栏文章切换过渡动画（两阶段） ────────────────────── */
function onBeforeRouteChange() {
  const doc = document.querySelector('.VPDoc')
  if (!doc) return
  doc.classList.remove('route-enter')
  doc.classList.add('route-leave')
}

function onAfterRouteChanged() {
  nextTick(() => {
    const doc = document.querySelector('.VPDoc')
    if (!doc) return
    doc.classList.remove('route-leave')
    doc.classList.add('route-enter')
    const cleanup = () => {
      doc.classList.remove('route-enter')
      doc.removeEventListener('animationend', cleanup)
    }
    doc.addEventListener('animationend', cleanup)
    setTimeout(cleanup, 300)
  })
}

/* ── 全局图片懒加载 ──────────────────────────────────────────── */
function applyLazyLoading(root) {
  root.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy')
  })
}

let observer

onMounted(() => {
  router.onBeforeRouteChange = onBeforeRouteChange
  router.onAfterRouteChanged = onAfterRouteChanged

  applyLazyLoading(document.body)
  observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue
        if (node.tagName === 'IMG') {
          if (!node.getAttribute('loading')) node.setAttribute('loading', 'lazy')
        } else if (node.querySelectorAll) {
          applyLazyLoading(node)
        }
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  router.onBeforeRouteChange = undefined
  router.onAfterRouteChanged = undefined
  observer?.disconnect()
})
</script>

<template>
  <Layout>
    <template #home-hero-after>
      <HomeExtras />
    </template>
  </Layout>
  <SiteEnhancer />
  <WelcomeOverlay
    blog-name="Jackson 凌"
    @dismiss="onWelcomeDismissed"
  />
</template>

<style>
/* ── custom-block 顶部留白优化 ─────────────────────────────
 *  减小容器内边距 + 消除标题与首个内容元素之间的多余间距
 *  用户习惯在 ::: 容器内使用 > #### 编写内容，
 *  blockquote 和 h2/h3/h4 的默认 margin 会产生大量留白
 * ──────────────────────────────────────────────────────────── */
.custom-block {
  padding-top: 6px !important;
}
.custom-block .custom-block-title {
  margin: 0 !important;
}
.custom-block .custom-block-title + p,
.custom-block .custom-block-title + blockquote {
  margin-top: 4px !important;
}
.custom-block .custom-block-title + h2,
.custom-block .custom-block-title + h3,
.custom-block .custom-block-title + h4 {
  margin-top: 4px !important;
}
/* 容器内 blockquote 顶部间距 — 减小 padding-top 消除与内容的留白 */
.custom-block blockquote {
  margin-top: 4px !important;
  padding-top: 4px !important;
}
.custom-block blockquote h2,
.custom-block blockquote h3,
.custom-block blockquote h4 {
  margin-top: 2px !important;
}

/* ── 首次访问：遮罩遮挡期间隐藏首页内容 ──────────────────── */
body.welcome-blocking .VPHome {
  visibility: hidden;
  pointer-events: none;
}

/* ── View Transition — 主题切换动画 ──────────────────────────── */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.VPSwitchAppearance .check .icon {
  top: -2px;
}
</style>
