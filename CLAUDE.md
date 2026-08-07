# CLAUDE.md

本文件说明在此代码库中使用 Claude Code（claude.ai/code）时需要遵循的开发规范。

## 代码库概览

这是一个基于 VitePress 构建的个人中文技术知识库网站。代码库根目录就是 VitePress 源码根目录：`index.md` 是首页，大多数文章位于 `docs/` 下，静态资源位于 `public/` 下。`README.md` 用于说明 GitHub 代码库，并明确排除在网站构建之外。

使用 Node.js 24.9.0（`.nvmrc`；`package.json` 要求版本范围为 `>=24.0.0 <25.0.0`）和 npm。`package-lock.json` 是依赖版本的权威来源，CI 使用 `npm ci` 安装依赖。后续开发和验证统一使用 Node 24，不要切回 Node 18。

## 命令

请在代码库根目录运行命令，因为侧边栏生成器会根据 `process.cwd()` 解析内容路径。

```bash
npm install              # 安装或更新本地开发依赖
npm ci                   # 按 CI 使用的 lockfile 复现依赖安装
npm run docs:dev         # 启动 VitePress 开发服务器（通常为 http://localhost:5173）
npm run docs:build       # 将生产网站构建到 .vitepress/dist
npm run docs:preview     # 在本地预览生产构建结果
```

代码库没有测试运行器、Lint 命令、格式化命令或项目测试文件。因此，不支持运行单个测试。对于内容、配置或主题修改，代码库级别的主要验证方式是 `npm run docs:build`。

GitHub Actions 为生产构建设置了更大的堆内存。如果本地构建出现内存不足，请使用以下命令复现：

```bash
NODE_OPTIONS=--max-old-space-size=5120 npm run docs:build
```

## 架构

### 内容与路由

- VitePress 将 Markdown 路径直接映射为网站路由。`/` 对应 `index.md`，主要知识库章节对应 `docs/**/*.md`。
- `public/` 中的内容会被复制为根路径静态资源。现有配置和 Markdown 通常使用 `/name.png` 引用这些资源（或使用已配置的 `base` 路径）。
- `.vitepress/config.mjs` 是网站元数据、顶部导航、路由前缀侧边栏、搜索、Markdown 渲染和 Vite 插件的核心集成点。由于使用自定义域名，`base` 配置为 `/`。
- 顶部导航在 `themeConfig.nav` 中手动维护。侧边栏采用混合模式：`themeConfig.sidebar` 定义按路由划分的分组，`setSidebarDefault(...)` 调用则根据文件系统生成分组内容。

### 生成式侧边栏

`.vitepress/gen_sidebar.js` 会递归地将内容目录转换为 VitePress 侧边栏项目。它只包含 `.md` 文件，排除 `WHITE_LIST` 中的名称，并主要按照文件名中的第一个数字排序。因此，目录或文件名变更可能会自动改变导航；如果路由边界发生变化，还需要同步更新 `.vitepress/config.mjs` 中的手动链接或分组。

生成器会将 URL 路径映射为相对于当前工作目录的磁盘路径。如果不在代码库根目录运行 VitePress，可能会静默生成空的侧边栏分组。

### 主题与客户端行为

`.vitepress/theme/index.js` 扩展 VitePress 默认主题，加载全局 CSS 样式包，并使用 `.vitepress/theme/Layout.vue` 替换默认布局。

`Layout.vue` 是客户端行为的组合入口：

- 包装 VitePress 默认布局；
- 挂载 `HomeExtras`、`WelcomeOverlay` 和 `SiteEnhancer`；
- 提供共享的主题和覆盖层操作；
- 安装路由切换钩子和全局图片懒加载。

`SiteEnhancer.vue` 会在路由切换后重新初始化页面相关增强功能，包括阅读进度、侧边栏行为、PhotoSwipe 图片预览和时间线激活动画。`WelcomeOverlay.vue` 负责首页按会话显示的欢迎体验。修改欢迎过渡效果时，请确保 `Layout.vue`、`WelcomeOverlay.vue`、`index.html` 以及 `config.mjs` 中的内联 head 脚本和样式保持时间配置与背景行为同步。

主题 CSS 按职责拆分在 `.vitepress/theme/styles/` 下，并由 `styles/index.css` 汇总导入。请优先修改对应的样式分片，不要修改生成输出或汇总导入文件。

### Markdown 与搜索流程

`config.mjs` 配置了双 Shiki 主题、代码行号、标准容器的中文标签，以及通过 `markdown-it-container` 实现的自定义 `:::timeline` 容器。时间线标记的样式由主题负责，动画则由 `SiteEnhancer.vue` 负责，因此相关修改可能需要同时调整 Markdown 渲染器、CSS 和客户端增强器。

搜索功能由 `vitepress-plugin-pagefind` 在构建时提供，并通过 `chineseSearchOptimize` 优化中文搜索。该插件注册在 Vite 插件列表中，而不是由单独的应用服务实现。

### 构建与部署

`npm run docs:build` 会处理根目录内容、生成的侧边栏配置、Markdown 扩展和自定义 Vue 主题，并生成 `.vitepress/dist`。`.vitepress/dist` 属于生成输出，请修改源文件，不要直接修改该目录中的内容。

`.github/workflows/deploy.yml` 会在推送到 `main` 分支或手动触发时运行。该工作流使用 Node.js 24.9.0，执行 `npm ci` 和 `npm run docs:build`，然后上传 `.vitepress/dist`，并通过 GitHub Pages Actions 完成部署。该工作流不会运行测试或 Lint 检查。
