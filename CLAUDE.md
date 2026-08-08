# CLAUDE.md

## 项目概览

这是一个基于 VitePress 的中文技术知识库。仓库根目录就是内容根目录：`index.md` 对应首页，`docs/**/*.md` 对应文章，`public/` 中的资源以根路径发布。`README.md` 仅用于 GitHub 项目说明，并通过 `srcExclude` 排除在网站构建之外。

项目使用 Node.js 24.9.0（`.nvmrc`）和 npm。`package-lock.json` 是依赖版本来源，CI 使用 `npm ci`；不要更换包管理器或直接修改 `.vitepress/dist`。

## 常用命令

所有命令都在仓库根目录运行，侧边栏生成器依赖 `process.cwd()`。

```bash
npm install
npm ci
npm run docs:dev
npm run docs:build
npm run docs:preview
```

仓库没有测试、Lint 或格式化脚本。结构或配置修改至少执行语法/引用检查和 `git diff --check`，最终执行 `npm run docs:build`。构建内存不足时设置 `NODE_OPTIONS=--max-old-space-size=5120`。

## 运行结构

- `.vitepress/config.mjs`：VitePress 配置组合入口，组装 Pagefind、首屏资源、主题和 Markdown。
- `.vitepress/config/theme.mjs`：默认主题配置，集中维护 nav、sidebar、社交链接和页脚。
- `.vitepress/config/first-paint.mjs`：dev/production 共用的主题首帧与首页背景占位，防止 hydration 前白闪。
- `.vitepress/config/markdown.mjs`：Shiki、中文容器标签和 `:::timeline` 渲染。
- `.vitepress/gen_sidebar.js`：按传入目录递归生成部分侧边栏条目。
- `.vitepress/theme/index.js`：继承默认主题，加载全局样式并挂载自定义 Layout。
- `.vitepress/theme/Layout.vue`：挂载默认 Layout、首页 `HomeMotion`、全局 `SiteEnhancer`，处理路由过渡和图片懒加载。
- `.vitepress/theme/components/HomeMotion.vue`：首页 Loader、桌面滚动动画、手机离散分页和触摸手势。
- `.vitepress/theme/home-content.js`：TIP、技术栈、友情链接和章节导航等首页静态内容。
- `.vitepress/theme/components/SiteEnhancer.vue`：阅读进度、回顶、侧边栏高亮、PhotoSwipe 和 timeline 生命周期。

根 `index.html` 不是日常维护入口：当前 dev HTML 由 VitePress 自身模板生成，首屏脚本必须通过 `config/first-paint.mjs` 注入。该文件暂时保留作为低风险兼容入口，不要在其中新增站点逻辑。

## 常见需求修改位置

| 需求 | 修改入口 |
| --- | --- |
| 首页 Hero 文字、Logo、按钮 | `index.md`；页脚读取 `config/theme.mjs` |
| TIP、技术栈、友情链接、章节导航 | `.vitepress/theme/home-content.js` |
| 首屏 Loader 逻辑 | `HomeMotion.vue` 的 `prepareEntrance()` / `finishEntrance()` |
| 首屏 Loader 样式 | `styles/_home-motion-loader.css` |
| 首屏背景、亮暗首帧、防白闪 | `config/first-paint.mjs` 与 `styles/_home-motion-base.css` |
| 桌面滚动动画、pointer 效果 | `HomeMotion.vue` 的桌面渲染函数 |
| 手机首页分页、上下滑和横向手势 | `HomeMotion.vue` 的 `mobileGoTo()`、`renderMobile()` 和 touch 处理 |
| 首页舞台、Hero、TIP 样式 | `styles/_home-motion-scenes.css` |
| 技术栈、友情链接、进度导航样式 | `styles/_home-motion-sections.css` |
| 首页断点和 reduced motion | `styles/_home-motion-responsive.css`，必须保持最后加载 |
| nav、sidebar、社交链接、页脚 | `config/theme.mjs`；自动目录规则在 `gen_sidebar.js` |
| 手机导航 | `styles/_nav.css` |
| 文章排版 | `styles/_doc.css` |
| 文章布局、侧边栏和路由过渡样式 | `styles/_layout.css` |
| 阅读进度、回顶、图片预览 | `SiteEnhancer.vue` 与 `styles/_components.css` |
| PhotoSwipe 行为 | `SiteEnhancer.vue` 的 `createImageLightbox()` |
| timeline 渲染、样式、入场 | `config/markdown.mjs`、`styles/_timeline.css`、`SiteEnhancer.vue` |
| 路由切换动画与图片懒加载 | `Layout.vue`；对应样式在 `styles/_layout.css` |
| Markdown、Shiki、自定义容器 | `config/markdown.mjs` |
| Pagefind 中文搜索 | `.vitepress/config.mjs` 中的 `pagefindPlugin` |

## 首页约束

`HomeMotion.vue` 的 DOM 引用、requestAnimationFrame、桌面场景函数和手机状态机刻意保留在同一组件中，避免跨文件传递 DOM 和同步动画时序。只修改内容时不要进入该组件，改 `home-content.js`。

首页 scoped CSS 按以下顺序加载，顺序就是原有 cascade 顺序：

1. `_home-motion-base.css`
2. `_home-motion-loader.css`
3. `_home-motion-scenes.css`
4. `_home-motion-sections.css`
5. `_home-motion-responsive.css`

Loader 的 JavaScript 时长必须与 Loader CSS 动画保持一致。`homepage-motion-intro-played-v3` 控制同一 session 是否重复播放；`welcome-overlay-shown` 虽是历史命名，但目前仍是首屏脚本与 `HomeMotion` 的有效契约，不要单独删除或改名。

## 内容、搜索与部署

VitePress 将 Markdown 路径直接映射为 URL。新增、重命名或移动文章时，需要同时检查 `config/theme.mjs` 中的手动 nav/sidebar 和 `gen_sidebar.js` 自动生成范围，不能改变既有 URL 或侧边栏顺序。

Pagefind 在生产构建阶段生成静态索引，并使用 `chineseSearchOptimize`。时间线由 Markdown 容器输出 `.site-timeline`，再由主题样式与 `SiteEnhancer` 增强。

`.github/workflows/deploy.yml` 使用 Node.js 24.9.0，执行 `npm ci` 和 `npm run docs:build`，再部署 `.vitepress/dist` 到 GitHub Pages。
