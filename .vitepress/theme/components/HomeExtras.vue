<script setup>
import { onMounted, onUnmounted } from 'vue'

/* ── TIP 标语数据 ─────────────────────────────────────────── */
const tips = [
  { icon: '⏳', title: 'TIP 1', text: '明确目标目的，逐步积累，循序渐进，切忌急于求成' },
  { icon: '💪', title: 'TIP 2', text: '少想多做，降低预期，重视基础，重复练习，构建体系' },
  { icon: '🚀', title: 'TIP 3', text: '保持独立思考，总结复盘，学会主动探索，敢于尝试' },
]

/* ── 技术模块数据（分类展示） ─────────────────────────────── */
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

/* ── 滚动入场 + 聚焦效果 ──────────────────────────────────── */
let entranceObserver = null
let scrollHandler = null
let rafId = null

onMounted(() => {
  /* 入场动画（触发一次后取消观察） */
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

  /* 聚焦效果 — 离视口中心最近的块聚焦 */
  const wrappers = document.querySelectorAll('.home-extras .category-wrapper')
  let lastFocused = null

  scrollHandler = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      let closest = null

      const scrollBottom = window.innerHeight + window.scrollY
      const pageHeight = document.documentElement.scrollHeight
      if (scrollBottom >= pageHeight - 40 && wrappers.length > 0) {
        closest = wrappers[wrappers.length - 1]
      } else {
        const centerY = window.innerHeight / 2
        let minDist = Infinity
        wrappers.forEach((w) => {
          const rect = w.getBoundingClientRect()
          const dist = Math.abs(rect.top + rect.height / 2 - centerY)
          if (dist < minDist) {
            minDist = dist
            closest = w
          }
        })
      }

      if (closest !== lastFocused) {
        if (lastFocused) lastFocused.classList.remove('is-focused')
        if (closest) closest.classList.add('is-focused')
        lastFocused = closest
      }
    })
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  // 初始触发一次
  scrollHandler()
})

onUnmounted(() => {
  if (entranceObserver) entranceObserver.disconnect()
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (rafId) cancelAnimationFrame(rafId)
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
        <div v-for="(tip, i) in tips" :key="i" class="tip-card anim-item">
          <span class="tip-icon">{{ tip.icon }}</span>
          <div class="tip-body">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-text">{{ tip.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 技术栈分类展示 ────────────────────────────────── -->
    <section class="tech-section">
      <div class="section-header anim-item">
        <h2 class="section-title">技术栈</h2>
        <p class="section-sub">Technologies I work with</p>
      </div>

      <div class="category-list">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="category-wrapper anim-item"
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
    </section>
  </div>
</template>

<style scoped>
.home-extras {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 60px;
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
  gap: 14px;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 20px;
  border-radius: var(--site-card-radius);
  border: 1px solid var(--site-card-border);
  background: var(--site-card-bg);
}

.tip-icon {
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin: 0 0 5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.tip-text {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 500;
}

/* ── 技术栈区域 ──────────────────────────────────────────── */
.section-header {
  text-align: center;
  margin-bottom: 40px;
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

/* ── 分类块 ──────────────────────────────────────────────── */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

/* 外层 wrapper */
.category-wrapper {
  border-radius: var(--site-card-radius);
  padding: 0;
  position: relative;
}

/* 内层卡片 — 聚焦时仅放大 */
.category-block {
  border-radius: var(--site-card-radius);
  border: 1px solid var(--site-card-border);
  background: var(--site-card-bg);
  padding: 28px;
  box-shadow: var(--site-card-shadow);
  position: relative;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-wrapper.is-focused .category-block {
  transform: scale(1.06);
}

.category-wrapper:hover .category-block {
  box-shadow: var(--site-card-shadow-hover);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 13px;
  border-bottom: 1px solid var(--site-card-border);
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.category-desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-left: auto;
}

/* ── Logo 网格 ───────────────────────────────────────────── */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.tech-logo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.04);
  background: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.28s ease;
}

.tech-logo-card:hover {
  transform: translateY(-3px) scale(1.03);
  border-color: rgba(52, 120, 217, 0.15);
}

/* 底部品牌色高亮条 */
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

/* 渐变边框 */
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

/* 图标 */
.logo-icon-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 9px;
  transition: transform 0.25s ease;
}

.tech-logo-card:hover .logo-icon {
  transform: scale(1.1);
}

.logo-fallback {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  transition: transform 0.25s ease;
}

.tech-logo-card:hover .logo-fallback {
  transform: scale(1.1);
}

.logo-name {
  font-size: 11.5px;
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
    padding: 12px 16px 64px;
  }

  .tips-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .tip-card {
    padding: 14px 16px;
  }

  .category-block {
    padding: 20px 18px;
  }

  .category-list {
    gap: 40px;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    gap: 8px;
  }

  .tech-logo-card {
    padding: 14px 6px 12px;
  }

  .logo-icon-wrap {
    width: 36px;
    height: 36px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-fallback {
    width: 32px;
    height: 32px;
    font-size: 15px;
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

  .category-wrapper,
  .category-block {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  .tech-logo-card,
  .logo-icon,
  .logo-fallback,
  .logo-accent {
    transition: none !important;
  }
}
</style>
