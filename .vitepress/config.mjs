/** VitePress 配置组合入口。具体维护位置见 CLAUDE.md 的常见需求索引。 */
import { defineConfig } from 'vitepress'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'
import {
  createDevFirstPaintPlugin,
  firstPaintCSS,
  firstPaintScript,
} from './config/first-paint.mjs'
import { markdown } from './config/markdown.mjs'
import { createThemeConfig } from './config/theme.mjs'

// 自定义域名部署在根路径；导航和静态资源 URL 依赖此值。
const base = '/'

export default defineConfig({
  base,
  lang: 'zh-cn',
  title: 'jackson凌の文档站',
  description: 'A VitePress Site',
  // README.md 只用于 GitHub 项目说明，不参与站点构建。
  srcExclude: ['README.md'],
  head: [
    ['link', { rel: 'icon', href: `${base}标签logo.png` }],
    ['script', {}, firstPaintScript],
    ['style', {}, firstPaintCSS],
  ],
  vite: {
    plugins: [
      pagefindPlugin({
        customSearchQuery: chineseSearchOptimize,
      }),
      createDevFirstPaintPlugin(),
    ],
  },
  themeConfig: createThemeConfig(base),
  markdown,
})
