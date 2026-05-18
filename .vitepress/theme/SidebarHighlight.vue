<script setup>
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const HIGHLIGHT_CLASS = 'sidebar-active-highlight'
const route = useRoute()

function normalizePath(path) {
  return decodeURI(path)
    .replace(/[?#].*$/, '')
    .replace(/(?:(^|\/)index)?\.(?:md|html)$/, '$1')
}

function highlightActiveSidebar() {
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
    el.classList.remove(HIGHLIGHT_CLASS)
  })
  const currentPath = normalizePath(window.location.pathname)
  const sidebarLinks = document.querySelectorAll('.VPSidebarItem.is-link a')
  for (const link of sidebarLinks) {
    const linkPath = normalizePath(link.getAttribute('href') || '')
    if (linkPath === currentPath) {
      const sidebarItem = link.closest('.VPSidebarItem')
      if (sidebarItem) {
        sidebarItem.classList.add(HIGHLIGHT_CLASS)
      }
      break
    }
  }
}

let observer = null

function setupObserver() {
  const sidebar = document.querySelector('.VPSidebar')
  if (!sidebar) {
    requestAnimationFrame(setupObserver)
    return
  }
  highlightActiveSidebar()
  observer = new MutationObserver(highlightActiveSidebar)
  observer.observe(sidebar, { childList: true, subtree: true })
}

onMounted(() => {
  setupObserver()
})

watch(
  () => route.path,
  () => nextTick(highlightActiveSidebar)
)

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template></template>
