<!--
 * WelcomeOverlay.vue — 首页欢迎遮罩
 *
 * 首次访问首页时展示全屏欢迎卡片，支持：
 *   - 首次自动展示（基于 sessionStorage 记忆）
 *   - 外部控制显示/隐藏（通过 Layout.vue 的 toggleOverlay）
 *   - Enter 键快捷进入
 *   - 滚动锁定（遮罩显示期间禁止页面滚动）
 *   - 进入/退出动画（淡入 + 内容上浮 / 淡出）
 *
 * 使用 inject('overlayState') 获取共享状态（在 Layout.vue 中 provide）
 *
 * 自定义修改指引：
 *   - 博客名：修改 Layout.vue 中 <WelcomeOverlay blog-name="xxx" />
 *   - 副标题：修改 template 中 .welcome-content__subtitle 的文字
 *   - 描述文字：修改 template 中 .welcome-content__desc 的文字
 *   - 背景色：修改 .welcome-overlay 的 background（同步修改 index.html）
 *   - 进入动画时长：修改 .overlay-in 的 animation（当前 0.5s）
 *   - 退出动画时长：修改 .overlay-exit 的 animation（当前 0.9s，需与
 *     Layout.vue 中 overlayState.close() 的 setTimeout 时长一致）
 *   - 内容入场延迟：修改各元素 animation-delay（0.3s ~ 0.6s）
 *   - 按钮样式：修改 .welcome-content__btn 相关属性
-->
<script setup>
import { inject, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const props = defineProps({
  /** 博客名称，显示在欢迎卡片中央 */
  blogName: {
    type: String,
    default: 'Jackson 凌',
  },
})

const emit = defineEmits(['dismiss'])

const route = useRoute()
const state = inject('overlayState')

// 遮罩关闭时触发 dismiss 事件（Layout.vue 中用于兜底移除 welcome-blocking 类）
watch(() => state.show, (val) => {
  if (!val) emit('dismiss')
})

/* ── 滚动锁定 ─────────────────────────────────────────────
 *  遮罩显示期间禁止页面滚动，采用事件阻止方案（非 CSS overflow）：
 *    1. lockScroll() — 记录当前 scrollY，注册 scroll 事件强制回弹
 *    2. unlockScroll() — 移除事件监听，恢复到锁定前的滚动位置
 *
 *  为什么不用 overflow: hidden？
 *    因为 VitePress 的 .VPNav 使用 position: fixed，
 *    overflow: hidden 会导致导航栏宽度计算异常
 * ─────────────────────────────────────────────────────────── */
let savedScrollY = 0
let scrollHandler = null

function lockScroll() {
  savedScrollY = window.scrollY
  scrollHandler = (e) => {
    window.scrollTo(0, savedScrollY)
    e.preventDefault()
  }
  window.addEventListener('scroll', scrollHandler, { passive: false })
}

function unlockScroll() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
  window.scrollTo(0, savedScrollY)
}

watch(() => state.show, (val) => {
  if (val) lockScroll()
  else unlockScroll()
})

/* ── 首页判断与自动展示逻辑 ────────────────────────────────
 *  自动展示条件：
 *    1. 当前页面是首页（/ 或 /index.html 或以 /index 结尾）
 *    2. 本次会话未展示过（state.hasShownOnce）
 *    3. sessionStorage 中无 'welcome-overlay-shown' 标记
 *
 *  sessionStorage 标记在 handleEnter() 中设置，
 *  关闭浏览器标签页后重新打开会再次展示
 * ─────────────────────────────────────────────────────────── */
function isHomePage() {
  const path = route.path
  return path === '/' || path === '/index.html' || path.endsWith('/index')
}

function shouldAutoShow() {
  if (!isHomePage()) return false
  if (state.hasShownOnce) return false
  return !sessionStorage.getItem('welcome-overlay-shown')
}

function markAsShown() {
  sessionStorage.setItem('welcome-overlay-shown', '1')
}

/** 点击"进入博客"按钮或按 Enter 键 */
function handleEnter() {
  markAsShown()
  state.close()
}

/** Enter 键快捷进入（仅在遮罩显示时生效） */
function handleKeydown(e) {
  if (e.key === 'Enter' && state.show) {
    handleEnter()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)

  if (!shouldAutoShow()) return
  state.hasShownOnce = true
  state.show = true
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (state.show) unlockScroll()
})
</script>

<template>
  <div
    v-if="state.show"
    class="welcome-overlay"
    :class="{ 'is-exiting': state.exiting }"
  >
    <!-- 背景装饰层 — 噪点纹理 + 十字准线 + 十字线 -->
    <div class="welcome-bg" aria-hidden="true">
      <div class="welcome-bg__noise"></div>

      <div class="welcome-bg__cross welcome-bg__cross--tl"></div>
      <div class="welcome-bg__cross welcome-bg__cross--tr"></div>
      <div class="welcome-bg__cross welcome-bg__cross--bl"></div>
      <div class="welcome-bg__cross welcome-bg__cross--br"></div>
      <div class="welcome-bg__line welcome-bg__line--h"></div>
      <div class="welcome-bg__line welcome-bg__line--v"></div>
    </div>

    <!-- 内容区 -->
    <div class="welcome-content">
      <div class="welcome-content__tag">BLOG</div>

      <h1 class="welcome-content__title">{{ blogName }}</h1>

      <p class="welcome-content__subtitle">探索技术世界，记录成长足迹</p>

      <div class="welcome-content__divider"></div>

      <p class="welcome-content__desc">
        Java 后端开发 / 微服务架构 / AI 应用
      </p>

      <button class="welcome-content__btn" @click="handleEnter">
        进入博客
      </button>

      <p class="welcome-content__hint">
        <span class="welcome-content__hint-key">Enter</span>
        <span>按键进入</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ── 遮罩层 ────────────────────────────────────────────────
 *  自定义修改：
 *    - #0d1321：深色背景色（同步修改 index.html 中的同名色值）
 *    - z-index: 10000：确保覆盖所有其他元素
 *    - 0.5s：入场动画时长（overlay-in）
 * ─────────────────────────────────────────────────────────── */
.welcome-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1321;
  animation: overlay-in 0.5s ease-out both;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── 退出动画 ──────────────────────────────────────────────
 *  ⚠️ 0.9s 时长必须与 Layout.vue 中 overlayState.close() 的
 *     setTimeout 时长一致，否则遮罩会在动画结束前消失
 *
 *  自定义修改：
 *    - 0.9s：退出动画总时长
 *    - cubic-bezier(0.4, 0, 0.2, 1)：缓动曲线
 *    - 30% 处保持 opacity: 1（延迟开始淡出，让内容先退出）
 * ─────────────────────────────────────────────────────────── */
.welcome-overlay.is-exiting {
  animation: overlay-exit 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes overlay-exit {
  0% { opacity: 1; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}

/* ── 背景层 ──────────────────────────────────────────────── */
.welcome-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* 噪点纹理 — 增加质感，避免纯色死板 */
.welcome-bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
  pointer-events: none;
  animation: noise-in 0.8s 0.2s ease-out both;
}

@keyframes noise-in {
  from { opacity: 0; }
  to { opacity: 0.04; }
}

/* 点阵网格 — 克制，仅作微妙装饰 */
.welcome-bg__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(165, 180, 252, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 10%, transparent 70%);
  opacity: 0;
  animation: grid-in 1.5s 0.3s ease-out forwards;
}

@keyframes grid-in {
  from { opacity: 0; }
  to { opacity: 0.6; }
}

/* ── 内容区 ────────────────────────────────────────────────
 *  自定义修改：
 *    - 0.7s：内容入场动画时长
 *    - 0.1s：内容入场动画延迟（在遮罩淡入后开始）
 *    - 12px：内容上浮距离
 * ─────────────────────────────────────────────────────────── */
.welcome-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 24px;
  animation: content-enter 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.is-exiting .welcome-content {
  animation: content-exit 0.6s cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes content-enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes content-exit {
  to { opacity: 0; transform: translateY(-12px); }
}

/* ── 标签（BLOG） ──────────────────────────────────────────
 *  自定义修改：
 *    - 'BLOG' 文字在 template 中修改
 *    - 14px 字号 / 0.2em 字间距 / 4px 圆角
 *    - 0.3s 入场延迟（与标题错开，形成层次感）
 * ─────────────────────────────────────────────────────────── */
.welcome-content__tag {
  display: inline-block;
  font-family: 'JetBrains Mono', 'Cascadia Code', 'SF Mono', Consolas, monospace;
  font-size: 14px;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.8);
  letter-spacing: 0.2em;
  padding: 6px 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 4px;
  margin-bottom: 28px;
  animation: fade-up 0.5s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ── 博客名 ────────────────────────────────────────────────
 *  自定义修改：
 *    - clamp(42px, 7vw, 56px)：响应式字号（最小 42px，最大 56px）
 *    - #f1f5f9：浅色文字（暗色背景上的高对比度白色）
 *    - -0.02em 字间距：紧凑排列
 * ─────────────────────────────────────────────────────────── */
.welcome-content__title {
  font-size: clamp(42px, 7vw, 56px);
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.15;
  margin: 0 0 18px;
  letter-spacing: -0.02em;
  animation: fade-up 0.6s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ── 副标题 ──────────────────────────────────────────────── */
.welcome-content__subtitle {
  font-size: 20px;
  color: rgba(203, 213, 225, 0.9);
  margin: 0 0 28px;
  font-weight: 500;
  letter-spacing: 0.03em;
  animation: fade-up 0.5s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ── 分割线 ──────────────────────────────────────────────── */
.welcome-content__divider {
  width: 64px;
  height: 1px;
  background: rgba(148, 163, 184, 0.25);
  margin: 0 auto 24px;
  animation: fade-up 0.5s 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ── 描述 ────────────────────────────────────────────────── */
.welcome-content__desc {
  font-size: 16px;
  color: rgba(148, 163, 184, 0.8);
  line-height: 1.6;
  margin: 0 0 40px;
  font-weight: 400;
  letter-spacing: 0.04em;
  animation: fade-up 0.5s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── 按钮 ──────────────────────────────────────────────────
 *  自定义修改：
 *    - 13px 44px：内边距（控制按钮大小）
 *    - 8px：圆角
 *    - rgba(148, 163, 184, 0.25)：边框色（slate 色调）
 *    - hover 时增加边框不透明度 + 淡底 + 光晕
 * ─────────────────────────────────────────────────────────── */
.welcome-content__btn {
  display: inline-flex;
  align-items: center;
  padding: 13px 44px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: transparent;
  color: #e2e8f0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  animation: fade-up 0.5s 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.welcome-content__btn:hover {
  border-color: rgba(148, 163, 184, 0.45);
  background: rgba(148, 163, 184, 0.06);
  box-shadow: 0 0 20px rgba(148, 163, 184, 0.08);
}

.welcome-content__btn:active {
  background: rgba(148, 163, 184, 0.1);
  transform: scale(0.98);
}

/* ── 底部提示 ────────────────────────────────────────────── */
.welcome-content__hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;
  font-size: 12px;
  color: rgba(100, 116, 139, 0.7);
  animation: fade-up 0.5s 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.welcome-content__hint-key {
  font-family: 'JetBrains Mono', 'Cascadia Code', monospace;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(148, 163, 184, 0.06);
  color: rgba(148, 163, 184, 0.7);
  letter-spacing: 0.04em;
}

/* ── Reduced Motion — 无障碍适配 ─────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .welcome-overlay,
  .welcome-content,
  .welcome-content__tag,
  .welcome-content__title,
  .welcome-content__subtitle,
  .welcome-content__divider,
  .welcome-content__desc,
  .welcome-content__btn,
  .welcome-content__hint,
  .welcome-bg__noise,
  .welcome-bg__grid {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .welcome-overlay.is-exiting {
    animation: none !important;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .is-exiting .welcome-content {
    animation: none !important;
  }
}

/* ── 移动端 ──────────────────────────────────────────────── */
@media (max-width: 640px) {
  .welcome-content {
    padding: 16px;
  }

  .welcome-content__title {
    font-size: clamp(32px, 10vw, 44px);
  }

  .welcome-content__subtitle {
    font-size: 17px;
  }

  .welcome-content__desc {
    font-size: 14px;
  }
}
</style>
