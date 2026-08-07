<!--
 * 自定义主题布局入口
 *
 * 保留默认导航、主题切换、路由过渡和图片懒加载，仅替换首页内容区域。
 -->
<script setup>
import { nextTick, onMounted, onUnmounted, provide } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeMotion from './components/HomeMotion.vue'
import SiteEnhancer from './components/SiteEnhancer.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()
const router = useRouter()

provide('toggle-appearance', () => {
  isDark.value = !isDark.value
})

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
    window.setTimeout(cleanup, 300)
  })
}

function applyLazyLoading(root) {
  root.querySelectorAll('img:not([loading])').forEach(image => {
    image.setAttribute('loading', 'lazy')
  })
}

let observer

onMounted(() => {
  document.documentElement.classList.remove('welcome-blocking')
  router.onBeforeRouteChange = onBeforeRouteChange
  router.onAfterRouteChanged = onAfterRouteChanged
  applyLazyLoading(document.body)
  observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
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
    <template #home-hero-before>
      <HomeMotion />
    </template>
  </Layout>
  <SiteEnhancer />
</template>

<style>
.custom-block {
  padding-top: 6px !important;
}

.custom-block .custom-block-title {
  margin: 0 !important;
}

.custom-block .custom-block-title + p,
.custom-block .custom-block-title + blockquote,
.custom-block .custom-block-title + h2,
.custom-block .custom-block-title + h3,
.custom-block .custom-block-title + h4 {
  margin-top: 4px !important;
}

.custom-block blockquote {
  margin-top: 4px !important;
  padding-top: 4px !important;
}

.custom-block blockquote h2,
.custom-block blockquote h3,
.custom-block blockquote h4 {
  margin-top: 2px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.VPSwitchAppearance .check .icon {
  top: -2px;
}
</style>
