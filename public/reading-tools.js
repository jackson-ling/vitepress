(() => {
  // Skip home page
  function isHome() {
    return !!document.querySelector('.VPHome')
  }

  // Create progress bar
  const progressEl = document.createElement('div')
  progressEl.className = 'site-progress'
  progressEl.setAttribute('aria-hidden', 'true')
  progressEl.innerHTML = '<span></span>'

  // Create back-to-top button
  const toolsEl = document.createElement('div')
  toolsEl.className = 'reading-tools'
  toolsEl.setAttribute('aria-label', 'Reading tools')
  toolsEl.innerHTML = `
    <button class="reading-tools__button" type="button" aria-label="回到顶部" title="回到顶部">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.25 5.25 11l1.5 1.5L11 8.25V20h2V8.25l4.25 4.25 1.5-1.5L12 4.25Z" />
      </svg>
    </button>
  `

  let ticking = false
  let showTools = false

  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - window.innerHeight
    const progress = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0

    // Update progress bar
    const span = progressEl.querySelector('span')
    if (span) span.style.width = progress + '%'

    // Update button progress ring
    toolsEl.style.setProperty('--reading-progress', (progress * 3.6) + 'deg')

    // Show/hide tools
    const shouldShow = !isHome() && scrollTop > 360
    if (shouldShow !== showTools) {
      showTools = shouldShow
      toolsEl.style.opacity = showTools ? '1' : '0'
      toolsEl.style.pointerEvents = showTools ? 'auto' : 'none'
      toolsEl.style.transform = showTools ? 'translateY(0)' : 'translateY(8px)'
    }

    // Toggle progress bar visibility
    progressEl.style.display = isHome() ? 'none' : 'block'

    ticking = false
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function init() {
    // Remove existing elements if any
    document.querySelectorAll('.site-progress, .reading-tools').forEach(el => el.remove())

    document.body.appendChild(progressEl)
    document.body.appendChild(toolsEl)

    // Initial state
    toolsEl.style.opacity = '0'
    toolsEl.style.pointerEvents = 'none'
    toolsEl.style.transform = 'translateY(8px)'
    toolsEl.style.transition = 'opacity 0.16s ease, transform 0.16s ease'

    // Bind events
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    toolsEl.querySelector('button').addEventListener('click', scrollToTop)

    // Initial update
    requestUpdate()
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Re-init on VitePress route change
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(() => {
      requestUpdate()
    })
    observer.observe(document.body, { childList: true, subtree: false })
  }
})()
