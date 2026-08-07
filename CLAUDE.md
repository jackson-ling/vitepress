# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

这是一个基于 VitePress 的个人中文技术知识库网站。仓库根目录就是 VitePress 内容根目录：`index.md` 对应首页，`docs/**/*.md` 对应文章路由，`public/` 中的文件会作为根路径静态资源发布。`README.md` 只用于 GitHub 项目说明，并通过 `srcExclude` 排除在网站构建之外。

项目使用 Node.js 24.9.0（`.nvmrc`），`package.json` 要求 `>=24.0.0 <25.0.0`。使用 npm，`package-lock.json` 是依赖版本的权威来源；CI 使用 `npm ci`，不要切换到 Node 18。

## 常用命令

所有命令都应在仓库根目录运行。`.vitepress/gen_sidebar.js` 使用 `process.cwd()` 解析内容路径，在其他目录执行可能生成空侧边栏。

```bash
npm install              # 安装或更新依赖
npm ci                   # 按 lockfile 复现 CI 依赖
npm run docs:dev         # 启动开发服务器，通常为 http://localhost:5173
npm run docs:build       # 构建生产网站到 .vitepress/dist
npm run docs:preview     # 预览生产构建
```

仓库没有测试运行器、Lint 脚本、格式化脚本或项目测试文件，因此没有可运行的单个测试命令。内容、配置和主题修改的主要验证是 `npm run docs:build`；窄范围样式修改至少执行 `git diff --check`。本地构建内存不足时可使用：

```bash
NODE_OPTIONS=--max-old-space-size=5120 npm run docs:build
```

## 架构

### 内容、路由与导航

VitePress 将 Markdown 路径直接映射为 URL，首页为 `/`，文章位于 `/docs/...`。站点元数据、`base: '/'`、顶部导航、手动侧边栏、搜索、Markdown 渲染器和 Vite 插件集中在 `.vitepress/config.mjs`。导航栏在 `themeConfig.nav` 中手动维护；侧边栏按路由前缀匹配页面，部分分组由配置手动定义，部分内容通过 `setSidebarDefault(...)` 展开生成。

`.vitepress/gen_sidebar.js` 递归读取传入目录，只保留 `.md` 文件，过滤 `WHITE_LIST` 中的名称，并按文件名中的第一个数字自然排序。新增、重命名或移动文章可能改变侧边栏顺序和链接；修改路由边界时要同步检查 `.vitepress/config.mjs` 的手动侧边栏和导航链接。

### 自定义主题与页面生命周期

`.vitepress/theme/index.js` 继承 VitePress 默认主题，加载 `.vitepress/theme/styles/index.css`，并用 `Layout.vue` 替换默认布局。`styles/index.css` 只负责按职责导入 `_tokens.css`、`_base.css`、`_nav.css`、`_layout.css`、`_doc.css`、`_components.css` 和 `_timeline.css`；具体样式应修改对应分片，不修改生成输出或汇总导入文件。

`Layout.vue` 保留 VitePress 默认布局，同时在首页内容槽挂载 `HomeMotion`，并挂载 `SiteEnhancer`。它还负责路由切换动画钩子、全局图片懒加载和通过 provide/inject 共享的遮罩状态与外观切换能力。

首页入场由 `HomeMotion.vue` 独立控制：组件通过 `sessionStorage` 判断是否播放 loader，使用 `requestAnimationFrame` 驱动桌面滚动动画，使用 `mobileStep`、`mobileGoTo`、`renderMobile` 和 touch 事件处理手机端离散分页。loader 通过 `.site-loader`、`loader-curtain`、`loader-sheet` 的 CSS 动画完成全屏交接；`finishEntrance()` 负责设置会话标记、移除 `home-motion-loading` / `entrance-bg` 并隐藏 loader。修改入场交接时，要同时检查 `HomeMotion.vue` 与 `_home-motion.css` 的动画结束时间和遮罩状态，不要改动手机分页状态机或桌面动画作为无关修复。

`WelcomeOverlay.vue` 是独立的首次欢迎遮罩，按首页路由和 `sessionStorage` 决定是否显示，使用事件方式锁定滚动而不是 `overflow: hidden`，退出时通过 `overlayState.close()` 与 CSS `0.9s` 动画协同。与欢迎遮罩相关的背景初始化还存在于 `.vitepress/config.mjs` 的 `firstPaintScript` / `firstPaintCSS` 和根目录 `index.html`，修改其中任一处时必须检查其余时序、背景色和会话键是否一致。

`SiteEnhancer.vue` 负责文章页及路由后的通用增强：阅读进度与回顶按钮、侧边栏当前项高亮、PhotoSwipe 图片预览，以及通过 `IntersectionObserver` 和 `MutationObserver` 处理时间线动画。路由切换后会重新初始化页面相关状态。

首页扩展内容目前主要由 `HomeMotion.vue` 直接渲染；`HomeExtras.vue` 保留了相关数据和旧的首页扩展交互实现。修改首页内容或动画前，先确认实际挂载路径，避免只改未使用的旧组件。

### Markdown、搜索与部署

`.vitepress/config.mjs` 配置双 Shiki 主题、代码行号、中文标准容器标签和 `markdown-it-container` 的 `:::timeline` 容器。时间线的 Markdown 渲染在配置中，样式在 `_timeline.css`，进入视口动画在 `SiteEnhancer.vue`。搜索由 `vitepress-plugin-pagefind` 在构建阶段生成，并使用 `chineseSearchOptimize` 优化中文查询。

`.github/workflows/deploy.yml` 在推送到 `main` 或手动触发时运行，使用 Node.js 24.9.0，执行 `npm ci` 和 `npm run docs:build`，然后将 `.vitepress/dist` 部署到 GitHub Pages。`.vitepress/dist` 是生成目录，不要直接编辑。

仓库中没有 `.cursor/rules/`、`.cursorrules` 或 `.github/copilot-instructions.md`，因此没有额外的编辑器规则需要同步。
