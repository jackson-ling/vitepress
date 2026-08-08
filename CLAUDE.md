# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

这是一个基于 VitePress 的中文技术知识库，仓库根目录就是内容根目录：`index.md` 对应首页，`docs/**/*.md` 对应文章，`public/` 中的资源以根路径发布。README.md 仅用于 GitHub 项目说明，并通过 `srcExclude` 排除在网站构建之外。

项目使用 Node.js 24.9.0（`.nvmrc`，`package.json` 要求 `>=24.0.0 <25.0.0`）和 npm；`package-lock.json` 是依赖版本来源。不要更换包管理器，也不要直接修改 `.vitepress/dist`。

## 常用命令

所有命令都在仓库根目录运行，侧边栏生成器依赖 `process.cwd()`。

```bash
# 安装锁定版本依赖
npm ci

# 启动开发服务器，默认 http://localhost:5173
npm run docs:dev

# 构建生产站点（同时生成 Pagefind 搜索索引）
npm run docs:build

# 预览已构建站点
npm run docs:preview
```

仓库当前没有测试、Lint 或格式化脚本，因此没有可运行的单测命令。修改配置、主题或内容后，至少执行 `git diff --check` 和 `npm run docs:build`；构建内存不足时可设置 `NODE_OPTIONS=--max-old-space-size=5120`。CI 使用 Node.js 24.9.0、`npm ci` 和 `npm run docs:build`，产物目录为 `.vitepress/dist`。

## 整体架构

- `.vitepress/config.mjs` 是配置组合入口：设置站点元信息、根路径、README 排除规则、首屏注入、Pagefind 插件、主题配置和 Markdown 配置。
- `.vitepress/config/theme.mjs` 集中维护导航、手动侧边栏、社交链接和页脚。部分侧边栏由 `.vitepress/gen_sidebar.js` 根据目录递归生成；新增、移动或重命名文章时，必须同步检查这里的手动链接和自动生成范围，避免破坏既有 URL 或顺序。
- `.vitepress/config/first-paint.mjs` 提供开发和生产共用的首帧 CSS、脚本及 Vite 插件，用于首屏背景、亮暗主题占位和防白闪。根目录 `index.html` 只是低风险兼容入口，不是日常首屏逻辑维护位置。
- `.vitepress/config/markdown.mjs` 配置 Shiki 双主题、代码行号、中文容器标签以及 `:::timeline` 自定义容器；时间线 HTML 由 Markdown 渲染阶段生成。
- `.vitepress/theme/index.js` 继承 VitePress 默认主题并加载全局样式；`.vitepress/theme/Layout.vue` 继续使用默认 Layout，同时挂载首页动画和全局增强，并处理路由过渡与图片懒加载。
- `.vitepress/theme/components/HomeMotion.vue` 是首页动画的核心状态机，集中处理 Loader、桌面滚动场景、pointer 效果、手机分页、触摸手势和 requestAnimationFrame 时序。其 DOM 引用和动画逻辑刻意保持在同一组件中，修改首页行为时不要无必要拆分。
- `.vitepress/theme/components/SiteEnhancer.vue` 负责非首页增强：阅读进度、回顶、侧边栏高亮、PhotoSwipe 图片预览以及 timeline 生命周期。
- `.vitepress/theme/home-content.js` 保存首页 TIP、技术栈、友情链接和章节导航等静态内容；只改首页文案或数据时优先修改此文件，不要进入 `HomeMotion.vue`。
- `.vitepress/theme/styles/index.css` 按职责加载主题样式。首页 scoped CSS 的顺序必须保持为：`_home-motion-base.css`、`_home-motion-loader.css`、`_home-motion-scenes.css`、`_home-motion-sections.css`、`_home-motion-responsive.css`；响应式文件必须最后加载。
- Markdown 内容直接映射为 URL。`docs/` 按 Java、算法、后端、前端、Python、AI、408、项目等主题组织，`public/` 保存站点图片和图标。

## 修改约束

- 首页 Loader 的 JavaScript 时长必须与 Loader CSS 动画保持一致。
- `homepage-motion-intro-played-v3` 控制同一 session 是否重复播放；`welcome-overlay-shown` 虽然是历史命名，但仍是首屏脚本与 `HomeMotion` 之间的有效契约，不要单独删除或改名。
- 首页样式按现有职责文件修改：首屏基础状态使用 `_home-motion-base.css`，Loader 使用 `_home-motion-loader.css`，舞台与 Hero 使用 `_home-motion-scenes.css`，技术栈/友情链接/进度导航使用 `_home-motion-sections.css`，断点和 reduced motion 使用 `_home-motion-responsive.css`。
- 导航、侧边栏、文章路径和静态资源路径区分根路径 `/` 与相对路径；修改链接后应通过生产构建检查引用是否有效。
- 内容改动优先只改对应 Markdown 或 `.vitepress/theme/home-content.js`；不要为简单内容调整重构首页动画组件。

## 部署

`.github/workflows/deploy.yml` 在 push 到 `main` 或手动触发时运行，使用 GitHub Pages 部署：检出完整 Git 历史，安装锁定依赖，执行生产构建，并上传 `.vitepress/dist`。
