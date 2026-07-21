<!--
 * HomeExtras.vue — 首页扩展内容区（TIP 标语 + 技术栈轮播 + 友情链接）
 *
 * 改这里：
 *   - TIP 标语   → tips 数组（icon / title / text / color）
 *   - 技术栈数据 → categories 数组（name / desc / items）
 *   - 友情链接   → friendLinks 数组（name / desc / icon / color / link）
 *   - 轮播半径   → CAROUSEL_RADIUS（值越大卡片越分散，推荐 380~500）
 *   - 立体感     → FOCUS_PUSH_Z（推荐 30~80）
 *   - 透视强度   → CSS .carousel-scene 的 perspective（值越小倾斜越夸张）
-->
<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'

/* ── 常量 ─────────────────────────────────────────────────── */
const ENTRANCE_ANIM_DELAY = 520   // 入场动画等待时长（ms）
const ENTRANCE_STAGGER_DELAY = 30 // 入场动画元素错开延迟（ms/个）
const WHEEL_DELTA_Y_THRESHOLD = 15 // 滚轮 deltaY 触发阈值
const DRAG_THRESHOLD = 20         // 拖拽切换触发距离（px）
const DRAG_DETECT_THRESHOLD = 5   // 拖拽位移检测阈值（px，区分点击与拖拽）
const MOBILE_TRANSITION_DURATION = 300 // 移动端卡片切换动画时长（ms）

/* ── 遮罩切换（从 Layout.vue 注入） ───────────────────────── */
const toggleOverlay = inject('toggle-overlay', () => {})

/* ── TIP 标语数据 ───────────────────────────────────────────
 *  每个 tip 包含：
 *    icon  — emoji 图标
 *    title — 标题（如 TIP 1）
 *    text  — 描述文字
 *    color — 主题色（用于图标背景、标题色、光晕色）
 *
 *  如需增删 TIP 卡片，直接修改此数组即可，
 *  网格布局会自动适配（桌面端 3 列，移动端 1 列）
 * ─────────────────────────────────────────────────────────── */
const tips = [
  { icon: '⏳', title: 'TIP 1', text: '明确目标目的，逐步积累，循序渐进，切忌急于求成', color: '#3478d9' },
  { icon: '💪', title: 'TIP 2', text: '少想多做，降低预期，重视基础，重复练习，构建体系', color: '#8b5cf6' },
  { icon: '🚀', title: 'TIP 3', text: '保持独立思考，总结复盘，对比过去看进步，学会主动探索，敢于尝试', color: '#f59e0b' },
]

/* ── 技术模块数据 ───────────────────────────────────────────
 *  轮播卡片数据源，每个分类包含：
 *    name  — 分类中文名（如"后端基础"）
 *    desc  — 分类英文名（如"Backend"）
 *    items — 技术项数组，每项包含：
 *      name  — 技术名称
 *      icon  — 图标路径（/ 开头为 public 目录，空字符串则显示首字母 fallback）
 *      color — 主题色（用于底部高亮条、fallback 背景）
 *      link  — 官网链接
 *
 *  如需添加新分类：
 *    1. 在 categories 数组末尾添加新对象
 *    2. ANGLE_STEP 会自动重新计算（360 / categories.length）
 *    3. 轮播会自动适配新的卡片数量
 * ─────────────────────────────────────────────────────────── */
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

/* ── 友情链接数据 ───────────────────────────────────────────
 *  每个链接包含：
 *    name  — 站点名称
 *    desc  — 一句话描述
 *    icon  — emoji 图标
 *    color — 主题色（顶部渐变条、头像背景、底部链接色）
 *    link  — 站点 URL
 *
 *  如需增删友情链接，直接修改此数组即可，
 *  网格布局会自动适配（桌面端 4 列，移动端 2 列）
 * ─────────────────────────────────────────────────────────── */
const friendLinks = [
  {
    name: 'VitePress',
    desc: 'Vue & Vite 驱动的静态站点生成器',
    icon: '⚡',
    color: '#eab308',
    link: 'https://vitepress.dev',
  },
  {
    name: 'Irai',
    desc: '技术探索者，记录学习与生活',
    icon: '🌐',
    color: '#0d9488',
    link: 'http://iraionly.cn/',
  },
  {
    name: '代码随想录',
    desc: '程序员卡尔的算法与编程教程',
    icon: '📘',
    color: '#2563eb',
    link: 'https://programmercarl.com',
  },
  {
    name: 'LeetCode',
    desc: '全球领先的在线编程练习平台',
    icon: '🎯',
    color: '#ea580c',
    link: 'https://leetcode.cn',
  },
]

/* ── 圆形 3D 立体轮播 ───────────────────────────────────────
 *  原理：rotateY(angle) + translateZ(radius) 排列在圆周上，
 *        聚焦卡片额外 translateZ(FOCUS_PUSH_Z) 向前突出
 *  改这里：
 *    CAROUSEL_RADIUS — 卡片到圆心距离（推荐 380~500）
 *    FOCUS_PUSH_Z    — 聚焦突出距离（推荐 30~80）
 *    ANGLE_STEP      — 自动计算，无需修改
 *    透视强度         → CSS .carousel-scene 的 perspective
 * ─────────────────────────────────────────────────────────── */
const CAROUSEL_RADIUS = 420
const ANGLE_STEP = 360 / categories.length
const FOCUS_PUSH_Z = 50

const focusedIndex = ref(0)
const previousIndex = ref(null)
const transitionDirection = ref('next')
const animIn = ref(true)       // 入场动画阶段（true = 卡片隐藏，false = 正常显示）
const isHovering = ref(false)  // 鼠标是否悬停在轮播区域
const dragMoved = ref(false)   // 本次拖拽是否产生了位移（用于区分点击和拖拽）

const trackAngle = ref(0)      // 轨道旋转角度（负值 = 向右切换）
let carouselTransitionTimer = null

/** 更新当前卡片并记录移动端切换方向 */
function updateFocusedIndex(newIndex, direction) {
  if (newIndex === focusedIndex.value) return
  clearTimeout(carouselTransitionTimer)
  previousIndex.value = focusedIndex.value
  transitionDirection.value = direction
  focusedIndex.value = newIndex
  carouselTransitionTimer = setTimeout(() => {
    previousIndex.value = null
  }, MOBILE_TRANSITION_DURATION)
}

/**
 * 计算每张卡片的 3D 变换样式
 * 根据与聚焦卡片的距离计算 opacity 和 brightness：
 *   距离 0（聚焦）→ opacity 1, brightness 1
 *   距离 1（相邻）→ opacity 0.7, brightness 0.85
 *   距离 2+（远处）→ opacity 0.35, brightness 0.6
 */
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

/** 切换到指定索引的卡片（自动计算最短旋转路径） */
function switchTo(idx) {
  const len = categories.length
  const newIdx = ((idx % len) + len) % len
  const diff = newIdx - focusedIndex.value
  const normalizedDiff = ((diff + len / 2) % len + len) % len - len / 2
  trackAngle.value += -normalizedDiff * ANGLE_STEP
  updateFocusedIndex(newIdx, normalizedDiff >= 0 ? 'next' : 'prev')
}

/** 卡片点击 — 仅在未产生拖拽位移时触发切换 */
function onCardClick(idx) {
  if (dragMoved.value) return
  switchTo(idx)
}

/** 切换到上一张 / 下一张 */
function goPrev() {
  trackAngle.value += ANGLE_STEP
  updateFocusedIndex((focusedIndex.value - 1 + categories.length) % categories.length, 'prev')
}

function goNext() {
  trackAngle.value -= ANGLE_STEP
  updateFocusedIndex((focusedIndex.value + 1) % categories.length, 'next')
}

/* ── 事件监听 ───────────────────────────────────────────────
 *  入场动画：IntersectionObserver 监听 .anim-item 元素进入视口
 *  滚轮切换：鼠标悬停在轮播区域时，滚轮上下滚动切换卡片
 *  拖拽切换：鼠标左键拖拽或触摸滑动切换卡片（位移 > 20px 触发）
 * ─────────────────────────────────────────────────────────── */
let entranceObserver = null
let wheelHandler = null
let cleanupDrag = null
let cleanupArrowAnimation = null
let onTouchDetect = null

const homeExtrasRef = ref(null)
const prevArrowRef = ref(null)
const nextArrowRef = ref(null)

onMounted(() => {
  /* 触摸设备检测 — 事件驱动，仅在实际触摸时标记（兼容混合设备） */
  let touchedOnce = false
  onTouchDetect = () => { touchedOnce = true }
  window.addEventListener('touchstart', onTouchDetect, { once: true, passive: true })

  /* 入场动画 — IntersectionObserver 触发，每个元素延迟 30ms 递增 */
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

  const animItems = homeExtrasRef.value
    ? Array.from(homeExtrasRef.value.querySelectorAll('.anim-item'))
    : Array.from(document.querySelectorAll('.home-extras .anim-item'))
  animItems.forEach((el, i) => {
    el.style.transitionDelay = `${i * ENTRANCE_STAGGER_DELAY}ms`
    entranceObserver.observe(el)
  })

  // 入场动画结束后允许正常显示卡片
  setTimeout(() => { animIn.value = false }, ENTRANCE_ANIM_DELAY)

  /* 滚轮切换 — 仅鼠标悬停在轮播区域时响应，deltaY > 15 阈值防止误触 */
  wheelHandler = (e) => {
    if (!isHovering.value) return
    e.preventDefault()
    if (e.deltaY > WHEEL_DELTA_Y_THRESHOLD) {
      goNext()
    } else if (e.deltaY < -WHEEL_DELTA_Y_THRESHOLD) {
      goPrev()
    }
  }
  window.addEventListener('wheel', wheelHandler, { passive: false })

  /* 拖拽切换 — 支持鼠标和触摸，位移 > 20px 才触发切换 */
  const scene = homeExtrasRef.value
    ? homeExtrasRef.value.querySelector('.carousel-scene')
    : document.querySelector('.home-extras .carousel-scene')
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
    if (Math.abs(e.clientX - startX) > DRAG_DETECT_THRESHOLD) dragMoved.value = true
  }

  function onMouseUp(e) {
    if (!dragging) return
    dragging = false
    document.body.style.userSelect = ''
    const dx = startX - e.clientX
    if (Math.abs(dx) < DRAG_THRESHOLD) return
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
    if (Math.abs(e.touches[0].clientX - startX) > DRAG_DETECT_THRESHOLD) dragMoved.value = true
  }

  function onTouchEnd(e) {
    if (!dragging) return
    dragging = false
    const dx = startX - e.changedTouches[0].clientX
    if (Math.abs(dx) < DRAG_THRESHOLD) return
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

  /* 轮播箭头点击动效 — 解决移动端 :active/:hover 伪类粘滞问题
   * 移动端 bug：tap 后 :hover 会粘滞，点击其他地方才消失
   * 方案：内联 !important 覆盖粘滞伪类，事件驱动检测触摸设备 */
  const arrowCleanups = []
  const arrowEls = [prevArrowRef.value, nextArrowRef.value].filter(Boolean)
  arrowEls.forEach((btn) => {
    let blueTimer = null
    let clearTimer = null
    const setBlue = () => {
      btn.style.setProperty('transition', 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease', 'important')
      btn.style.setProperty('background', 'var(--vp-c-brand-soft)', 'important')
      btn.style.setProperty('border-color', 'var(--site-arrow-active-border)', 'important')
      btn.style.setProperty('color', 'var(--vp-c-brand-1)', 'important')
    }
    const setWhite = () => {
      btn.style.setProperty('transition', 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease', 'important')
      btn.style.setProperty('background', 'var(--site-card-bg)', 'important')
      btn.style.setProperty('border-color', 'var(--site-card-border)', 'important')
      btn.style.setProperty('color', 'var(--vp-c-text-2)', 'important')
    }
    const clearInline = () => {
      btn.style.removeProperty('transition')
      btn.style.removeProperty('background')
      btn.style.removeProperty('border-color')
      btn.style.removeProperty('color')
    }
    const onClick = () => {
      clearTimeout(blueTimer)
      clearTimeout(clearTimer)
      setBlue()
      blueTimer = setTimeout(() => {
        setWhite()
        // 触摸设备：保留内联样式防止粘滞 :hover 复蓝
        // 非触摸设备：清除内联样式恢复 :hover
        if (!touchedOnce) {
          clearTimer = setTimeout(clearInline, 20)
        }
      }, 200)
    }
    btn.addEventListener('click', onClick)
    arrowCleanups.push(() => {
      btn.removeEventListener('click', onClick)
      clearTimeout(blueTimer)
      clearTimeout(clearTimer)
    })
  })
  cleanupArrowAnimation = () => arrowCleanups.forEach((fn) => fn())
})

onUnmounted(() => {
  if (entranceObserver) entranceObserver.disconnect()
  if (wheelHandler) window.removeEventListener('wheel', wheelHandler)
  window.removeEventListener('touchstart', onTouchDetect)
  if (cleanupDrag) cleanupDrag()
  if (cleanupArrowAnimation) cleanupArrowAnimation()
  clearTimeout(carouselTransitionTimer)
})

/**
 * 图标加载失败时的 fallback — 隐藏 <img>，显示首字母
 * 注意：依赖 DOM 结构（img + nextElementSibling），修改 template 时需同步更新
 */
function onIconError(e) {
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex'
}
</script>

<template>
  <div ref="homeExtrasRef" class="home-extras">
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
          ref="prevArrowRef"
          class="carousel-arrow carousel-arrow--prev"
          @click="goPrev"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button
          ref="nextArrowRef"
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
            :class="{
              'is-focused': carouselItems[i].focused,
              'is-leaving': previousIndex === i,
              'is-entering': carouselItems[i].focused && previousIndex !== null,
              'slide-next': transitionDirection === 'next',
              'slide-prev': transitionDirection === 'prev',
            }"
            :style="animIn ? { opacity: '0' } : carouselItems[i].style"
            @click="onCardClick(i)"
          >
            <!-- 非聚焦卡片的点击拦截层 — 点击时切换到该卡片 -->
            <div v-if="!carouselItems[i].focused" class="card-click-overlay" @click.stop="onCardClick(i)"></div>
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
        <div
          class="carousel-pagination"
          role="status"
          :aria-label="`第 ${focusedIndex + 1} 张，共 ${categories.length} 张`"
        >
          <span
            v-for="(_, i) in categories"
            :key="i"
            class="carousel-pagination-dot"
            :class="{ 'is-active': i === focusedIndex }"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </section>

    <!-- ── 友情链接 ─────────────────────────────────────── -->
    <section class="friends-section">
      <div class="section-header anim-item">
        <h2 class="section-title">友情链接</h2>
        <p class="section-sub">Friendly Links</p>
      </div>
      <div class="friends-grid">
        <a
          v-for="friend in friendLinks"
          :key="friend.name"
          :href="friend.link"
          target="_blank"
          rel="noopener"
          class="friend-card anim-item"
        >
          <!-- 顶部渐变装饰条 -->
          <div class="friend-card__bar" :style="{ background: `linear-gradient(90deg, ${friend.color}, ${friend.color}88)` }"></div>
          <!-- 头像区域 -->
          <div class="friend-card__avatar" :style="{ background: `${friend.color}15`, color: friend.color }">
            <span>{{ friend.icon }}</span>
          </div>
          <!-- 信息区域 -->
          <div class="friend-card__info">
            <h3 class="friend-card__name">{{ friend.name }}</h3>
            <p class="friend-card__desc">{{ friend.desc }}</p>
          </div>
          <!-- 底部链接提示 -->
          <div class="friend-card__footer">
            <span class="friend-card__link-text" :style="{ color: friend.color }">访问主页</span>
            <svg class="friend-card__arrow" :style="{ stroke: friend.color }" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-extras {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 80px;
  position: relative;
}

/* ── 入场动画 ─────────────────────────────────────────────
 *  改这里：
 *    - 28px   → 入场偏移距离（越大动画越明显）
 *    - 0.65s  → 动画时长
 *    - transitionDelay 在 JS 中按索引递增 ENTRANCE_STAGGER_DELAY
 * ─────────────────────────────────────────────────────────── */
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

/* 光晕背景 — hover 时增强 */
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

/* ── 友情链接 ────────────────────────────────────────────── */
.friends-section {
  margin-bottom: 52px;
}

.friends-section .section-header {
  margin-bottom: 10px;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.friend-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 20px;
  border-radius: var(--site-card-radius);
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
  will-change: transform;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s ease,
              box-shadow 0.4s ease;
}

.friend-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.55);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.14);
}

/* 顶部渐变装饰条（高度固定，避免触发布局重排） */
.friend-card__bar {
  width: 100%;
  height: 4px;
  border-radius: var(--site-card-radius) var(--site-card-radius) 0 0;
  transition: opacity 0.35s ease;
  opacity: 0.75;
}

.friend-card:hover .friend-card__bar {
  opacity: 1;
}

/* 头像 */
.friend-card__avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-top: 20px;
  margin-bottom: 14px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s ease;
}

.friend-card:hover .friend-card__avatar {
  transform: scale(1.1) rotate(-3deg);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

/* 信息区域 */
.friend-card__info {
  text-align: center;
  flex: 1;
  width: 100%;
}

.friend-card__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.friend-card__desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部链接提示 — hover 时淡入 */
.friend-card__footer {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--site-card-border);
  width: 100%;
  justify-content: center;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.friend-card:hover .friend-card__footer {
  opacity: 1;
  transform: translateY(0);
}

.friend-card__link-text {
  font-size: 12px;
  font-weight: 600;
}

.friend-card__arrow {
  transition: transform 0.25s ease;
}

.friend-card:hover .friend-card__arrow {
  transform: translateX(2px);
}

/* ── 技术栈区域 ──────────────────────────────────────────── */
.section-header {
  text-align: center;
  margin-bottom: 16px;
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

/* ── 圆形 3D 轮播场景 ──────────────────────────────────────
 *  改这里：
 *    perspective — 透视距离（值越小倾斜越夸张，当前 4200px）
 *    height      — 轮播区域高度（当前 380px）
 *    margin-top  — 与标题的间距（当前 80px）
 * ─────────────────────────────────────────────────────────── */
.carousel-scene {
  width: 100%;
  height: 380px;
  position: relative;
  perspective: 4200px;
  overflow: visible;
  cursor: grab;
  margin-top: 80px;
}

.carousel-scene:active {
  cursor: grabbing;
}

/* 轮播轨道 — 通过 rotateY 实现卡片切换 */
.carousel-track {
  width: 320px;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -160px;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── 左右箭头 ───────────────────────────────────────────── */
.carousel-arrow {
  --site-arrow-active-border: rgba(52, 120, 217, 0.3);
  position: absolute;
  /* 自定义修改：调整箭头位置，使其与轮播卡片视觉中心对齐 */
  top: 100px;
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
  -webkit-tap-highlight-color: transparent !important;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

.carousel-arrow:hover {
  background: var(--vp-c-brand-soft);
  border-color: rgba(52, 120, 217, 0.2);
  color: var(--vp-c-brand-1);
}

.carousel-arrow:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

/* 点击动效由 JS 内联样式控制，:active 仅保留按压缩放 */
.carousel-arrow:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-arrow--prev {
  left: 8px;
}

.carousel-arrow--next {
  right: 8px;
}

.carousel-pagination {
  display: none;
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

/* 非聚焦卡片的点击拦截层 */
.card-click-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: pointer;
  border-radius: var(--site-card-radius);
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

/* 底部高亮条 — hover 时从中心展开 */
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

/* 渐变边框 — hover 时显示 */
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

/* 图标 fallback — 加载失败或无图标时显示首字母 */
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

/* ── 响应式（断点 959px，与 VitePress 移动端一致） ──────── */
@media (max-width: 959px) {
  .home-extras {
    padding: 12px 16px 56px;
  }

  .tips-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .friends-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .friend-card {
    padding: 0 16px 16px;
  }

  .friend-card__avatar {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 12px;
  }

  .friend-card__name {
    font-size: 14px;
  }

  .friend-card__footer {
    opacity: 1;
    transform: none;
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
    height: 240px;
    perspective: 3200px;
    margin-top: 40px;
  }

  .carousel-track {
    width: 280px;
    margin-left: -140px;
  }

  .carousel-arrow {
    width: 34px;
    height: 34px;
    /* 自定义修改：移动端箭头位置与卡片视觉中心对齐 */
    top: 50px;
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

@media (max-width: 640px) {
  .carousel-scene {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) 34px;
    align-items: center;
    column-gap: 8px;
    height: auto;
    perspective: none;
    margin-bottom: 40px;
    cursor: default;
  }

  .carousel-track {
    position: relative;
    display: grid;
    grid-column: 2;
    grid-row: 1;
    left: auto;
    top: auto;
    width: 100%;
    height: auto;
    margin-left: 0;
    transform: none !important;
  }

  .carousel-card {
    position: relative;
    grid-area: 1 / 1;
    align-self: center;
    transform: none !important;
    opacity: 0 !important;
    visibility: hidden;
    filter: none !important;
    pointer-events: none;
  }

  .carousel-card.is-focused {
    opacity: 1 !important;
    visibility: visible;
    pointer-events: auto;
  }

  .carousel-card.is-leaving {
    opacity: 1 !important;
    visibility: visible;
    pointer-events: none;
  }

  .carousel-card.is-entering.slide-next .category-block {
    animation: mobile-card-enter-next 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .carousel-card.is-leaving.slide-next .category-block {
    animation: mobile-card-leave-next 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .carousel-card.is-entering.slide-prev .category-block {
    animation: mobile-card-enter-prev 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .carousel-card.is-leaving.slide-prev .category-block {
    animation: mobile-card-leave-prev 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .carousel-arrow {
    position: static;
    grid-row: 1;
    transform: none;
  }

  .carousel-arrow--prev {
    grid-column: 1;
  }

  .carousel-arrow--next {
    grid-column: 3;
  }

  .carousel-arrow:active {
    transform: scale(0.95);
  }

  .carousel-pagination {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
  }

  .carousel-pagination-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--vp-c-divider);
    transform: scale(0.75);
    transition: transform 200ms ease, background 200ms ease;
  }

  .carousel-pagination-dot.is-active {
    background: var(--vp-c-brand-1);
    transform: scale(1);
  }
}

@keyframes mobile-card-enter-next {
  from { opacity: 0; transform: translateX(18px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes mobile-card-leave-next {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-18px); }
}

@keyframes mobile-card-enter-prev {
  from { opacity: 0; transform: translateX(-18px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes mobile-card-leave-prev {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(18px); }
}

/* ── Reduced Motion — 无障碍适配 ─────────────────────────── */
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

@media (max-width: 640px) and (prefers-reduced-motion: reduce) {
  .carousel-card {
    opacity: 0 !important;
  }

  .carousel-card.is-focused {
    opacity: 1 !important;
  }

  .carousel-card.is-leaving {
    opacity: 0 !important;
    visibility: hidden;
  }

  .carousel-card .category-block {
    animation: none !important;
  }
}
</style>

<style>
/* ── Dark mode — 暗色模式适配（非 scoped，覆盖硬编码色值） ── */
.dark .tip-card {
  background: rgba(31, 31, 35, 0.65);
  border-color: rgba(161, 161, 170, 0.06);
}

.dark .tip-card-wrapper:hover .tip-card {
  border-color: rgba(161, 161, 170, 0.12);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.dark .tip-glow {
  opacity: 0.2;
}

.dark .tip-card-wrapper:hover .tip-glow {
  opacity: 0.5;
}

.dark .carousel-card.is-focused .category-block {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2);
  border-color: rgba(104, 116, 163, 0.15);
}

.dark .carousel-card:not(.is-focused):hover .category-block {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  border-color: rgba(104, 116, 163, 0.1);
}

.dark .tech-logo-card:hover {
  border-color: rgba(104, 116, 163, 0.12);
}

.dark .carousel-arrow {
  --site-arrow-active-border: rgba(104, 116, 163, 0.3);
}

.dark .carousel-arrow:hover {
  border-color: rgba(104, 116, 163, 0.15);
}

/* 友情链接 — 暗色模式 */
.dark .friend-card {
  background: rgba(31, 31, 35, 0.65);
  border-color: rgba(161, 161, 170, 0.06);
}

.dark .friend-card:hover {
  border-color: rgba(161, 161, 170, 0.12);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.dark .friend-card__footer {
  border-top-color: rgba(161, 161, 170, 0.06);
}
</style>
