<!--
 * WelcomeOverlay — 首页欢迎遮罩
 *
 * 首次访问首页时展示全屏欢迎卡片，
 * 支持外部控制显示/隐藏（toggle 按钮）
 *
 * 使用 inject('overlayState') 获取共享状态，
 * 状态在组件销毁后仍保留（v-if 场景）
-->
<script setup>
import { inject, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const props = defineProps({
  blogName: {
    type: String,
    default: 'Jackson 凌',
  },
})

const emit = defineEmits(['dismiss'])

const route = useRoute()
const state = inject('overlayState')

// 当遮罩关闭时触发 dismiss 事件
watch(() => state.show, (val) => {
  if (!val) emit('dismiss')
})

// 锁定滚动（纯事件阻止，不改 CSS overflow）
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

function isHomePage() {
  const path = route.path
  return path === '/' || path === '/index.html' || path.endsWith('/index')
}

function shouldAutoShow() {
  if (!isHomePage()) return false
  if (state.hasShownOnce) return false
  return !localStorage.getItem('welcome-overlay-shown')
}

function markAsShown() {
  localStorage.setItem('welcome-overlay-shown', '1')
}

function handleEnter() {
  markAsShown()
  state.close()
}

function handleKeydown(e) {
  if (e.key === 'Enter' && state.show) {
    handleEnter()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)

  if (!shouldAutoShow()) return
  state.hasShownOnce = true
  state._autoTimer = setTimeout(() => {
    state._autoTimer = null
    state.show = true
  }, 300)
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
    <!-- 背景装饰 -->
    <div class="welcome-bg" aria-hidden="true">
      <div class="welcome-bg__grid"></div>
      <div class="welcome-bg__orb welcome-bg__orb--1"></div>
      <div class="welcome-bg__orb welcome-bg__orb--2"></div>
      <div class="welcome-bg__orb welcome-bg__orb--3"></div>
      <div class="welcome-bg__particles">
        <span v-for="i in 30" :key="i" class="welcome-bg__particle" :style="`--i:${i}`"></span>
      </div>
    </div>

    <!-- 内容 -->
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
/* ── 遮罩层 ──────────────────────────────────────────────── */
.welcome-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #0f1b3d 0%, #1a2d6b 50%, #12204e 100%);
  animation: overlay-in 0.5s ease-out both;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── 退出动画 ────────────────────────────────────────────── */
.welcome-overlay.is-exiting {
  animation: overlay-exit 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes overlay-exit {
  0% { opacity: 1; transform: scale(1); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: scale(1.04); }
}

/* ── 背景层 ──────────────────────────────────────────────── */
.welcome-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* 点阵网格 */
.welcome-bg__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(165, 180, 252, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 10%, transparent 70%);
  opacity: 0;
  animation: grid-in 1.5s 0.3s ease-out forwards;
}

@keyframes grid-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 光斑 */
.welcome-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0;
  animation: orb-in 1.4s 0.2s ease-out forwards;
}

@keyframes orb-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.welcome-bg__orb--1 {
  top: -10%;
  right: -5%;
  width: 380px;
  height: 380px;
  background: rgba(99, 102, 241, 0.15);
}

.welcome-bg__orb--2 {
  bottom: -12%;
  left: -8%;
  width: 420px;
  height: 420px;
  background: rgba(79, 70, 229, 0.12);
}

.welcome-bg__orb--3 {
  bottom: 10%;
  right: 20%;
  width: 300px;
  height: 300px;
  background: rgba(129, 140, 248, 0.1);
  animation-delay: 0.4s;
}

/* ── 漂浮粒子 ────────────────────────────────────────────── */
.welcome-bg__particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.welcome-bg__particle {
  position: absolute;
  width: calc(2px + var(--i) * 0.3px);
  height: calc(2px + var(--i) * 0.3px);
  background: rgba(165, 180, 252, 0.4);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(165, 180, 252, 0.2);
  opacity: 0;
  animation: particle-float 12s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.4s);
  left: calc(var(--i) * 3.3% + 1%);
  top: calc(var(--i) * 3.2% + 2%);
}

.welcome-bg__particle:nth-child(3n) {
  background: rgba(139, 92, 246, 0.35);
  animation-duration: 15s;
}

.welcome-bg__particle:nth-child(5n) {
  background: rgba(129, 140, 248, 0.3);
  animation-duration: 18s;
  width: calc(1.5px + var(--i) * 0.2px);
  height: calc(1.5px + var(--i) * 0.2px);
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: translateY(0) translateX(0);
  }
  15% {
    opacity: 0.7;
  }
  50% {
    transform: translateY(calc(-30px - var(--i) * 5px)) translateX(calc(15px - var(--i) * 1.5px));
  }
  85% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: translateY(calc(-60px - var(--i) * 8px)) translateX(calc(-10px + var(--i) * 1px));
  }
}

/* ── 内容区 ──────────────────────────────────────────────── */
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

/* ── 标签 ────────────────────────────────────────────────── */
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

/* ── 博客名 ──────────────────────────────────────────────── */
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

/* ── 按钮 ────────────────────────────────────────────────── */
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

/* ── Reduced Motion ──────────────────────────────────────── */
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
  .welcome-bg__orb,
  .welcome-bg__grid,
  .welcome-bg__particle {
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

  .welcome-bg__orb--1 {
    width: 240px;
    height: 240px;
  }

  .welcome-bg__orb--2 {
    width: 280px;
    height: 280px;
  }

  .welcome-bg__orb--3 {
    width: 200px;
    height: 200px;
  }
}
</style>
