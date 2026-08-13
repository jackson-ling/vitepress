<div align="center">

<img src="public/主页logo.webp" width="260" alt="jackson凌知识文档站 Logo" />

# jackson凌の知识文档站

面向 Java 后端学习与工程实践的个人知识库，<br />
也是一个持续维护、深度定制的 VitePress 文档站项目。

[![在线文档](https://img.shields.io/badge/在线文档-jacksonling.cn-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://jacksonling.cn/)
[![构建状态](https://img.shields.io/github/actions/workflow/status/jackson-ling/vitepress/deploy.yml?branch=main&style=for-the-badge&label=构建)](https://github.com/jackson-ling/vitepress/actions/workflows/deploy.yml)
[![GitHub Stars](https://img.shields.io/github/stars/jackson-ling/vitepress?style=for-the-badge&logo=github&label=Stars)](https://github.com/jackson-ling/vitepress/stargazers)

![VitePress](https://img.shields.io/badge/VitePress-1.6.4-646CFF?style=flat-square&logo=vitepress&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.20.4-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Pagefind](https://img.shields.io/badge/Pagefind-1.5-2F6FEB?style=flat-square)
![PhotoSwipe](https://img.shields.io/badge/PhotoSwipe-5.4-111827?style=flat-square)

</div>

## 项目介绍

这是我在学习和实践过程中持续维护的个人知识文档站，主要记录 Java 后端、算法、项目开发以及相关工程技术。相比零散笔记，我更希望通过稳定的目录、导航和搜索，将内容沉淀为一套便于检索、复习和继续补充的个人知识体系。

站点使用 Markdown 编写内容，通过 VitePress 构建发布。在默认主题基础上，项目对首页交互、中文搜索、文档导航、图片浏览、移动端体验和首屏渲染进行了定制，也可以作为 VitePress 主题扩展与个人文档站建设的参考。

> 文档会随学习进度持续更新。部分内容整理自课程、官方文档和个人实践，请结合原始资料与实际环境使用。

## 功能亮点

| 功能 | 实现与体验 |
| --- | --- |
| 动态首页 | 自定义 Loader、滚动场景、技术栈展示、友情链接以及移动端分页交互 |
| 中文搜索 | 使用 Pagefind 生成静态索引，并通过 `chineseSearchOptimize` 优化中文检索 |
| 阅读增强 | 提供阅读进度、回到顶部、当前侧边栏高亮和时间线入场动画 |
| 图片预览 | 基于 PhotoSwipe 支持正文图片预览、缩放、拖拽和滚轮操作 |
| 内容导航 | 结合手动配置与目录扫描生成侧边栏，兼顾复杂结构和维护效率 |
| 主题适配 | 支持亮暗主题和响应式布局，并优化开发、生产环境下的首屏背景闪烁 |
| 自动部署 | GitHub Actions 自动构建站点与搜索索引，并发布到 GitHub Pages |

## 文档内容

知识库以 Java 后端学习路线为主，同时整理算法、项目实践、前端基础、Python 和 AI 应用等方向。

| 方向 | 主要内容 | 仓库入口 |
| --- | --- | :---: |
| Java | Java 基础、面向对象、常用 API、网络编程、JDBC、Maven、单元测试与章节练习 | [查看文档](./docs/Java/) |
| 算法与数据结构 | 代码随想录、灵神题单、左程云课程、蓝桥杯、数据结构与专题题解 | [查看文档](./docs/算法/) |
| 后端开发 | Spring、Spring Boot、MyBatis、MySQL、Redis、设计模式、Linux 与 Docker | [查看文档](./docs/后端/) |
| 项目实践 | Tlias 智能学习辅助系统、苍穹外卖、中州养老等项目的开发与部署记录 | [查看文档](./docs/项目/) |
| 学习笔记 | GitHub、Markdown、VitePress、八股文、面试复盘、随笔与实习日记 | [查看文档](./docs/笔记/) |
| Python | Python 基础、爬虫、FastAPI、LangChain 与 LangGraph Agent | [查看文档](./docs/Python/) |
| 前端基础 | HTML、CSS、JavaScript、TypeScript、Vue、Element Plus 与微信小程序 | [查看文档](./docs/前端/) |
| AI 应用 | AI 基础、Claude Code、Spring AI、Ollama 与 ROS2 | [查看文档](./docs/AI/) |

仓库目录适合查看 Markdown 源文件；完整导航、站内搜索和主题体验请访问 **[在线文档站](https://jacksonling.cn/)**。

## 快速开始

### 环境要求

- Node.js `18.20.4`，项目约束为 `>=18.20.4 <19.0.0`
- npm，依赖版本以 `package-lock.json` 为准

### 安装与运行

```bash
git clone https://github.com/jackson-ling/vitepress.git
cd vitepress

# 按锁定版本安装依赖
npm ci

# 启动开发服务器，默认访问 http://localhost:5173
npm run docs:dev

# 构建站点与 Pagefind 搜索索引
npm run docs:build

# 预览生产构建产物
npm run docs:preview
```

生产构建产物位于 `.vitepress/dist`。完整站点构建需要较多内存；如果在 Windows PowerShell 中遇到 Node.js 堆内存不足，可以执行：

```powershell
$env:NODE_OPTIONS = '--max-old-space-size=5120'
npm run docs:build
```

## 项目结构

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── .vitepress/
│   ├── config.mjs                 # VitePress 配置组合入口
│   ├── config/                    # 主题、Markdown 与首屏配置
│   ├── gen_sidebar.js             # 侧边栏生成工具
│   └── theme/
│       ├── components/            # 首页动效与阅读增强组件
│       ├── styles/                # 全局、文档及响应式样式
│       ├── Layout.vue             # 自定义布局入口
│       └── home-content.js        # 首页展示数据
├── docs/                           # 知识库 Markdown 文档
├── public/                         # 图片、图标等静态资源
├── index.md                        # 首页标题、简介与入口按钮
└── package.json                    # 依赖与 npm 脚本
```

## 常用配置

| 修改目标 | 维护位置 |
| --- | --- |
| 首页标题、简介和入口按钮 | `index.md` |
| 首页 TIP、技术栈和友情链接 | `.vitepress/theme/home-content.js` |
| 顶部导航、侧边栏和页脚 | `.vitepress/config/theme.mjs` |
| Markdown 渲染和自定义容器 | `.vitepress/config/markdown.mjs` |
| 首屏主题与防闪逻辑 | `.vitepress/config/first-paint.mjs` |
| 首页动效和移动端交互 | `.vitepress/theme/components/HomeMotion.vue` |
| 阅读进度、回顶和图片预览 | `.vitepress/theme/components/SiteEnhancer.vue` |
| 全局及响应式样式 | `.vitepress/theme/styles/` |

新增、移动或重命名文章后，需要同步检查手动导航、侧边栏生成范围和既有 URL，避免产生失效链接。

## 部署

仓库通过 `.github/workflows/deploy.yml` 部署到 GitHub Pages。推送到 `main` 分支或手动触发工作流后，会依次执行：

1. 使用 Node.js `18.20.4` 和 `npm ci` 安装锁定依赖；
2. 执行 `npm run docs:build`，构建站点和 Pagefind 搜索索引；
3. 上传 `.vitepress/dist` 并发布到 GitHub Pages。

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
