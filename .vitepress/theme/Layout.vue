<!--
 * Layout.vue — 自定义主题布局入口
 *
 * 功能：欢迎遮罩状态管理、原生主题切换、路由过渡动画、图片懒加载
 *
 * 改这里：
 *   - 遮罩退出动画时长 → 搜索 "900"（overlayState.close 中的 setTimeout）
 *   - 路由过渡动画样式 → _layout.css 中的 .route-leave / .route-enter
 *   - 欢迎页按钮样式  → 本文件末尾 <style> 中的 .hero-overlay-toggle
-->
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

/* ── 欢迎遮罩共享状态（provide/inject 模式） ────────────────
 *  状态流转：closed → open() → showing → close() → exiting → closed
 *  改这里：
 *    - 退出动画时长 → close() 中的 900ms（需与 WelcomeOverlay.vue 的 0.9s 一致）
 *    - 遮罩背景色   → WelcomeOverlay.vue 的 .welcome-overlay + index.html 的 welcome-blocking
 * ─────────────────────────────────────────────────────────── */
const overlayState = reactive({
  show: false,        // 是否显示遮罩
  exiting: false,     // 是否正在执行退出动画
  hasShownOnce: false,// 本次会话是否已展示过（防止重复自动展示）

  /** 打开遮罩 */
  open() {
    if (this.show) return
    this.hasShownOnce = true
    this.exiting = false
    this.show = true
  },

  /**
   * 关闭遮罩 — 先标记 exiting 状态触发淡出动画，动画结束后隐藏
   *
   * ⚠️ setTimeout 时长必须与 WelcomeOverlay.vue 中
   *    .welcome-overlay.is-exiting 的 animation-duration 一致（当前 900ms）
   */
  close() {
    if (!this.show || this.exiting) return
    this.exiting = true
    // 立即移除遮挡类，让首页在遮罩淡出动画下方提前渲染
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('welcome-blocking')
    }
    // 立即解锁滚动（不等退出动画结束），避免遮罩淡出期间页面无法滚动
    if (this._unlockScroll) this._unlockScroll()
    // ← 修改这里的 900 可调整退出动画等待时间
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

/* ── 主题切换 ─────────────────────────────────────────────── */
provide('toggle-appearance', () => {
  isDark.value = !isDark.value
})

/* ── 欢迎遮罩关闭回调（兜底移除 welcome-blocking 类） ──────── */
function onWelcomeDismissed() {
  document.documentElement.classList.remove('welcome-blocking')
}

/* ── 路由过渡动画（两阶段：淡出 → 淡入） ────────────────────
 *  动画样式在 _layout.css 中，改 0.2s 调动画时长
 * ─────────────────────────────────────────────────────────── */
function getTransitionTarget() {
  return document.querySelector('.VPDoc') || document.querySelector('.VPPage')
}

function onBeforeRouteChange() {
  const target = getTransitionTarget()
  if (!target) return
  target.classList.remove('route-enter')
  target.classList.add('route-leave')
}

function onAfterRouteChanged() {
  nextTick(() => {
    const target = getTransitionTarget()
    if (!target) return
    target.classList.remove('route-leave')
    target.classList.add('route-enter')
    const cleanup = () => {
      target.classList.remove('route-enter')
      target.removeEventListener('animationend', cleanup)
    }
    target.addEventListener('animationend', cleanup)
    setTimeout(cleanup, 300)
  })
}

/* ── 全局图片懒加载（MutationObserver 监听新增图片） ──────── */
function applyLazyLoading(root) {
  root.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy')
  })
}

let observer

onMounted(() => {
  // 注册路由过渡钩子
  router.onBeforeRouteChange = onBeforeRouteChange
  router.onAfterRouteChanged = onAfterRouteChanged

  // 初始扫描 + MutationObserver 监听新增节点
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
 *  改 6px / 4px / 2px 调间距，增大 = 更多留白，减小 = 更紧凑
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

/* ── 首页遮罩期间隐藏布局 ── */
html.welcome-blocking .Layout {
  visibility: hidden;
  pointer-events: none;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.VPSwitchAppearance .check .icon {
  top: -2px;
}

/* ── 欢迎页按钮 — 流光 + 边框脉冲光晕 ───────────────────────
 *  改这里：
 *    - 主色调 → rgba(99, 102, 241)（靛蓝色），替换后需同步修改所有相关色值
 *    - 按钮宽度 → 440px（移动端 340px）
 *    - 圆角 → 20px
 *    - 脉冲周期 → 3s（border-pulse）
 *    - 流光周期 → 6s（shimmer-sweep）
 * ─────────────────────────────────────────────────────────── */
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

/* 暗色模式 — 切换为紫罗兰色调 */
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

/* 移动端 — 缩小按钮尺寸 */
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
