<!--
 * WelcomeOverlay — 首页欢迎遮罩
 *
 * 首次访问首页时展示全屏欢迎卡片，
 * 点击按钮后卡片向上滑出消失，首页内容从下方渐入
-->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const props = defineProps({
  blogName: {
    type: String,
    default: 'Jackson 凌',
  },
})

const emit = defineEmits(['dismiss'])

const route = useRoute()
const show = ref(false)
const exiting = ref(false)
let enterTimer = null

function isHomePage() {
  const path = route.path
  return path === '/' || path === '/index.html' || path.endsWith('/index')
}

function shouldShow() {
  if (!isHomePage()) return false
  // 使用 localStorage + 日期标记，每天首次访问展示一次
  const key = 'welcome-overlay-date'
  const today = new Date().toISOString().slice(0, 10)
  const last = localStorage.getItem(key)
  return last !== today
}

onMounted(() => {
  if (!shouldShow()) return
  // 等待页面完全渲染后再展示遮罩
  enterTimer = setTimeout(() => {
    show.value = true
  }, 300)
})

onUnmounted(() => {
  if (enterTimer) clearTimeout(enterTimer)
})

function handleEnter() {
  const key = 'welcome-overlay-date'
  const today = new Date().toISOString().slice(0, 10)
  localStorage.setItem(key, today)
  exiting.value = true

  setTimeout(() => {
    show.value = false
    exiting.value = false
    emit('dismiss')
  }, 800)
}
</script>

<template>
  <div
    v-if="show"
    class="welcome-overlay"
    :class="{ 'is-exiting': exiting }"
  >
    <!-- 背景粒子装饰 -->
    <div class="welcome-particles">
      <span v-for="i in 20" :key="i" class="particle" :style="{
        '--delay': `${(i * 0.7) % 5}s`,
        '--x': `${(i * 17) % 100}%`,
        '--y': `${(i * 23) % 100}%`,
        '--size': `${(i % 3) + 2}px`,
        '--duration': `${(i % 5) + 6}s`,
      }"></span>
    </div>

    <!-- 欢迎卡片 -->
    <div class="welcome-card">
      <div class="welcome-card__glow"></div>

      <div class="welcome-card__content">
        <div class="welcome-card__badge">WELCOME</div>
        <h1 class="welcome-card__title">
          欢迎进入
          <span class="welcome-card__name">{{ blogName }}</span>
          的博客
        </h1>
        <p class="welcome-card__subtitle">
          探索技术世界，记录成长足迹
        </p>
        <button class="welcome-card__btn" @click="handleEnter">
          <span>开始探索</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="welcome-card__deco"></div>
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
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(28px) saturate(0.8);
  -webkit-backdrop-filter: blur(28px) saturate(0.8);
  animation: overlay-in 0.5s ease-out both;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── 退出动画 — 整体向上滑出 ─────────────────────────────── */
.welcome-overlay.is-exiting {
  animation: overlay-exit 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes overlay-exit {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh);
  }
}

/* ── 背景粒子 ────────────────────────────────────────────── */
.welcome-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  animation: particle-float var(--duration) var(--delay) ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.2;
  }
  25% {
    transform: translate(20px, -30px);
    opacity: 0.6;
  }
  50% {
    transform: translate(-15px, -60px);
    opacity: 0.3;
  }
  75% {
    transform: translate(25px, -40px);
    opacity: 0.5;
  }
}

/* ── 欢迎卡片 ────────────────────────────────────────────── */
.welcome-card {
  position: relative;
  max-width: 520px;
  width: 90%;
  padding: 56px 48px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px) saturate(1.2);
  -webkit-backdrop-filter: blur(40px) saturate(1.2);
  overflow: hidden;
  animation: card-enter 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.is-exiting .welcome-card {
  animation: card-exit 0.6s cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes card-exit {
  to {
    opacity: 0;
    transform: translateY(-60px) scale(0.96);
  }
}

/* 光晕背景 */
.welcome-card__glow {
  position: absolute;
  top: -40%;
  left: -20%;
  width: 140%;
  height: 140%;
  background:
    radial-gradient(circle at 30% 30%, rgba(5, 150, 105, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(245, 158, 11, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 50% 80%, rgba(13, 148, 136, 0.1) 0%, transparent 50%);
  pointer-events: none;
  animation: glow-drift 8s ease-in-out infinite alternate;
}

@keyframes glow-drift {
  from { transform: translate(0, 0) rotate(0deg); }
  to { transform: translate(3%, -3%) rotate(2deg); }
}

/* 内容区 */
.welcome-card__content {
  position: relative;
  z-index: 1;
  text-align: center;
}

/* 徽章 */
.welcome-card__badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 28px;
  animation: fade-up 0.6s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* 标题 */
.welcome-card__title {
  font-size: clamp(24px, 5vw, 34px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.4;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  animation: fade-up 0.7s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card__name {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 副标题 */
.welcome-card__subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 36px;
  font-weight: 500;
  animation: fade-up 0.7s 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* 按钮 */
.welcome-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #059669, #0d9488);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s ease;
  animation: fade-up 0.7s 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.welcome-card__btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 12px 40px rgba(5, 150, 105, 0.3);
}

.welcome-card__btn:active {
  transform: translateY(0) scale(0.98);
}

.welcome-card__btn svg {
  transition: transform 0.25s ease;
}

.welcome-card__btn:hover svg {
  transform: translateX(3px);
}

/* 底部装饰线 */
.welcome-card__deco {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(5, 150, 105, 0.3), rgba(245, 158, 11, 0.25), transparent);
  border-radius: 2px;
}

/* ── Reduced Motion ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .welcome-overlay,
  .welcome-card,
  .welcome-card__badge,
  .welcome-card__title,
  .welcome-card__subtitle,
  .welcome-card__btn {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .particle { display: none; }

  .welcome-overlay.is-exiting {
    animation: none !important;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .is-exiting .welcome-card {
    animation: none !important;
  }
}

/* ── 移动端 ──────────────────────────────────────────────── */
@media (max-width: 640px) {
  .welcome-card {
    padding: 40px 28px;
    border-radius: 20px;
  }

  .welcome-card__badge { margin-bottom: 20px; }
  .welcome-card__title { margin-bottom: 12px; }
  .welcome-card__subtitle { margin-bottom: 28px; font-size: 14px; }
  .welcome-card__btn { padding: 12px 28px; font-size: 14px; }
}
</style>
