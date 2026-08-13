<div align="center">

<img src="public/主页logo.webp" width="280" alt="jackson凌知识文档站 Logo" />

# jackson凌の知识文档站

**少想多做 · 循序渐进 · 深入思考**

一个面向 Java 后端学习与工程实践的个人知识文档站，<br />
也是一个经过深度定制、持续维护的 VitePress 项目。

[![在线访问](https://img.shields.io/badge/在线访问-jacksonling.cn-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://jacksonling.cn/)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/jackson-ling/vitepress/deploy.yml?branch=main&style=for-the-badge&label=构建)](https://github.com/jackson-ling/vitepress/actions/workflows/deploy.yml)
[![GitHub Stars](https://img.shields.io/github/stars/jackson-ling/vitepress?style=for-the-badge&logo=github)](https://github.com/jackson-ling/vitepress/stargazers)

</div>

## 关于本站

这是我在学习与实践过程中持续维护的个人知识库，主要用于整理 Java 后端技术、算法训练、项目开发和工程实践中的知识与经验。

我希望这里不只是零散笔记的集合，而是一套能够持续补充、方便检索、便于回顾的个人知识体系。站点内容以 Markdown 编写，通过 VitePress 构建和发布；在默认主题之上，还围绕首页呈现、中文搜索和文档阅读体验进行了较完整的定制。

> 文档仍在持续整理中。部分内容来源于课程学习、官方文档和个人实践，请结合实际场景判断使用。

## 项目特色

- **沉浸式动态首页**：自定义 Loader、滚动场景、技术栈展示、友情链接和移动端分页交互。
- **中文全文搜索**：使用 Pagefind 生成静态索引，并通过 `chineseSearchOptimize` 优化中文检索。
- **文档阅读增强**：提供阅读进度、回到顶部、当前侧边栏高亮和自定义时间线动画。
- **图片浏览体验**：基于 PhotoSwipe 支持正文图片预览、缩放、拖拽和滚轮操作。
- **自动生成侧边栏**：根据文档目录递归生成导航项，同时保留复杂板块的手动配置能力。
- **首屏与主题优化**：开发和生产环境共用首屏逻辑，适配亮暗主题并减少背景闪烁。
- **响应式适配**：针对桌面端和移动端分别处理首页交互、导航及文档布局。
- **自动化发布**：通过 GitHub Actions 构建站点、生成搜索索引并部署到 GitHub Pages。

## 文档内容

目前知识库包含 600 余篇 Markdown 文档，主要围绕以下方向持续整理：

`Java` · `算法与数据结构` · `Spring 生态` · `数据库与中间件` · `项目实践` · `DevOps` · `前端基础` · `Python 与 Agent` · `AI 应用` · `学习与面试复盘`

完整内容和最新导航请直接访问：[jacksonling.cn](https://jacksonling.cn/)

## 技术实现

| 模块 | 方案 |
| --- | --- |
| 文档框架 | VitePress 1.6.4、Vue 3.5 |
| 内容组织 | Markdown、手动导航、目录扫描生成侧边栏 |
| 站内搜索 | Pagefind、中文搜索优化 |
| 图片预览 | PhotoSwipe 5 |
| 主题定制 | Vue 组件、CSS 自定义属性、响应式布局 |
| 首页交互 | 滚动状态机、触摸手势、`requestAnimationFrame` 动画 |
| 构建部署 | npm、GitHub Actions、GitHub Pages |

核心实现分布如下：

- `.vitepress/config.mjs`：组合站点、主题、Markdown、搜索与首屏配置。
- `.vitepress/config/theme.mjs`：维护导航、侧边栏、社交链接和页脚。
- `.vitepress/theme/components/HomeMotion.vue`：实现首页动效和桌面、移动端交互。
- `.vitepress/theme/components/SiteEnhancer.vue`：实现阅读进度、回顶、图片预览和时间线增强。
- `.vitepress/theme/home-content.js`：集中维护首页展示内容。
- `.vitepress/gen_sidebar.js`：根据文档目录生成侧边栏数据。

## 快速开始

### 环境要求

- Node.js `18.20.4`，项目约束为 `>=18.20.4 <19.0.0`
- npm，依赖版本以 `package-lock.json` 为准

### 本地运行

```bash
git clone https://github.com/jackson-ling/vitepress.git
cd vitepress

npm ci
npm run docs:dev
```

开发服务器默认运行在 `http://localhost:5173`。

### 构建与预览

```bash
npm run docs:build
npm run docs:preview
```

生产构建会同时生成 Pagefind 搜索索引，构建产物位于 `.vitepress/dist`。

本项目的完整构建需要较多内存。在 Windows PowerShell 中遇到 Node.js 堆内存不足时，可以执行：

```powershell
$env:NODE_OPTIONS = '--max-old-space-size=5120'
npm run docs:build
```

## 项目结构

```text
.
├── .github/workflows/
│   └── deploy.yml                 # GitHub Pages 自动部署
├── .vitepress/
│   ├── config.mjs                 # VitePress 配置入口
│   ├── config/                    # 主题、Markdown 与首屏配置
│   ├── gen_sidebar.js             # 侧边栏生成工具
│   └── theme/
│       ├── components/            # 首页和阅读增强组件
│       ├── styles/                # 自定义主题样式
│       ├── Layout.vue             # 布局组合入口
│       └── home-content.js        # 首页展示数据
├── docs/                           # 知识库 Markdown 文档
├── public/                         # 图片与图标等静态资源
├── index.md                        # 首页内容配置
├── package.json                    # 依赖与项目脚本
└── README.md                       # GitHub 项目说明
```

## 自定义指南

| 修改目标 | 主要文件 |
| --- | --- |
| 首页标题、简介和入口按钮 | `index.md` |
| 首页 TIP、技术栈和友情链接 | `.vitepress/theme/home-content.js` |
| 顶部导航、侧边栏和页脚 | `.vitepress/config/theme.mjs` |
| Markdown 渲染和自定义容器 | `.vitepress/config/markdown.mjs` |
| 首页动效与交互 | `.vitepress/theme/components/HomeMotion.vue` |
| 阅读进度、回顶和图片预览 | `.vitepress/theme/components/SiteEnhancer.vue` |
| 全局及响应式样式 | `.vitepress/theme/styles/` |

新增或移动文章时，需要同步检查手动导航、侧边栏生成范围和既有 URL，避免产生失效链接。

## 部署

`.github/workflows/deploy.yml` 会在推送到 `main` 分支或手动触发时：

1. 使用 Node.js `18.20.4` 安装锁定依赖；
2. 构建 VitePress 站点和 Pagefind 搜索索引；
3. 将 `.vitepress/dist` 发布到 GitHub Pages。

## 联系与交流

如果发现文档内容有误，或希望交流学习与项目实践，欢迎通过以下方式联系：

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jackson-ling)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/jacksonling)
[![CSDN](https://img.shields.io/badge/CSDN-FC5531?style=for-the-badge&logo=csdn&logoColor=white)](https://blog.csdn.net/jackson0607)
[![微信](https://img.shields.io/badge/微信-07C160?style=for-the-badge&logo=wechat&logoColor=white)](https://jacksonling.cn/docs/Contact.html)

</div>

## Star History

<p align="center">
  <a href="https://star-history.com/#jackson-ling/vitepress&amp;Date">
    <img src="https://api.star-history.com/svg?repos=jackson-ling/vitepress&amp;type=Date" alt="Star History Chart" />
  </a>
</p>
