<div align="center">

<img width="300" src="public/主页logo.webp" alt="jackson凌知识文档站" />

# jackson凌の知识文档站

一个持续整理 Java 后端、算法与工程实践的个人技术知识库

[![在线预览](https://img.shields.io/badge/在线预览-0d1321?style=for-the-badge&logo=googlechrome&logoColor=white)](https://jacksonling.cn/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/jackson-ling)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee)](https://gitee.com/jacksonling)
[![CSDN](https://img.shields.io/badge/CSDN-FC5531?style=for-the-badge&logo=csdn)](https://blog.csdn.net/jackson0607)

</div>

## 项目简介

本项目是基于 [VitePress](https://vitepress.dev/) 构建的中文技术知识库，仓库中的 600 余篇 Markdown 文档覆盖 Java 基础、算法训练、后端开发、前端基础、Python、AI 应用与项目实战。

项目不仅用于归档学习笔记，也对默认 VitePress 主题进行了定制，提供首页动效、中文全文搜索、阅读进度、图片预览和响应式浏览体验。

## 核心能力

- **结构化内容导航**：顶部导航、手动侧边栏与目录扫描生成的侧边栏共同组织文档。
- **中文全文搜索**：使用 Pagefind 构建搜索索引，并启用中文搜索优化。
- **自定义动态首页**：包含首次访问 Loader、滚动场景、技术栈展示与移动端分页交互。
- **阅读体验增强**：提供阅读进度、回到顶部、当前侧边栏高亮和时间线动画。
- **正文图片预览**：基于 PhotoSwipe 支持图片缩放、拖拽和滚轮缩放。
- **首屏主题适配**：开发与生产环境共用首屏逻辑，降低亮暗主题切换时的背景闪烁。
- **自动化部署**：推送到 `main` 分支后，由 GitHub Actions 构建并部署到 GitHub Pages。

## 内容地图

| 板块 | 主要内容 |
| --- | --- |
| Java | Java 基础、面向对象、网络编程、JDBC、正则、Maven、单元测试与章节练习 |
| 算法 | 代码随想录、灵神题单、左程云课程、蓝桥杯、数据结构与专题题解 |
| 后端 | MySQL、Redis、Spring、Spring Boot、MyBatis、设计模式、Linux、Docker 与 Git |
| 项目 | Tlias 智能学习辅助系统、苍穹外卖、中州养老等项目笔记 |
| 前端 | HTML、CSS、JavaScript、TypeScript、Vue、Element Plus 与微信小程序 |
| Python | Python 基础、爬虫、FastAPI、LangChain 与 LangGraph Agent |
| AI | AI 基础、Claude Code、Spring AI、Ollama 与 ROS2 |
| 笔记 | GitHub、Markdown、VitePress、面试复盘、八股文、随笔与实习日记 |

## 技术栈

<div align="center">

![VitePress](https://img.shields.io/badge/VitePress-1.6.4-646CFF?style=flat-square&logo=vitepress&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.20.4-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Pagefind](https://img.shields.io/badge/Pagefind-1.5-2F6FEB?style=flat-square)
![PhotoSwipe](https://img.shields.io/badge/PhotoSwipe-5.4-111827?style=flat-square)

</div>

## 快速开始

### 环境要求

- Node.js `18.20.4`（项目版本范围：`>=18.20.4 <19.0.0`）
- npm（依赖版本以 `package-lock.json` 为准）

Windows 下使用 nvm 时，建议先确认当前终端已切换到项目版本：

```powershell
nvm use 18.20.4
node -v
```

### 安装与运行

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

生产构建会同时生成 Pagefind 搜索索引，构建产物位于 `.vitepress/dist`。完整站点构建需要较多内存；如遇 Node.js 堆内存不足，可在当前终端设置：

```powershell
$env:NODE_OPTIONS = '--max-old-space-size=5120'
npm run docs:build
```

## 项目结构

```text
.
├── .github/workflows/
│   └── deploy.yml                 # GitHub Pages 构建与部署
├── .vitepress/
│   ├── config.mjs                 # VitePress 配置组合入口
│   ├── config/
│   │   ├── first-paint.mjs        # 首屏主题与防闪逻辑
│   │   ├── markdown.mjs           # Markdown 与自定义容器配置
│   │   └── theme.mjs              # 导航、侧边栏、社交链接与页脚
│   ├── gen_sidebar.js             # 基于文档目录生成侧边栏
│   └── theme/
│       ├── Layout.vue             # 自定义布局组合
│       ├── home-content.js        # 首页内容数据
│       ├── components/
│       │   ├── HomeMotion.vue     # 首页动效与交互
│       │   └── SiteEnhancer.vue   # 阅读与图片预览增强
│       └── styles/                 # 按职责拆分的主题样式
├── docs/                           # 各主题 Markdown 文档
├── public/                         # 图片、图标等静态资源
├── index.md                        # 站点首页内容入口
├── package.json                    # 依赖与 npm 脚本
└── README.md                       # GitHub 项目说明
```

## 内容与配置维护

- 新增或修改文章时，编辑 `docs/` 下对应主题目录中的 Markdown 文件。
- 修改首页标题和操作按钮时，编辑 `index.md`；修改首页 TIP、技术栈、友情链接或章节数据时，编辑 `.vitepress/theme/home-content.js`。
- 修改导航、手动侧边栏或社交链接时，编辑 `.vitepress/config/theme.mjs`。
- 部分侧边栏由 `.vitepress/gen_sidebar.js` 根据目录自动生成；移动或重命名文章后，需要同步检查路由和手动链接。
- `README.md` 通过 `srcExclude` 排除，仅用于仓库说明，不会生成站点页面。

## 部署

仓库使用 `.github/workflows/deploy.yml` 部署 GitHub Pages：

1. 推送到 `main` 分支，或在 Actions 页面手动触发工作流。
2. 工作流使用 Node.js `18.20.4` 执行 `npm ci` 和 `npm run docs:build`。
3. `.vitepress/dist` 作为 Pages 产物上传并发布。

## 联系作者

若发现笔记内容有误，或希望交流学习与项目实践，可以通过以下方式联系：

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jackson-ling)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/jacksonling)
[![CSDN](https://img.shields.io/badge/CSDN-FC5531?style=for-the-badge&logo=csdn&logoColor=white)](https://blog.csdn.net/jackson0607)
[![WeChat](https://img.shields.io/badge/微信-07C160?style=for-the-badge&logo=wechat&logoColor=white)](https://jacksonling.cn/docs/Contact.html)

</div>

## Star History

<p align="center">
  <a href="https://star-history.com/#jackson-ling/vitepress&amp;Date">
    <img src="https://api.star-history.com/svg?repos=jackson-ling/vitepress&amp;type=Date" alt="Star History Chart" />
  </a>
</p>
