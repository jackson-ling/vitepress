<script setup>
import { nextTick, onMounted, onUnmounted, provide } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SiteEnhancer from './components/SiteEnhancer.vue'
import HomeExtras from './components/HomeExtras.vue'
import WelcomeOverlay from './components/WelcomeOverlay.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()
const router = useRouter()

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
  nextTick(() => {
    const home = document.querySelector('.VPHome')
    if (!home) return
    home.classList.add('welcome-content-enter')
    const cleanup = () => {
      home.classList.remove('welcome-content-enter')
      home.removeEventListener('animationend', cleanup)
    }
    home.addEventListener('animationend', cleanup)
    setTimeout(cleanup, 1200)
  })
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

onMounted(() => {
  router.onBeforeRouteChange = onBeforeRouteChange
  router.onAfterRouteChanged = onAfterRouteChanged
})

onUnmounted(() => {
  router.onBeforeRouteChange = undefined
  router.onAfterRouteChanged = undefined
})
</script>

<template>
  <Layout>
    <template #home-hero-after>
      <HomeExtras />
    </template>
  </Layout>
  <SiteEnhancer />
  <WelcomeOverlay blog-name="Jackson 凌" @dismiss="onWelcomeDismissed" />
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

/* ── 欢迎遮罩关闭后首页内容入场动画 ─────────────────────────
 *  从下方滑入 + 透明度渐显，模拟 trae.ai 风格的沉浸式入场
 * ──────────────────────────────────────────────────────────── */
@keyframes welcome-content-slide-up {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.VPHome.welcome-content-enter {
  animation: welcome-content-slide-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
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
