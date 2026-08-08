<!--
 * 首页滚动动画
 *
 * 首页标题、Logo、按钮和页脚读取 VitePress 配置；其他内容统一维护在 home-content.js。
 -->
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import {
  HOME_INTRO_STORAGE_KEY,
  homeChapters as chapters,
  homeFriendLinks as friendLinks,
  homeTechCategories as techCategories,
  homeTips as tips,
} from '../home-content.js'

const { frontmatter, isDark, theme } = useData()
const hero = computed(() => frontmatter.value.hero || {})
const heroImage = computed(() => {
  const image = hero.value.image
  if (typeof image === 'string') return image
  if (!image) return ''
  return isDark.value ? image.dark || image.light : image.light || image.dark
})
const loaderName = computed(() => String(hero.value.name || 'jackson凌').replace(/^博客の/i, ''))
const copyright = computed(() => theme.value.footer?.copyright || '')

const homeMotionRef = ref(null)
const loaderRef = ref(null)
const loaderCountRef = ref(null)
const introReady = ref(false)
const showLoader = ref(true)
const activeChapter = ref(0)

let renderFrameId = 0
let loaderFrameId = 0
let reducedMotion = false
let targetProgress = 0
let currentProgress = 0
let previousProgress = 0
let scrollVelocity = 0
let pointerX = 0
let pointerY = 0
let activeTechIndex = -1
const timeoutIds = []

// 手机端离散切换状态
const isMobile = () => window.innerWidth <= 700
let mobileStep = 0
let mobileTransitioning = false
let mobileLockTimer = null
let renderMobile = () => {}
let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0
let touchHandled = false

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = value => value * value * (3 - 2 * value)
const range = (value, start, end) => clamp((value - start) / (end - start))
const mix = (start, end, amount) => start + (end - start) * amount

function setVars(element, values) {
  if (!element) return
  Object.entries(values).forEach(([name, value]) => element.style.setProperty(`--${name}`, value))
}

function setTimer(callback, delay) {
  const id = window.setTimeout(callback, delay)
  timeoutIds.push(id)
  return id
}

function finishEntrance() {
  try {
    sessionStorage.setItem('welcome-overlay-shown', '1')
  } catch {}
  introReady.value = true
  showLoader.value = false
  document.documentElement.classList.remove('home-motion-loading', 'welcome-blocking', 'entrance-bg')
  document.documentElement.classList.add('home-motion-intro-seen')
}

function prepareEntrance() {
  let shouldPlayEntrance = true
  try {
    shouldPlayEntrance = sessionStorage.getItem(HOME_INTRO_STORAGE_KEY) !== '1'
    if (shouldPlayEntrance) sessionStorage.setItem(HOME_INTRO_STORAGE_KEY, '1')
  } catch {}

  if (!loaderRef.value || reducedMotion || !shouldPlayEntrance) {
    finishEntrance()
    return
  }

  document.documentElement.classList.add('home-motion-loading')
  const loader = loaderRef.value
  const loaderCount = loaderCountRef.value
  const duration = 2600
  const gatherDuration = 1150
  const focusPause = 150
  const frameDuration = 280
  let startedAt = 0
  loader.classList.add('is-seeding')

  function updateLoader(now) {
    const linear = clamp((now - startedAt) / duration)
    const displayed = Math.min(100, Math.round(linear * 100))
    const edgeProgress = offset => clamp(linear * 4 - offset)
    if (loaderCount) loaderCount.value = String(displayed)
    loader.style.setProperty('--load-progress', linear)
    loader.style.setProperty('--load-top', edgeProgress(0))
    loader.style.setProperty('--load-right', edgeProgress(1))
    loader.style.setProperty('--load-bottom', edgeProgress(2))
    loader.style.setProperty('--load-left', edgeProgress(3))
    if (linear < 1) {
      loaderFrameId = requestAnimationFrame(updateLoader)
      return
    }
    setTimer(() => {
      loader.classList.add('is-exiting')
      setTimer(finishEntrance, 1160)
    }, 220)
  }

  setTimer(() => {
    loader.classList.add('is-framing')
    setTimer(() => {
      loader.classList.add('is-building')
      startedAt = performance.now()
      loaderFrameId = requestAnimationFrame(updateLoader)
    }, frameDuration)
  }, gatherDuration + focusPause)
}

function updateTargetProgress() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  targetProgress = clamp(window.scrollY / maxScroll)
}

function scrollToProgress(progress) {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  window.scrollTo({ top: maxScroll * clamp(progress), behavior: reducedMotion ? 'auto' : 'smooth' })
}

function onStagePointerMove(event) {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 24
  pointerY = (event.clientY / window.innerHeight - 0.5) * 16
  const item = event.target.closest?.('.motion-item')
  if (!item || !homeMotionRef.value?.contains(item)) return
  const rect = item.getBoundingClientRect()
  item.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
  item.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`)
}

function onStagePointerLeave() {
  pointerX = 0
  pointerY = 0
}

function onTechCardClick(event, index) {
  if (event.target.closest('a')) return
  scrollToProgress(0.39 + (index / Math.max(1, techCategories.length - 1)) * 0.4)
}

function onImageError(event, fallbackText) {
  const fallback = document.createElement('b')
  fallback.textContent = fallbackText.charAt(0) || '?'
  event.currentTarget.replaceWith(fallback)
}

function mobileGoTo(step) {
  const maxStep = 1 + techCategories.length + 1
  const clamped = Math.max(0, Math.min(maxStep, step))
  if (clamped === mobileStep) return
  mobileStep = clamped
  mobileTransitioning = true
  renderMobile()
  if (mobileLockTimer) clearTimeout(mobileLockTimer)
  mobileLockTimer = setTimeout(() => {
    mobileTransitioning = false
    mobileLockTimer = null
  }, 350)
}

function onTouchStart(e) {
  if (!isMobile() || mobileTransitioning) return
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  touchStartTime = Date.now()
  touchHandled = false
}

function onTouchMove(e) {
  if (!isMobile()) return
  e.preventDefault()
}

function onTouchEnd(e) {
  if (!isMobile() || touchHandled) return
  const touch = e.changedTouches[0]
  const deltaY = touch.clientY - touchStartY
  const deltaX = touch.clientX - touchStartX
  const elapsed = Date.now() - touchStartTime
  if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 30) return
  if (elapsed < 150 && Math.abs(deltaY) < 20) return
  if (Math.abs(deltaY) < 50) return
  touchHandled = true
  mobileGoTo(deltaY < 0 ? mobileStep + 1 : mobileStep - 1)
}

function onTouchCancel() {
  touchHandled = false
  touchStartX = 0
  touchStartY = 0
  touchStartTime = 0
}

onMounted(() => {
  const root = homeMotionRef.value
  if (!root) return
  document.documentElement.classList.add('home-motion-active', 'entrance-bg', 'home-motion-loading')
  document.documentElement.classList.remove('welcome-blocking')
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const stage = root.querySelector('.motion-stage')
  const progressBar = root.querySelector('.progress-rail span')
  const heroElement = root.querySelector('.hero-cluster')
  const tipCards = [...root.querySelectorAll('.tip-card')]
  const techTitle = root.querySelector('.tech-scene .scene-title')
  const techCards = [...root.querySelectorAll('.tech-card')]
  const techSequence = root.querySelector('.tech-sequence')
  const techCounter = root.querySelector('#techCounter')
  const techName = root.querySelector('#techName')
  const friendTitle = root.querySelector('.friends-scene .scene-title')
  const friends = [...root.querySelectorAll('.friend-card')]
  const footer = root.querySelector('.footer-scene')

  function animateHero(progress) {
    const exit = ease(range(progress, 0.07, 0.16))
    setVars(heroElement, {
      tx: `${pointerX * 0.09 - exit * window.innerWidth * 0.2}px`,
      ty: `${-exit * 46 + pointerY * 0.04}px`,
      tz: `${-exit * 620}px`,
      rx: `${-exit * 9 + pointerY * -0.014}deg`,
      ry: `${-exit * 18 + pointerX * 0.014}deg`,
      rz: `${exit * -2.5}deg`,
      scale: 1 - exit * 0.16,
      alpha: 1 - exit,
      blur: `${exit * 7}px`,
    })
    heroElement.style.pointerEvents = 1 - exit > 0.78 ? 'auto' : 'none'
  }

  function animateTips(progress) {
    const enter = ease(range(progress, 0.09, 0.18))
    const exit = ease(range(progress, 0.27, 0.37))
    const mobile = window.innerWidth <= 700
    const sceneAlpha = enter * (1 - exit)
    const speedTilt = clamp(scrollVelocity * 1500, -7, 7)
    tipCards.forEach((card, index) => {
      const offset = index - 1
      const delayed = ease(range(enter, index * 0.08, 0.76 + index * 0.08))
      const stackX = mobile ? offset * -24 : offset * -330
      const stackY = mobile ? offset * -145 : offset * 20
      const exitX = mobile ? offset * 40 : offset * 210
      setVars(card, {
        tx: `${mix(stackX, 0, delayed) + exit * exitX + pointerX * 0.035}px`,
        ty: `${mix(stackY, 0, delayed) - exit * (70 + Math.abs(offset) * 24) + pointerY * 0.02}px`,
        tz: `${mix(-720 - Math.abs(offset) * 90, 34 - Math.abs(offset) * 18, delayed) - exit * 560}px`,
        rx: `${mix(offset * -10, pointerY * -0.015, delayed) - exit * 12 + speedTilt * 0.25}deg`,
        ry: `${mix(offset * 24, pointerX * 0.015, delayed) + exit * offset * 22 + speedTilt * 0.5}deg`,
        rz: `${exit * offset * 3}deg`,
        scale: mix(0.68, 1, delayed) - exit * 0.12,
        alpha: sceneAlpha * delayed,
        blur: `${(1 - delayed) * 13 + exit * 6}px`,
      })
      card.style.pointerEvents = sceneAlpha > 0.8 ? 'auto' : 'none'
      card.style.zIndex = String(10 - Math.abs(offset))
    })
  }

  function updateTechStatus(index, focus) {
    if (index !== activeTechIndex) {
      activeTechIndex = index
      techCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(techCards.length).padStart(2, '0')}`
      techName.textContent = techCategories[index]?.name || ''
    }
    techSequence.style.setProperty('--tech-progress', `${((focus + 1) / techCards.length) * 100}%`)
  }

  function animateTech(progress) {
    const enter = ease(range(progress, 0.31, 0.38))
    const exit = ease(range(progress, 0.79, 0.88))
    const sceneAlpha = enter * (1 - exit)
    const mobile = window.innerWidth <= 700
    const gallery = ease(range(progress, 0.395, 0.45))
    const visibleCount = Math.min(mobile ? 1 : 2, techCards.length)
    const cardWidth = window.innerWidth * (mobile ? 0.8 : 0.4)
    const cardGap = window.innerWidth * (mobile ? 0.04 : 0.08)
    const deckWidth = cardWidth * visibleCount + cardGap * Math.max(0, visibleCount - 1)
    const leftX = (window.innerWidth - deckWidth) / 2
    const rightX = leftX + cardWidth + cardGap
    const maxFocus = Math.max(0, techCards.length - visibleCount)
    const rawFocus = ease(range(progress, 0.45, 0.79)) * maxFocus
    const focusIndex = Math.min(Math.floor(rawFocus), Math.max(0, maxFocus - 1))
    const focusPhase = rawFocus - focusIndex
    // 每组保留明确的居中停留区间，只在中段执行原有卡片接替动画。
    const focus = maxFocus === 0
      ? 0
      : focusIndex + ease(range(focusPhase, 0.08, 0.72))
    const nearest = gallery < 0.5 ? 0 : clamp(Math.round(focus), 0, techCards.length - 1)
    const cardStep = cardWidth + cardGap
    const speedTilt = clamp(scrollVelocity * 1500, -5, 5)
    setVars(techTitle, {
      tx: `${gallery * -cardStep}px`,
      ty: `${mix(20, 0, enter) - exit * 64}px`,
      tz: `${mix(-180, 0, enter) - exit * 580}px`,
      rx: `${mix(8, 0, enter) - exit * 10}deg`,
      ry: `${exit * -13}deg`,
      scale: mix(0.92, 1, enter) - exit * 0.12,
      alpha: sceneAlpha * (1 - gallery),
      blur: `${(1 - enter) * 7 + exit * 6}px`,
    })

    techCards.forEach((card, index) => {
      let cardX
      let cardY
      let cardAlpha
      let cardScale
      let cardDepth = 0
      let cardRotateY = 0
      let cardLayer = 20
      if (mobile) {
        const delta = index - ease(range(progress, 0.4, 0.79)) * maxFocus
        const arrival = ease(clamp(1 - Math.max(0, delta)))
        cardX = leftX + delta * cardStep
        cardY = (1 - arrival) * 180
        cardAlpha = delta < 0 ? clamp(1 + delta) : 1
        cardScale = mix(0.92, 1, arrival)
      } else if (gallery < 0.999) {
        if (index === 0) {
          cardX = mix(rightX, leftX, gallery)
          cardY = 0
          cardAlpha = 1
          cardScale = 1
        } else if (index === 1) {
          cardX = mix(rightX + cardStep * 0.42, rightX, gallery)
          cardY = mix(190, 0, gallery)
          cardAlpha = gallery
          cardScale = mix(0.94, 1, gallery)
        } else {
          cardX = rightX
          cardY = 190
          cardAlpha = 0
          cardScale = 0.94
        }
      } else {
        const delta = index - focus
        const arrival = ease(clamp(2 - delta))
        const departure = ease(clamp(1 + delta))
        cardX = leftX + delta * cardStep
        cardY = delta > 1 ? mix(180, 0, arrival) : 0
        cardAlpha = Math.min(arrival, departure)
        cardScale = delta > 1 ? mix(0.94, 1, arrival) : mix(0.965, 1, departure)
        cardDepth = -Math.max(0, Math.abs(delta - 0.5) - 0.5) * 70
        cardRotateY = clamp((delta - 0.5) * -2.4 + speedTilt * 0.32, -5, 5)
        cardLayer = 30 - Math.round(Math.abs(delta - 0.5) * 2)
      }
      const active = cardAlpha > 0.05 && exit < 0.7
      setVars(card, {
        tx: `${cardX}px`,
        ty: `${cardY + (1 - enter) * 110 - exit * 40}px`,
        tz: `${cardDepth - exit * 420}px`,
        rx: `${exit * -7}deg`,
        ry: `${cardRotateY - exit * 5}deg`,
        rz: '0deg',
        scale: cardScale,
        alpha: sceneAlpha * cardAlpha,
        blur: `${exit * 4}px`,
      })
      card.dataset.active = String(active)
      card.style.zIndex = String(cardLayer)
      card.style.pointerEvents = sceneAlpha > 0.72 && cardAlpha > 0.7 ? 'auto' : 'none'
    })

    setVars(techSequence, {
      tx: `${leftX}px`,
      ty: `${mix(16, 0, enter) + exit * 24}px`,
      tz: `${mix(-80, 0, enter) - exit * 300}px`,
      alpha: sceneAlpha,
    })
    updateTechStatus(nearest, Math.min(focus + 1, techCards.length - 1))
  }

  function animateFriends(progress) {
    const enter = ease(range(progress, 0.8, 0.91))
    const footerIn = ease(range(progress, 0.94, 1))
    const mobile = window.innerWidth <= 700
    const speedTilt = clamp(scrollVelocity * 1400, -7, 7)
    setVars(friendTitle, {
      tx: '-50%',
      ty: `${mix(26, 0, enter)}px`,
      tz: `${mix(-200, 0, enter)}px`,
      rx: `${mix(9, 0, enter)}deg`,
      scale: mix(0.9, 1, enter),
      alpha: enter,
      blur: `${(1 - enter) * 8}px`,
    })
    friends.forEach((card, index) => {
      const column = mobile ? index % 2 : index
      const row = mobile ? Math.floor(index / 2) : 0
      const center = mobile ? 0.5 : 1.5
      const stackX = (center - column) * (mobile ? 170 : 280)
      const stackY = mobile ? (0.5 - row) * 198 : (index - 1.5) * 34
      const delayed = ease(range(enter, index * 0.055, 0.72 + index * 0.055))
      setVars(card, {
        tx: `${mix(stackX, 0, delayed) + pointerX * 0.022}px`,
        ty: `${mix(stackY, 0, delayed) + pointerY * 0.016}px`,
        tz: `${mix(-760 - index * 40, 24, delayed)}px`,
        rx: `${mix((index - 1.5) * -12, pointerY * -0.014, delayed) + speedTilt * 0.22}deg`,
        ry: `${mix((index - 1.5) * 19, pointerX * 0.014, delayed) + speedTilt * 0.42}deg`,
        rz: `${mix((index - 1.5) * -2, 0, delayed)}deg`,
        scale: mix(0.68, 1, delayed),
        alpha: delayed,
        blur: `${(1 - delayed) * 13}px`,
      })
      card.style.pointerEvents = delayed > 0.82 ? 'auto' : 'none'
      card.style.zIndex = String(10 + index)
    })
    setVars(footer, { ty: `${mix(18, 0, footerIn)}px`, alpha: footerIn })
  }

  function updateChapter(progress) {
    activeChapter.value = progress < 0.13 ? 0 : progress < 0.34 ? 1 : progress < 0.84 ? 2 : 3
  }

  // 手机端直接设置每个 step 的最终 CSS 状态，不依赖桌面 progress 模型
  renderMobile = function renderMobile() {
    // Hero
    const heroShow = mobileStep === 0
    setVars(heroElement, {
      tx: '0px', ty: '0px', tz: '0px',
      rx: '0deg', ry: '0deg', rz: '0deg',
      scale: heroShow ? 1 : 0.84,
      alpha: heroShow ? 1 : 0,
      blur: '0px',
    })
    if (heroElement) heroElement.style.pointerEvents = heroShow ? 'auto' : 'none'

    // Tips
    const tipsShow = mobileStep === 1
    tipCards.forEach(card => {
      setVars(card, {
        tx: '0px', ty: '0px', tz: '0px',
        rx: '0deg', ry: '0deg', rz: '0deg',
        scale: tipsShow ? 1 : 0.9,
        alpha: tipsShow ? 1 : 0,
        blur: '0px',
      })
      card.style.pointerEvents = tipsShow ? 'auto' : 'none'
      card.style.zIndex = '10'
    })

    // Tech 场景
    const techShow = mobileStep >= 2 && mobileStep <= 1 + techCategories.length
    const activeCardIndex = techShow ? mobileStep - 2 : -1

    setVars(techTitle, {
      tx: '0px',
      ty: techShow ? '0px' : '20px',
      tz: techShow ? '0px' : '-180px',
      rx: techShow ? '0deg' : '8deg',
      ry: '0deg', rz: '0deg',
      scale: techShow ? 1 : 0.92,
      alpha: techShow ? 1 : 0,
      blur: '0px',
    })

    techCards.forEach((card, index) => {
      const isActive = index === activeCardIndex
      setVars(card, {
        tx: '0px',
        ty: techShow ? '0px' : '110px',
        tz: '0px',
        rx: '0deg', ry: '0deg', rz: '0deg',
        scale: isActive ? 1 : 0.96,
        alpha: isActive ? 1 : 0,
        blur: '0px',
      })
      card.dataset.active = String(isActive)
      card.style.pointerEvents = isActive ? 'auto' : 'none'
      card.style.zIndex = isActive ? '30' : '20'
    })

    if (techSequence) {
      techSequence.style.setProperty('--tx', '0px')
      techSequence.style.transform = 'translateX(-50%)'
      if (techShow && activeCardIndex >= 0 && activeCardIndex < techCategories.length) {
        techCounter.textContent = `${String(activeCardIndex + 1).padStart(2, '0')} / ${String(techCategories.length).padStart(2, '0')}`
        techName.textContent = techCategories[activeCardIndex]?.name || ''
      }
    }

    // Friends
    const friendsShow = mobileStep === 1 + techCategories.length + 1
    setVars(friendTitle, {
      tx: '-50%', ty: friendsShow ? '0px' : '26px',
      tz: friendsShow ? '0px' : '-200px',
      rx: friendsShow ? '0deg' : '9deg',
      ry: '0deg', rz: '0deg',
      scale: friendsShow ? 1 : 0.9,
      alpha: friendsShow ? 1 : 0,
      blur: '0px',
    })
    friends.forEach(card => {
      setVars(card, {
        tx: '0px', ty: '0px', tz: '0px',
        rx: '0deg', ry: '0deg', rz: '0deg',
        scale: friendsShow ? 1 : 0.68,
        alpha: friendsShow ? 1 : 0,
        blur: '0px',
      })
      card.style.pointerEvents = friendsShow ? 'auto' : 'none'
    })
    setVars(footer, { ty: friendsShow ? '0px' : '18px', alpha: friendsShow ? 1 : 0 })

    // 进度条
    const maxStep = 1 + techCategories.length + 1
    progressBar.style.transform = `scaleY(${Math.max(0.02, mobileStep / maxStep)})`
    activeChapter.value = mobileStep === 0 ? 0 : mobileStep === 1 ? 1 : mobileStep <= 1 + techCategories.length ? 2 : 3
  }

  function render() {
    if (isMobile()) {
      renderMobile()
    } else if (!reducedMotion) {
      currentProgress += (targetProgress - currentProgress) * 0.072
      if (Math.abs(targetProgress - currentProgress) < 0.00008) currentProgress = targetProgress
      scrollVelocity += ((currentProgress - previousProgress) - scrollVelocity) * 0.2
      scrollVelocity *= 0.94
      previousProgress = currentProgress
      animateHero(currentProgress)
      animateTips(currentProgress)
      animateTech(currentProgress)
      animateFriends(currentProgress)
      updateChapter(currentProgress)
      progressBar.style.transform = `scaleY(${Math.max(0.02, currentProgress)})`
    }
    renderFrameId = requestAnimationFrame(render)
  }

  window.addEventListener('scroll', updateTargetProgress, { passive: true })
  window.addEventListener('resize', updateTargetProgress, { passive: true })
  stage.addEventListener('pointermove', onStagePointerMove)
  stage.addEventListener('pointerleave', onStagePointerLeave)

  stage.addEventListener('touchstart', onTouchStart, { passive: true })
  stage.addEventListener('touchmove', onTouchMove, { passive: false })
  stage.addEventListener('touchend', onTouchEnd, { passive: true })
  stage.addEventListener('touchcancel', onTouchCancel, { passive: true })

  updateTargetProgress()
  prepareEntrance()
  renderFrameId = requestAnimationFrame(render)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateTargetProgress)
  window.removeEventListener('resize', updateTargetProgress)
  const stage = homeMotionRef.value?.querySelector('.motion-stage')
  if (stage) {
    stage.removeEventListener('touchstart', onTouchStart)
    stage.removeEventListener('touchmove', onTouchMove)
    stage.removeEventListener('touchend', onTouchEnd)
    stage.removeEventListener('touchcancel', onTouchCancel)
  }
  if (mobileLockTimer) clearTimeout(mobileLockTimer)
  cancelAnimationFrame(renderFrameId)
  cancelAnimationFrame(loaderFrameId)
  timeoutIds.forEach(id => clearTimeout(id))
  document.documentElement.classList.remove('home-motion-active', 'home-motion-loading', 'welcome-blocking')
})
</script>

<template>
  <div ref="homeMotionRef" class="home-motion" :class="introReady ? 'intro-ready' : 'intro-pending'">
    <div v-if="showLoader" ref="loaderRef" class="site-loader" role="status" aria-label="页面加载中">
      <div class="loader-curtain" aria-hidden="true"></div>
      <span class="loader-seed" aria-hidden="true"></span>
      <span class="loader-mark loader-mark-tl" aria-hidden="true"></span>
      <span class="loader-mark loader-mark-tr" aria-hidden="true"></span>
      <span class="loader-mark loader-mark-bl" aria-hidden="true"></span>
      <span class="loader-mark loader-mark-br" aria-hidden="true"></span>
      <div class="loader-sheet" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
        <span class="loader-fold loader-fold-x"></span>
        <span class="loader-fold loader-fold-y"></span>
      </div>
      <div class="loader-core">
        <div class="loader-frame" aria-hidden="true">
          <span class="loader-progress-border">
            <i class="loader-progress-top"></i>
            <i class="loader-progress-right"></i>
            <i class="loader-progress-bottom"></i>
            <i class="loader-progress-left"></i>
          </span>
          <span class="loader-slash"></span>
        </div>
        <div class="loader-wordmark"><span>BLOG /</span><strong>{{ loaderName }}</strong></div>
      </div>
      <output ref="loaderCountRef" class="loader-count" aria-live="polite">0</output>
    </div>

    <main id="top" class="scroll-track">
      <div class="motion-stage">
        <div class="stage-grid" aria-hidden="true"></div>
        <div class="ambient ambient-a" aria-hidden="true"></div>
        <div class="ambient ambient-b" aria-hidden="true"></div>
        <div class="stage-axis" aria-hidden="true"><span></span><i></i></div>

        <section class="scene hero-scene" aria-label="首页介绍">
          <div class="hero-cluster motion-item">
            <div class="hero-layer hero-logo"><span class="logo-halo"></span><img :src="heroImage" :alt="`${hero.name || ''} Logo`" loading="eager" /></div>
            <div class="hero-layer hero-copy">
              <h1><span>{{ hero.name }}</span><strong>{{ hero.text }}</strong></h1>
              <p>{{ hero.tagline }}</p>
            </div>
            <div class="hero-layer hero-actions">
              <a v-for="action in hero.actions || []" :key="action.text" class="button" :class="{ 'brand-button': action.theme === 'brand' }" :href="action.link">{{ action.text }}</a>
            </div>
          </div>
        </section>

        <section class="scene tips-scene" aria-label="学习提示">
          <article v-for="(tip, index) in tips" :key="tip.title" class="glass-card tip-card motion-item" :data-tip="index">
            <div class="card-shine"></div><span class="tip-icon" :class="tip.tone">{{ tip.icon }}</span><div><h2>{{ tip.title }}</h2><p>{{ tip.text }}</p></div>
          </article>
        </section>

        <section id="tech" class="scene tech-scene" aria-label="技术栈">
          <header class="scene-title motion-item"><h2><span>技术</span><span>栈</span></h2><p>Technologies I work with</p></header>
          <div class="tech-deck">
            <article v-for="(category, index) in techCategories" :key="category.name" class="glass-card tech-card motion-item" :data-tech="index" :style="{ '--accent': category.accent }" @click="onTechCardClick($event, index)">
              <div class="card-shine"></div>
              <h3><i></i>{{ category.name }}<small>{{ category.desc }}</small></h3>
              <div class="tech-grid">
                <a v-for="tech in category.items" :key="tech.name" :href="tech.link" target="_blank" rel="noopener">
                  <img v-if="tech.icon" :src="tech.icon" alt="" @error="onImageError($event, tech.name)" /><b v-else>{{ tech.fallback }}</b>{{ tech.name }}
                </a>
              </div>
            </article>
          </div>
          <div class="tech-sequence motion-item" aria-live="polite"><span id="techCounter">01 / 05</span><i aria-hidden="true"></i><strong id="techName">后端基础</strong></div>
        </section>

        <section class="scene friends-scene" aria-label="友情链接">
          <header class="scene-title motion-item"><h2>友情链接</h2><p>Friendly Links</p></header>
          <div class="friends-grid">
            <a v-for="(friend, index) in friendLinks" :key="friend.name" class="glass-card friend-card motion-item" :data-friend="index" :style="{ '--friend': friend.color }" :href="friend.link" target="_blank" rel="noopener">
              <div class="card-shine"></div><i>{{ friend.icon }}</i><h3>{{ friend.name }}</h3><p>{{ friend.desc }}</p><span>访问主页 →</span>
            </a>
          </div>
        </section>

        <footer class="scene footer-scene motion-item"><p>{{ copyright }}</p></footer>
        <div class="progress-rail" aria-hidden="true"><span></span></div>
        <nav class="chapter-rail" aria-label="首页章节">
          <button v-for="(chapter, index) in chapters" :key="chapter.label" type="button" :class="{ 'is-active': activeChapter === index }" @click="scrollToProgress(chapter.progress)">{{ chapter.label }}</button>
        </nav>
      </div>
    </main>
  </div>
</template>

<style scoped src="../styles/_home-motion-base.css"></style>
<style scoped src="../styles/_home-motion-loader.css"></style>
<style scoped src="../styles/_home-motion-scenes.css"></style>
<style scoped src="../styles/_home-motion-sections.css"></style>
<style scoped src="../styles/_home-motion-responsive.css"></style>
