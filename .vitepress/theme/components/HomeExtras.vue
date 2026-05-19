<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ── TIP 标语数据 ─────────────────────────────────────────── */
const tips = [
  { icon: '⏳', title: 'TIP 1', text: '明确目标目的，逐步积累，循序渐进，切忌急于求成', color: '#3478d9' },
  { icon: '💪', title: 'TIP 2', text: '少想多做，降低预期，重视基础，重复练习，构建体系', color: '#8b5cf6' },
  { icon: '🚀', title: 'TIP 3', text: '保持独立思考，总结复盘，学会主动探索，敢于尝试', color: '#f59e0b' },
]

/* ── 技术模块数据 ─────────────────────────────────────────── */
const categories = [
  {
    name: '后端基础',
    desc: 'Backend',
    items: [
      { name: 'Spring', icon: '/spring.png', color: '#6DB33B', link: 'https://spring.io' },
      { name: 'SpringBoot', icon: '/springboot.png', color: '#6DB33B', link: 'https://spring.io/projects/spring-boot' },
      { name: 'MyBatis', icon: '/mybatis.png', color: '#E3342F', link: 'https://mybatis.org/mybatis-3/' },
      { name: 'MyBatis Plus', icon: '/mybatisplus.png', color: '#E3342F', link: 'https://baomidou.com' },
    ],
  },
  {
    name: '数据存储',
    desc: 'Database',
    items: [
      { name: 'MySQL', icon: '/mysql.png', color: '#4479A1', link: 'https://www.mysql.com' },
      { name: 'Redis', icon: '/redis.png', color: '#DC382D', link: 'https://redis.io' },
    ],
  },
  {
    name: '微服务',
    desc: 'Microservices',
    items: [
      { name: 'SpringCloud', icon: '/springcloud.png', color: '#6DB33B', link: 'https://spring.io/projects/spring-cloud' },
      { name: 'RabbitMQ', icon: '/rabbitmq.png', color: '#FF6600', link: 'https://www.rabbitmq.com' },
      { name: 'Elasticsearch', icon: '/elasticsearch.png', color: '#005571', link: 'https://www.elastic.co/elasticsearch' },
    ],
  },
  {
    name: 'AI 应用',
    desc: 'AI & LLM',
    items: [
      { name: 'SpringAI', icon: '/spring.png', color: '#6DB33B', link: 'https://spring.io/projects/spring-ai' },
      { name: 'LangChain4j', icon: '', color: '#3178C6', link: 'https://docs.langchain4j.dev' },
      { name: 'Ollama', icon: '', color: '#000000', link: 'https://ollama.com' },
      { name: 'Claude Code', icon: '', color: '#D97706', link: 'https://docs.anthropic.com/en/docs/claude-code' },
    ],
  },
  {
    name: 'DevOps',
    desc: 'DevOps',
    items: [
      { name: 'Docker', icon: '/docker.png', color: '#2496ED', link: 'https://www.docker.com' },
      { name: 'Linux', icon: '/linux.png', color: '#FCC624', link: 'https://www.linux.org' },
      { name: 'Nginx', icon: '/ngnix.png', color: '#009639', link: 'https://nginx.org' },
      { name: 'Git', icon: '/git.png', color: '#F05032', link: 'https://git-scm.com' },
    ],
  },
]

/* ── 圆形 3D 立体轮播 ─────────────────────────────────────── */
const CAROUSEL_RADIUS = 280
const ANGLE_STEP = 360 / categories.length  // 72° per card
const FOCUS_PUSH_Z = 50

const focusedIndex = ref(0)
const animIn = ref(true)
const isHovering = ref(false)
const dragMoved = ref(false)

const trackAngle = ref(0)

const carouselItems = computed(() => {
  return categories.map((_, i) => {
    const angle = i * ANGLE_STEP
    const isFocused = i === focusedIndex.value
    const dist = Math.abs(i - focusedIndex.value)
    const minDist = Math.min(dist, categories.length - dist)

    const opacity = minDist === 0 ? 1 : minDist === 1 ? 0.7 : 0.35
    const brightness = minDist === 0 ? 1 : minDist === 1 ? 0.85 : 0.6

    return {
      style: {
        transform: `rotateY(${angle}deg) translateZ(${CAROUSEL_RADIUS}px)${isFocused ? ` translateZ(${FOCUS_PUSH_Z}px)` : ''}`,
        opacity: String(opacity),
        filter: `brightness(${brightness})`,
      },
      focused: isFocused,
    }
  })
})

function switchTo(idx) {
  const len = categories.length
  const newIdx = ((idx % len) + len) % len
  const diff = newIdx - focusedIndex.value
  const normalizedDiff = ((diff + len / 2) % len + len) % len - len / 2
  trackAngle.value += -normalizedDiff * ANGLE_STEP
  focusedIndex.value = newIdx
}

function onCardClick(idx) {
  if (dragMoved.value) return
  switchTo(idx)
}

function goPrev() {
  trackAngle.value += ANGLE_STEP
  focusedIndex.value = (focusedIndex.value - 1 + categories.length) % categories.length
}

function goNext() {
  trackAngle.value -= ANGLE_STEP
  focusedIndex.value = (focusedIndex.value + 1) % categories.length
}

/* ── 事件监听 ─────────────────────────────────────────────── */
let entranceObserver = null
let wheelHandler = null
let cleanupDrag = null

onMounted(() => {
  /* 入场动画 */
  entranceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          entranceObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.06, rootMargin: '0px 0px -16px 0px' }
  )

  document.querySelectorAll('.home-extras .anim-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 30}ms`
    entranceObserver.observe(el)
  })

  setTimeout(() => { animIn.value = false }, 520)

  /* 滚轮 — 仅鼠标悬停在轮播区域时响应 */
  wheelHandler = (e) => {
    if (!isHovering.value) return
    e.preventDefault()
    if (e.deltaY > 15) {
      goNext()
    } else if (e.deltaY < -15) {
      goPrev()
    }
  }
  window.addEventListener('wheel', wheelHandler, { passive: false })

  /* 拖拽（鼠标 + 触摸） */
  const scene = document.querySelector('.home-extras .carousel-scene')
  if (!scene) return

  let startX = 0
  let dragging = false

  function onMouseDown(e) {
    if (e.button !== 0) return
    e.preventDefault()
    startX = e.clientX
    dragging = true
    dragMoved.value = false
    document.body.style.userSelect = 'none'
  }

  function onMouseMove(e) {
    if (!dragging) return
    e.preventDefault()
    if (Math.abs(e.clientX - startX) > 5) dragMoved.value = true
  }

  function onMouseUp(e) {
    if (!dragging) return
    dragging = false
    document.body.style.userSelect = ''
    const dx = startX - e.clientX
    if (Math.abs(dx) < 20) return
    if (dx > 0) goNext()
    else goPrev()
  }

  function onTouchStart(e) {
    startX = e.touches[0].clientX
    dragging = true
    dragMoved.value = false
  }

  function onTouchMove(e) {
    if (!dragging) return
    if (Math.abs(e.touches[0].clientX - startX) > 5) dragMoved.value = true
  }

  function onTouchEnd(e) {
    if (!dragging) return
    dragging = false
    const dx = startX - e.changedTouches[0].clientX
    if (Math.abs(dx) < 20) return
    if (dx > 0) goNext()
    else goPrev()
  }

  scene.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  scene.addEventListener('touchstart', onTouchStart, { passive: true })
  scene.addEventListener('touchmove', onTouchMove, { passive: true })
  scene.addEventListener('touchend', onTouchEnd, { passive: true })

  cleanupDrag = () => {
    scene.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    scene.removeEventListener('touchstart', onTouchStart)
    scene.removeEventListener('touchmove', onTouchMove)
    scene.removeEventListener('touchend', onTouchEnd)
  }
})

onUnmounted(() => {
  if (entranceObserver) entranceObserver.disconnect()
  if (wheelHandler) window.removeEventListener('wheel', wheelHandler)
  if (cleanupDrag) cleanupDrag()
})

function onIconError(e) {
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex'
}
</script>

<template>
  <div class="home-extras">
    <!-- ── TIP 标语区域 ──────────────────────────────────── -->
    <section class="tips-section">
      <div class="tips-grid">
        <div v-for="(tip, i) in tips" :key="i" class="tip-card-wrapper anim-item">
          <div class="tip-glow" :style="{ background: `radial-gradient(circle, ${tip.color}30, transparent 70%)` }"></div>
          <div class="tip-card">
            <div class="tip-icon-plate" :style="{ background: `${tip.color}18`, boxShadow: `0 0 20px ${tip.color}20` }">
              <span class="tip-icon">{{ tip.icon }}</span>
            </div>
            <div class="tip-body">
              <h3 class="tip-title" :style="{ color: tip.color }">{{ tip.title }}</h3>
              <p class="tip-text">{{ tip.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 技术栈分类展示（圆形 3D 轮播） ────────────────── -->
    <section class="tech-section">
      <div class="section-header anim-item">
        <h2 class="section-title">技术栈</h2>
        <p class="section-sub">Technologies I work with</p>
      </div>

      <div
        class="carousel-scene"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <!-- 左右箭头 -->
        <button
          class="carousel-arrow carousel-arrow--prev"
          @click="goPrev"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button
          class="carousel-arrow carousel-arrow--next"
          @click="goNext"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <div
          class="carousel-track"
          :style="{ transform: `rotateY(${trackAngle}deg)` }"
        >
          <div
            v-for="(cat, i) in categories"
            :key="cat.name"
            class="carousel-card anim-item"
            :class="{ 'is-focused': carouselItems[i].focused }"
            :style="animIn ? { opacity: '0' } : carouselItems[i].style"
            @click="onCardClick(i)"
          >
            <div class="category-block">
              <div class="category-header">
                <span class="category-dot" :style="{ background: cat.items[0]?.color || '#3478d9' }"></span>
                <span class="category-name">{{ cat.name }}</span>
                <span class="category-desc">{{ cat.desc }}</span>
              </div>
              <div class="category-grid">
                <a
                  v-for="tech in cat.items"
                  :key="tech.name"
                  :href="tech.link"
                  target="_blank"
                  rel="noopener"
                  class="tech-logo-card"
                  @click.stop
                >
                  <div class="logo-icon-wrap">
                    <img
                      v-if="tech.icon"
                      :src="tech.icon"
                      :alt="tech.name"
                      class="logo-icon"
                      @error="onIconError"
                    />
                    <span v-if="tech.icon" class="logo-fallback" style="display:none">
                      {{ tech.name[0] }}
                    </span>
                    <span v-else class="logo-fallback" :style="{ background: tech.color + '10', color: tech.color }">
                      {{ tech.name[0] }}
                    </span>
                  </div>
                  <span class="logo-name">{{ tech.name }}</span>
                  <span class="logo-accent" :style="{ background: tech.color }"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-extras {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 80px;
}

/* ── 入场动画 ───────────────────────────────────────────── */
.anim-item {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.anim-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── TIP 标语 ────────────────────────────────────────────── */
.tips-section {
  margin-bottom: 52px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.tip-card-wrapper {
  position: relative;
  border-radius: var(--site-card-radius);
  cursor: default;
}

.tip-glow {
  position: absolute;
  inset: -12px;
  border-radius: inherit;
  opacity: 0.5;
  filter: blur(24px);
  z-index: 0;
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.tip-card-wrapper:hover .tip-glow {
  opacity: 0.85;
  transform: scale(1.08);
}

.tip-card {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 22px;
  border-radius: var(--site-card-radius);
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s ease,
              box-shadow 0.4s ease;
}

.tip-card-wrapper:hover .tip-card {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.55);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
}

.tip-icon-plate {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s ease;
}

.tip-card-wrapper:hover .tip-icon-plate {
  transform: scale(1.1);
}

.tip-icon {
  font-size: 24px;
  line-height: 1;
}

.tip-body {
  flex: 1;
  min-width: 0;
}

.tip-title {
  font-size: 12px;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.tip-text {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 500;
}

/* ── 技术栈区域 ──────────────────────────────────────────── */
.section-header {
  text-align: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
}

.section-sub {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0;
  letter-spacing: 0.03em;
  font-weight: 500;
}

/* ── 圆形 3D 轮播场景 ────────────────────────────────────── */
.carousel-scene {
  width: 100%;
  height: 380px;
  position: relative;
  perspective: 1200px;
  overflow: visible;
  cursor: grab;
  margin-top: 120px;
}

.carousel-scene:active {
  cursor: grabbing;
}

.carousel-track {
  width: 240px;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -120px;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── 左右箭头 ───────────────────────────────────────────── */
.carousel-arrow {
  position: absolute;
  top: 160px !important;
  transform: translateY(-50%);
  z-index: 20;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--site-card-border);
  background: var(--site-card-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.carousel-arrow:hover {
  background: var(--vp-c-brand-soft);
  border-color: rgba(52, 120, 217, 0.2);
  color: var(--vp-c-brand-1);
}

.carousel-arrow--prev {
  left: 8px;
}

.carousel-arrow--next {
  right: 8px;
}

/* ── 轮播卡片 ───────────────────────────────────────────── */
.carousel-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  backface-visibility: hidden;
  transform-origin: center center;
  cursor: pointer;
  will-change: transform, opacity;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.55s ease,
              filter 0.55s ease;
}

.carousel-card.is-focused {
  cursor: default;
}

.carousel-card.is-focused .category-block {
  box-shadow: 0 20px 60px rgba(52, 120, 217, 0.25),
              0 8px 32px rgba(15, 23, 42, 0.15);
  border-color: rgba(52, 120, 217, 0.3);
}

.carousel-card:not(.is-focused):hover .category-block {
  box-shadow: 0 12px 40px rgba(52, 120, 217, 0.15);
  border-color: rgba(52, 120, 217, 0.12);
}

/* 内层卡片 */
.category-block {
  border-radius: var(--site-card-radius);
  border: 1px solid var(--site-card-border);
  background: var(--site-card-bg);
  padding: 16px;
  box-shadow: var(--site-card-shadow);
  position: relative;
  transition: box-shadow 0.45s ease, border-color 0.45s ease;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--site-card-border);
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.category-desc {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-left: auto;
}

/* ── Logo 网格 ───────────────────────────────────────────── */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  gap: 8px;
}

.tech-logo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px 4px 10px;
  border-radius: 10px;
  border: 1px solid var(--site-card-border);
  background: var(--site-card-bg);
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.28s ease;
}

.tech-logo-card:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(52, 120, 217, 0.15);
}

.logo-accent {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tech-logo-card:hover .logo-accent {
  width: 55%;
}

.tech-logo-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(52, 120, 217, 0.1), transparent 40%, transparent 60%, rgba(52, 120, 217, 0.05));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tech-logo-card:hover::before {
  opacity: 1;
}

.logo-icon-wrap {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 7px;
  transition: transform 0.25s ease;
}

.tech-logo-card:hover .logo-icon {
  transform: scale(1.1);
}

.logo-fallback {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  transition: transform 0.25s ease;
}

.tech-logo-card:hover .logo-fallback {
  transform: scale(1.1);
}

.logo-name {
  font-size: 10px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: color 0.2s ease;
}

.tech-logo-card:hover .logo-name {
  color: var(--vp-c-text-1);
}

/* ── 响应式 ─────────────────────────────────────────────── */
@media (max-width: 959px) {
  .home-extras {
    padding: 12px 16px 56px;
  }

  .tips-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .tip-card {
    padding: 16px 18px;
  }

  .tip-icon-plate {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .tip-icon {
    font-size: 20px;
  }

  .tip-glow {
    inset: -8px;
    filter: blur(18px);
  }

  .carousel-scene {
    height: 320px;
    perspective: 900px;
    margin-top: 90px;
  }

  .carousel-track {
    width: 200px;
    margin-left: -100px;
  }

  .carousel-arrow {
    width: 34px;
    height: 34px;
    top: 130px;
  }

  .carousel-arrow svg {
    width: 16px;
    height: 16px;
  }

  .carousel-arrow--prev {
    left: 4px;
  }

  .carousel-arrow--next {
    right: 4px;
  }

  .category-block {
    padding: 12px 10px;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 6px;
  }

  .tech-logo-card {
    padding: 8px 4px 8px;
  }

  .logo-icon-wrap {
    width: 24px;
    height: 24px;
  }

  .logo-icon {
    width: 22px;
    height: 22px;
  }

  .logo-fallback {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }

  .section-title {
    font-size: 22px;
  }
}

/* ── Reduced Motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .anim-item {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .tip-glow {
    transition: none !important;
  }

  .tip-card {
    transition: none !important;
  }

  .tip-icon-plate {
    transition: none !important;
  }

  .carousel-track {
    transition: none !important;
  }

  .carousel-card {
    transition: none !important;
    position: relative !important;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }

  .carousel-arrow {
    transition: none !important;
  }

  .category-block {
    transition: none !important;
  }

  .tech-logo-card,
  .logo-icon,
  .logo-fallback,
  .logo-accent {
    transition: none !important;
  }
}
</style>

<style>
/* ── Dark mode — 玻璃拟态暗色适配 ────────────────────────── */
.dark .tip-card {
  background: rgba(24, 24, 40, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .tip-card-wrapper:hover .tip-card {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.dark .tip-glow {
  opacity: 0.3;
}

.dark .tip-card-wrapper:hover .tip-glow {
  opacity: 0.6;
}
</style>
