export const SITE_URL = 'https://jacksonling.cn'
export const SITE_NAME = 'jackson凌の文档站'
export const SITE_DESCRIPTION =
  'Jackson 凌的个人技术文档站，记录 Java 后端、Spring Boot、数据库、AI Agent 与项目实践。'

const SITEMAP_EXCLUDED_PATHS = new Set(['/CLAUDE.html'])

export function filterSitemapItems(items) {
  return items.filter(({ url }) => {
    const pathname = new URL(url, SITE_URL).pathname
    return !SITEMAP_EXCLUDED_PATHS.has(pathname)
  })
}

export function toCanonicalUrl(page) {
  const normalizedPage = page.replace(/\\/g, '/').replace(/^\/+/, '')
  let pathname = normalizedPage.replace(/\.md$/, '.html')

  if (pathname === 'index.html') {
    pathname = ''
  } else if (pathname.endsWith('/index.html')) {
    pathname = pathname.slice(0, -'index.html'.length)
  }

  return `${SITE_URL}/${encodeURI(pathname)}`
}

export function createSeoHead({ page, title, description }) {
  const canonicalUrl = toCanonicalUrl(page)
  const pageTitle = title || SITE_NAME
  const pageDescription = description || SITE_DESCRIPTION
  const pageType = page === 'index.md' ? 'website' : 'article'

  return [
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['meta', { property: 'og:type', content: pageType }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:title', content: pageTitle }],
    ['meta', { property: 'og:description', content: pageDescription }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: pageTitle }],
    ['meta', { name: 'twitter:description', content: pageDescription }],
  ]
}
