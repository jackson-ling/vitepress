<!--
 * Layout.vue — 自定义主题布局入口
 *
 * 本文件是 VitePress 自定义主题的核心布局组件，继承 DefaultTheme 并扩展以下功能：
 *   1. 欢迎遮罩（WelcomeOverlay）状态管理 — 通过 provide/inject 共享给子组件
 *   2. 主题切换动画 — View Transition API + 圆形裁剪效果
 *   3. 侧边栏文章切换过渡动画 — 两阶段淡出淡入
 *   4. 全局图片懒加载 — MutationObserver 监听新增图片
 *
 * 自定义修改指引：
 *   - 遮罩退出动画时长：搜索 "900"（overlayState.close 中的 setTimeout）
 *   - 主题切换动画时长：搜索 "300"（document.startViewTransition 后的 duration）
 *   - 路由过渡动画：搜索 "route-leave" / "route-enter"（对应 CSS 在 _layout.css）
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

/* ── 欢迎遮罩共享状态 ────────────────────────────────────────
 *  使用 reactive 对象（非 ref）存储遮罩状态，确保 provide 后
 *  子组件通过 inject 获取的是同一引用，状态变更自动同步。
 *
 *  状态流转：closed → open() → showing → close() → exiting → closed
 *
 *  自定义修改：
 *    - 遮罩退出动画时长：修改 close() 中 setTimeout 的 900ms（需与
 *      WelcomeOverlay.vue 中 .overlay-exit 动画的 0.9s 保持一致）
 *    - 遮罩背景色：修改 WelcomeOverlay.vue 中 .welcome-overlay 的 background
 *      以及 index.html 中 html.welcome-blocking 的 background
 * ─────────────────────────────────────────────────────────── */
const overlayState = reactive({
  show: false,        // 是否显示遮罩
  exiting: false,     // 是否正在执行退出动画
  hasShownOnce: false,// 本次会话是否已展示过（防止重复自动展示）
  firstDismissDone: false,
  _autoTimer: null,

  /** 打开遮罩 — 清除待触发的自动展示定时器，防止冲突 */
  open() {
    if (this.show) return
    if (this._autoTimer) {
      clearTimeout(this._autoTimer)
      this._autoTimer = null
    }
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

/* ── 主题切换动画（View Transition API + 圆形裁剪） ──────────
 *  点击主题切换按钮时，以点击位置为圆心扩散/收缩圆形裁剪区域，
 *  实现亮暗主题的丝滑过渡效果。
 *
 *  自定义修改：
 *    - 动画时长 300ms：修改 document.documentElement.animate 的 duration
 *    - 缓动曲线 ease-in：修改 easing 属性
 *    - 浏览器兼容性：enableTransitions() 检查 startViewTransition 支持
 * ─────────────────────────────────────────────────────────── */
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  // 计算圆形裁剪路径：从点击位置扩散到能覆盖整个视口的半径
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

  // ← 修改 duration (300) 可调整主题切换动画时长
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

/* ── 欢迎遮罩关闭回调 ────────────────────────────────────────
 *  由 WelcomeOverlay 的 @dismiss 事件触发。
 *  overlayState.close() 已在关闭时移除 welcome-blocking 类，
 *  此处保留作为兜底（防止异常路径下类名残留）
 * ─────────────────────────────────────────────────────────── */
function onWelcomeDismissed() {
  document.documentElement.classList.remove('welcome-blocking')
}

/* ── 侧边栏文章切换过渡动画（两阶段） ──────────────────────
 *  路由切换时为文档内容添加淡出/淡入动画：
 *    阶段 1：onBeforeRouteChange → 添加 route-leave（旧内容淡出上移）
 *    阶段 2：onAfterRouteChanged → 添加 route-enter（新内容从下方淡入）
 *
 *  动画样式定义在 _layout.css 中（.route-leave / .route-enter）
 *  动画时长 0.2s，如需调整请修改 _layout.css 中的 animation-duration
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

/* ── 全局图片懒加载 ────────────────────────────────────────────
 *  为所有 <img> 标签自动添加 loading="lazy" 属性，
 *  包括初始渲染的图片和后续通过 JS 动态插入的图片（MutationObserver）
 * ─────────────────────────────────────────────────────────── */
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
 *  减小容器内边距 + 消除标题与首个内容元素之间的多余间距
 *  用户习惯在 ::: 容器内使用 > #### 编写内容，
 *  blockquote 和 h2/h3/h4 的默认 margin 会产生大量留白
 *
 *  自定义修改：
 *    - 6px / 4px / 2px 均为间距值，增大可增加留白，减小可紧凑排版
 *    - !important 用于覆盖 VitePress 默认主题的内联样式
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

/* ── View Transition — 主题切换动画 ────────────────────────────
 *  自定义修改：
 *    - z-index 控制新旧图层的堆叠顺序（9999 为新图层在上）
 *    - animation: none 禁用默认淡入淡出，改用 Layout.vue 中的圆形裁剪动画
 * ──────────────────────────────────────────────────────────── */
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

/* ── 欢迎页按钮 — 流光 + 边框脉冲光晕 ───────────────────────
 *  首页 Hero 区域下方的"进入欢迎页"按钮
 *
 *  自定义修改：
 *    - 主色调 rgba(99, 102, 241) — 靛蓝色，替换为其他颜色可改变整体风格
 *    - 440px 按钮宽度（移动端 340px）
 *    - 20px 圆角（border-radius）
 *    - 3s 脉冲周期（border-pulse 动画）
 *    - 6s 流光周期（shimmer-sweep 动画）
 *    - 暗色模式色值在 .dark .hero-overlay-toggle 中单独配置
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
