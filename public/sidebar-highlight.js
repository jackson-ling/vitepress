(function() {
  var HIGHLIGHT_CLASS = 'sidebar-active-highlight'

  function normalizePath(path) {
    return decodeURI(path)
      .replace(/[?#].*$/, '')
      .replace(/(?:(^|\/)index)?\.(?:md|html)$/, '$1')
  }

  function highlightActiveSidebar() {
    var els = document.querySelectorAll('.' + HIGHLIGHT_CLASS)
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove(HIGHLIGHT_CLASS)
    }
    var currentPath = normalizePath(window.location.pathname)
    var sidebarLinks = document.querySelectorAll('.VPSidebarItem.is-link a[href]')
    for (var j = 0; j < sidebarLinks.length; j++) {
      var link = sidebarLinks[j]
      var linkPath
      try {
        linkPath = normalizePath(new URL(link.href).pathname)
      } catch (e) {
        linkPath = normalizePath(link.getAttribute('href') || '')
      }
      if (linkPath === currentPath) {
        var sidebarItem = link.closest('.VPSidebarItem')
        if (sidebarItem) {
          sidebarItem.classList.add(HIGHLIGHT_CLASS)
        }
        break
      }
    }
  }

  function setup() {
    highlightActiveSidebar()
    var sidebar = document.querySelector('.VPSidebar')
    if (sidebar) {
      var observer = new MutationObserver(highlightActiveSidebar)
      observer.observe(sidebar, { childList: true, subtree: true })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup)
  } else {
    setup()
  }

  // Also re-run on SPA navigation
  window.addEventListener('popstate', function() {
    setTimeout(highlightActiveSidebar, 100)
  })
})()
