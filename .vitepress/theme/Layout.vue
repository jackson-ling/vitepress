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
    // 立即移除遮挡类，让首页在遮罩淡出动画下方提前渲染
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('welcome-blocking')
    }
    setTimeout(() => {
      this.show = false
      this.exiting = false
    }, 900)
  },
})

provide('overlayState', overlayState)


function toggleOverlay() {
  if (overlayState.show) {
    overlayState.close()
  } else {
    overlayState.open()
  }
}

provide('toggle-overlay', toggleOverlay)

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

/* ── 欢迎遮罩关闭后展示首页内容 ──────────────────────── */
function onWelcomeDismissed() {
  document.documentElement.classList.remove('welcome-blocking')
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
    <template #home-hero-actions-after>
      <div class="hero-overlay-toggle-wrap">
        <button class="hero-overlay-toggle" @click="toggleOverlay()" title="进入欢迎页">
          <span class="hero-overlay-toggle__shimmer"></span>
          <span class="hero-overlay-toggle__text">进入欢迎页</span>
        </button>
      </div>
    </template>
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

/* ── 首次访问：遮罩遮挡期间隐藏整个布局（导航栏 + 内容区） ── */
html.welcome-blocking .Layout {
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

/* ── 欢迎页按钮 — 流光 + 边框脉冲光晕 ─────────────────────── */
.hero-overlay-toggle-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  animation: hero-fade-up 0.8s 0.65s ease-out both;
}

.hero-overlay-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 440px;
  max-width: 100%;
  border: 1px solid rgba(99, 102, 241, 0.15);
  color: var(--vp-button-alt-text);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(168, 130, 255, 0.06), rgba(99, 102, 241, 0.04));
  backdrop-filter: blur(8px);
  font-weight: 600;
  white-space: nowrap;
  border-radius: 20px;
  padding: 0 24px;
  line-height: 42px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color 0.25s, border-color 0.25s, background 0.25s, box-shadow 0.4s, transform 0.25s;
  animation: border-pulse 3s ease-in-out infinite;
}

/* 流光扫过效果 — 柔和的微光，宽渐变 + 低透明度 */
.hero-overlay-toggle__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(99, 102, 241, 0.04) 38%,
    rgba(168, 130, 255, 0.06) 50%,
    rgba(99, 102, 241, 0.04) 62%,
    transparent 80%
  );
  transform: translateX(-100%);
  animation: shimmer-sweep 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer-sweep {
  0% { transform: translateX(-100%); }
  50%, 100% { transform: translateX(100%); }
}

/* 边框脉冲光晕 — 柔和呼吸，范围更大、强度更低 */
@keyframes border-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
  50% {
    box-shadow: 0 0 20px -4px rgba(99, 102, 241, 0.08);
  }
}

.hero-overlay-toggle:hover {
  border-color: rgba(99, 102, 241, 0.25);
  color: var(--vp-button-alt-hover-text);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 130, 255, 0.1), rgba(99, 102, 241, 0.08));
  box-shadow: 0 0 24px -4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
  animation: none;
}

.hero-overlay-toggle:hover .hero-overlay-toggle__shimmer {
  animation: shimmer-sweep 4s ease-in-out infinite;
}

.hero-overlay-toggle:active {
  border-color: rgba(99, 102, 241, 0.3);
  color: var(--vp-button-alt-active-text);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 130, 255, 0.12), rgba(99, 102, 241, 0.1));
  transition: color 0.1s, border-color 0.1s, background 0.1s;
  transform: scale(0.98);
}

.hero-overlay-toggle__text {
  position: relative;
  z-index: 1;
}

.dark .hero-overlay-toggle {
  animation-name: border-pulse-dark;
  border-color: rgba(168, 130, 255, 0.12);
  background: linear-gradient(135deg, rgba(168, 130, 255, 0.04), rgba(196, 167, 255, 0.05), rgba(168, 130, 255, 0.04));
}

.dark .hero-overlay-toggle:hover {
  border-color: rgba(168, 130, 255, 0.2);
  background: linear-gradient(135deg, rgba(168, 130, 255, 0.08), rgba(196, 167, 255, 0.09), rgba(168, 130, 255, 0.08));
}

@keyframes border-pulse-dark {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(168, 130, 255, 0);
  }
  50% {
    box-shadow: 0 0 20px -4px rgba(168, 130, 255, 0.08);
  }
}

.dark .hero-overlay-toggle__shimmer {
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(168, 130, 255, 0.03) 38%,
    rgba(196, 167, 255, 0.05) 50%,
    rgba(168, 130, 255, 0.03) 62%,
    transparent 80%
  );
}

@media (max-width: 959px) {
  .hero-overlay-toggle-wrap {
    margin-top: 24px;
  }
  .hero-overlay-toggle {
    width: 340px;
    padding: 0 18px;
    line-height: 38px;
    font-size: 13px;
  }
}
</style>
