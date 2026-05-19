import {defineConfig} from 'vitepress'
import {set_sidebar as setSidebarDefault} from './gen_sidebar.js'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)

// https://vitepress.dev/reference/site-config
export default defineConfig({
    /* 如果是 GitHub 则需要设置 base ， 使用国内的服务器不用 */
    // // 设置base
    // base: "/vitepress/", // 路由为 GitHub 仓库名称
    // /* 特别注意：如果设置了base，需要先链接base（base的路径名称），再链接图片 */
    // head: [['link', {rel: 'icon', href: "/vitepress/标签logo.png"}]], // 网页标签页的图标

    head: [
        ['link', {rel: 'icon', href: "/标签logo.png"}],
    ],

    title: "jackson凌の文档站", // 网站标签页的名称
    description: "A VitePress Site",
    themeConfig: {
        //自定义上下页名
        docFooter: {
            prev: '上一页',
            next: '下一页',
        },
        // https://vitepress.dev/reference/default-theme-config

        // 右侧 On this page 属性设置
        // outlineTitle: false,
        // outline: false,
        outline: [1, 3], // 指定右侧,展示的标题级别
        outlineTitle: '文章目录', // 指定右侧栏的title标签名称
        aside: false, // 禁用 On this page 属性

        siteTitle: '知识文档站', // 左上角导航栏名称
        logo: '/标签logo.png', // 左上角导航栏图标
        nav: [
            {text: '🏠首页', link: '/'},
            /*            {
                            text: '<img src="环境搭建.png" class="nav-icon nav-icon--3xl"> 环境搭建',
                            items:
                                [
                                    {
                                        text: '<img src="/jetbrains.png" class="nav-icon nav-icon--lg"> Jetbrains常见问题',
                                        link: '/docs/测试界面.md'
                                    },
                                    {
                                        text: 'Linux',
                                        items:
                                            [
                                                {
                                                    text: '<img src="/vmware.jpeg" class="nav-icon nav-icon--lg"> vmware',
                                                    link: '/docs/测试界面.md'
                                                },
                                                {
                                                    text: '<img src="/centos.png" class="nav-icon nav-icon--lg"> CentOS7.6',
                                                    link: '/docs/测试界面.md'
                                                },
                                                {
                                                    text: '<img src="/ubuntu.png" class="nav-icon nav-icon--lg"> Ubuntu',
                                                    link: '/docs/测试界面.md'
                                                },
                                                {
                                                    text: '<img src="/xshell.png" class="nav-icon nav-icon--lg"> XShell',
                                                    link: '/docs/测试界面.md'
                                                },
                                                {
                                                    text: '<img src="/bt.png" class="nav-icon nav-icon--lg"> 宝塔面板',
                                                    link: '/docs/测试界面.md'
                                                },
                                            ]
                                    },
                                ]
                        },
            */
            {
                text: '📝笔记',
                items:
                    [
                        {
                            text: 'Github',
                            items:
                                [
                                    {
                                        text: '<img src="/github.png" class="nav-icon nav-icon--3xl"> Github使用技巧',
                                        link: '/docs/笔记/Github使用指南.md'
                                    },
                                    {text: '⭐优质开源项目', link: '/docs/测试界面.md'},
                                ]
                        },
                        {text: '🔍常用网站', link: '/docs/笔记/常用网站.md'},
                        {text: '🖊️随笔', link: '/docs/笔记/随笔/随笔乱记.md'},
                        {
                            text: 'Markdown',
                            items:
                                [
                                    {
                                        text: '<img src="/markdown.png" class="nav-icon nav-icon--3xl"> Markdown语法',
                                        link: '/docs/测试界面.md'
                                    },
                                    {text: 'Markdown @ emoji', link: '/docs/笔记/markdown/markdown@emoji.md'},
                                ]
                        },
                        {
                            text: 'Vitepress',
                            items:
                                [
                                    {text: '📋准备工作', link: '/docs/测试界面.md'},
                                    {text: '💡建站教程', link: '/docs/测试界面.md'},
                                    {
                                        text: '<img src="建议.png" class="nav-icon nav-icon--xs"> 文档编写建议',
                                        link: '/docs/测试界面.md'
                                    },
                                    {
                                        text: '<img src="腾讯云.png" class="nav-icon nav-icon--xs"> 腾讯云部署',
                                        link: '/docs/笔记/vitepress教程/腾讯云部署/腾讯云部署.md'
                                    },
                                    {
                                        text: '<img src="/githubaction.png" class="nav-icon nav-icon--xs"> Github部署',
                                        link: '/docs/测试界面.md'
                                    },

                                ]
                        },

                    ]
            },
            {
                text: '⭐算法', items:
                    [
                        {text: '📝 算法集锦', link: '/docs/算法/算法集锦/算法集锦'},
                        {
                            text: '<img src="/leetcode.png" class="nav-icon nav-icon--xs"> 灵神题单',
                            link: '/docs/算法/灵神题单/网格图/一、网格图DFS/1. LeetCode 200.md'
                        },
                        {text: '🎉 蓝桥杯', link: '/docs/算法/蓝桥杯/JavaB组省赛/0. 导论.md'},
                        {
                            text: '<img src="洛谷.png" class="nav-icon nav-icon--lg"> 洛谷',
                            link: '/docs/算法/洛谷/导论.md'
                        },
                        {text: '🎯 左程云 ', link: '/docs/算法/左程云/0. 导论.md'},
                        {text: '🚀 算法总结', link: '/docs/测试界面.md'},
                        {
                            text: '代码随想录', items:
                                [
                                    {text: '基本介绍', link: '/docs/算法/代码随想录/代码随想录介绍.md'},
                                    {text: '算法训练营', link: '/docs/算法/代码随想录/训练营/数组/Day 1.md'},
                                    {text: '题目汇总', link: '/docs/算法/代码随想录/题目汇总.md'},
                                ]
                        },
                        {
                            text: '数据结构',
                            items:
                                [
                                    {
                                        text: '<img src="/java深色.png" class="nav-icon nav-icon--3xl"> Java版本',
                                        link: '/docs/算法/数据结构/Java/马踏棋盘算法.md'
                                    },
                                    {
                                        text: '<img src="/C语言.png" class="nav-icon nav-icon--lg"> C语言版本',
                                        link: '/docs/测试界面.md'
                                    },
                                ]

                        },
                    ]
            },
            {
                text: '前端',
                items:
                    [
                        {
                            text: '环境搭建', items:
                                [
                                    {
                                        text: '<img src="/vscode.png" class="nav-icon nav-icon--lg"> vscode',
                                        link: '/docs/前端/vsvode.md'
                                    },
                                    {
                                        text: '<img src="/nodejs.png" class="nav-icon nav-icon--lg"> Nodejs',
                                        link: '/docs/前端/nodejs.md'
                                    },
                                ]
                        },
                        {
                            text: '前端四件套',
                            items:
                                [
                                    {
                                        text: '<img src="/html.png" class="nav-icon nav-icon--md"> HTML',
                                        link: '/docs/前端/HTML/HTML.md'
                                    },
                                    {
                                        text: '<img src="/css.png" class="nav-icon nav-icon--md"> CSS',
                                        link: '/docs/前端/CSS/CSS.md'
                                    },
                                    {
                                        text: '<img src="/javascript.png" class="nav-icon nav-icon--sm"> JavaScript',
                                        link: '/docs/前端/JavaScript/JavaScript.md'
                                    },
                                    {
                                        text: '<img src="/typescript.png" class="nav-icon nav-icon--sm"> TypeScript',
                                        link: '/docs/前端/TypeScript/TypeScript.md'
                                    },
                                ]
                        },
                        {
                            text: '框架',
                            items:
                                [
                                    {
                                        text: '<img src="/vue.png" class="nav-icon nav-icon--2xl"> Vue',
                                        link: '/docs/前端/vue/vue.md'
                                    },
                                    {
                                        text: '<img src="/element-plus.png" class="nav-icon nav-icon--lg"> ElementPlus',
                                        link: '/docs/前端/ElementPlus/elementplus.md'
                                    },
                                    {
                                        text: '<img src="微信开发者工具.jpeg" class="nav-icon nav-icon--lg"> 微信小程序',
                                        link: '/docs/前端/微信小程序/1. HttpClient.md'
                                    },
                                ]
                        },
                    ]
            },
            {
                text: '<img src="/java.png" class="nav-icon nav-icon--3xl"> Java', // 作为导航栏标识
                items: // 传入 items 作为导航栏内容
                    [
                        // 传入第一个字典
                        {
                            text: '环境构建',
                            items:
                                [
                                    {
                                        text: '<img src="/IDEA.png" class="nav-icon nav-icon--3xl"> IDEA',
                                        link: '/docs/Java/IDEA/IDEA文章/1.软件安装包.md',
                                    },
                                    {
                                        text: '<img src="快捷键.png" class="nav-icon nav-icon--3xl"> IDEA快捷键',
                                        link: '/docs/Java/IDEA/IDEA快捷键/IDEA快捷键.md',
                                    },
                                    {
                                        text: '📝IDEA模板',
                                        link: '/docs/Java/IDEA/IDEA模板/代码模板.md'
                                    },
                                    {
                                        text: '<img src="/eclipse.png" class="nav-icon nav-icon--3xl"> eclipse',
                                        link: '/docs/Java/eclipse/eclipse使用教程.md'
                                    },
                                    {
                                        text: '<img src="/maven.png" class="nav-icon nav-icon--3xl"> Maven',
                                        link: '/docs/Java/Maven/maven.md',
                                    },
                                ]
                        },
                        {
                            text: '📝JavaSE',
                            items: [
                                {text: '第一阶段', link: '/docs/Java/第一阶段/基本语法/1.概述.md'},
                                {text: '第二阶段', link: '/docs/Java/第二阶段/面向对象高级/57.类变量.md'},
                                {text: '第三阶段', link: '/docs/Java/第三阶段/网络编程/98.网络的基本概念.md'},
                                {text: 'Java8', link: '/docs/Java/Java8/1. 基本介绍.md'},
                                {text: '单元测试', link: '/docs/Java/单元测试/单元测试.md'},
                            ]
                        },
                        {
                            text: '💯章节练习题',
                            items:
                                [
                                    {
                                        text: '第一阶段',
                                        link: '/docs/Java/章节作业/第一阶段/第三章：变量/第三章作业.md'
                                    },
                                    {
                                        text: '第二阶段',
                                        link: '/docs/Java/章节作业/第二阶段/第十九章：IO流/第十九章作业.md'
                                    },
                                    {
                                        text: '第三阶段',
                                        link: '/docs/Java/章节作业/第三阶段/第二十一章：网络编程/第二十一章作业.md'
                                    },
                                ]
                        },
                    ]
            },
            {
                text: '🎯后端',
                items:
                    [
                        {
                            text: '数据库',
                            items:
                                [
                                    {
                                        text: '<img src="/mysql.png" class="nav-icon nav-icon--xs"> MySQL',
                                        link: '/docs/后端/MySQL/MySQL/基础篇/1. 基本介绍.md'
                                    },
                                    {
                                        text: '<img src="/redis.png" class="nav-icon nav-icon--xs"> Redis',
                                        link: '/docs/后端/Redis/1. 基本介绍.md'
                                    },

                                ]
                        },
                        {
                            text: '框架',
                            items:
                                [
                                    {
                                        text: '<img src="/spring.png" class="nav-icon nav-icon--xs"> Spring',
                                        link: '/docs/后端/Spring/1. AOP.md'
                                    },
                                    // {
                                    //     text: '<img src="/springmvc.png" class="nav-icon nav-icon--xs"> SpringMVC',
                                    //     link: '/docs/测试界面.md'
                                    // },
                                    {
                                        text: '<img src="/mybatis.png" class="nav-icon nav-icon--xs"> MyBatis',
                                        link: '/docs/后端/MyBatis/Mybatis.md'
                                    },
                                    {
                                        text: '<img src="/springboot.png" class="nav-icon nav-icon--xs"> SpringBoot',
                                        link: "/docs/后端/Springboot/1. SpringbootWeb入门.md"
                                    },
                                ]
                        },
                        {
                            text: "微服务",
                            items:
                                [
                                    {
                                        text: '<img src="/mybatisplus.png" class="nav-icon nav-icon--xs"> MyBatis Plus',
                                        link: '/docs/后端/MyBatis Plus/MyBatis Plus.md'
                                    },
                                    {
                                        text: '<img src="/springcloud.png" class="nav-icon nav-icon--xs"> SpringCloud',
                                        link: '/docs/测试界面.md'
                                    },
                                    {
                                        text: '<img src="/rabbitmq.png" class="nav-icon nav-icon--xs"> RabbitMQ',
                                        link: '/docs/测试界面.md'
                                    },
                                    {
                                        text: '<img src="/elasticsearch.png" class="nav-icon nav-icon--xs"> Elasticsearch',
                                        link: '/docs/测试界面.md'
                                    },
                                ]

                        },
                        {
                            text: '其他',
                            items:
                                [
                                    // {
                                    //     text: '<img src="/javaweb.png" class="nav-icon nav-icon--xs"> Java Web',
                                    //     link: '/docs/测试界面.md'
                                    // },
                                    {
                                        text: '<img src="设计模式.png" class="nav-icon nav-icon--md">  设计模式',
                                        link: '/docs/后端/设计模式/工厂模式.md'
                                    },
                                    {
                                        text: '📝 项目笔记',
                                        link: "/docs/后端/项目笔记/解决方案/1. 权限认证.md"
                                    }
                                ]
                        },
                        {
                            text: "DevOps",
                            items:
                                [
                                    {
                                        text: '<img src="/linux.png" class="nav-icon nav-icon--xs"> Linux',
                                        link: '/docs/后端/DevOps/Linux/1. 基本介绍.md'
                                    },
                                    {
                                        text: '<img src="/docker.png" class="nav-icon nav-icon--xs"> Docker',
                                        link: '/docs/后端/DevOps/Docker/1. Docker安装.md'
                                    },
                                    {
                                        text: '<img src="/ngnix.png" class="nav-icon nav-icon--sm"> Ngnix',
                                        link: '/docs/后端/测试界面.md'
                                    },

                                    {
                                        text: '<img src="/git.png" class="nav-icon nav-icon--xs"> Git',
                                        link: '/docs/后端/Git/Git.md'
                                    },
                                ]
                        },
                    ]
            },
            {
                text: '🚀项目',
                items:
                    [
                        {
                            text: 'Tlias 智能学习辅助系统',
                            items:
                                [
                                    {
                                        text: '后端模块',
                                        link: '/docs/项目/Tlias智能学习辅助系统/后端模块/1. 项目介绍.md'
                                    },
                                    {
                                        text: '前端模块',
                                        link: '/docs/项目/Tlias智能学习辅助系统/前端模块/1. 页面基本结构.md'
                                    },
                                    {
                                        text: '项目部署',
                                        link: '/docs/项目/Tlias智能学习辅助系统/项目部署/Linux 部署/1. 前端部署.md'
                                    }
                                ]
                        },
                        {
                            text: '苍穹外卖',
                            items:
                                [
                                    {
                                        text: '项目介绍',
                                        link: '/docs/项目/苍穹外卖/项目介绍/数据库设计文档.md'
                                    },
                                    {
                                        text: '后端模块',
                                        link: '/docs/项目/苍穹外卖/后端模块/Day 2/1. 新增员工.md'
                                    },
                                ]
                        },
                        {
                            text: '中州养老',
                            items:
                                [
                                    {
                                        text: '项目介绍',
                                        link: '/docs/项目/中州养老/项目介绍/Day1/1. 项目介绍.md'
                                    },
                                    {
                                        text: '后端模块',
                                        link: '/docs/测试界面.md'
                                    },
                                ]
                        },
                    ]
            },
            {
                text: '🤖AI',
                items:
                    [
                        {
                            text: '认识 AI',
                            link: '/docs/AI/认识 AI/认识 AI.md'
                        },
                        {
                            text: 'Claude Code',
                            link: '/docs/AI/ClaudeCode/ClaudeCode.md'
                        },
                        {
                            text: 'SpringAI',
                            link: '/docs/AI/SpringAI/springai.md'
                        },
                        {
                            text: 'LangChain4j',
                            link: '/docs/测试界面.md'
                        },
                        {
                            text: 'Ollama',
                            link: '/docs/AI/Ollama/ollama.md'
                        },
                        {
                            text: 'ROS2（AIC大赛）',
                            link: '/docs/AI/ROS2/ros2.md'
                        },
                    ]
            },
            {
                text: '<img src="/python.png" class="nav-icon nav-icon--xl">Python',
                items:
                    [
                        {
                            text: '<img src="/pycharm.png" class="nav-icon nav-icon--lg"> Pycharm',
                            link: '/docs/Python/PyCharm/文章/1.python解释器安装.md'
                        },
                        {text: '📝基础语法', link: '/docs/测试界面.md'},
                        {
                            text: '📊数据分析', items:
                                [
                                    {
                                        text: '<img src="/numpy.png" class="nav-icon nav-icon--md"> NumPy',
                                        link: '/docs/测试界面.md'
                                    },
                                    {
                                        text: '<img src="/pandas.png" class="nav-icon nav-icon--xs"> Pandas',
                                        link: '/docs/测试界面.md'
                                    },
                                    {
                                        text: '<img src="/matplotlib.png" class="nav-icon nav-icon--md"> Matplotlib',
                                        link: '/docs/测试界面.md'
                                    },
                                ]
                        },
                        {text: '🐍爬虫', link: '/docs/Python/爬虫/基本介绍.md'},
                        {text: '🤖网页自动化', link: '/docs/测试界面.md'},
                    ]
            },
            {
                text: '408',
                items:
                    [
                        {
                            text: '数学', items:
                                [
                                    {text: '高等数学', link: '/docs/测试界面.md'},
                                    {text: '线性代数', link: '/docs/测试界面.md'},
                                    {text: '概率论', link: '/docs/测试界面.md'},
                                ]
                        },
                        {
                            text: '专业课',
                            items:
                                [
                                    {text: '数据结构', link: '/docs/测试界面.md'},
                                    {text: '计算机组原理', link: '/docs/测试界面.md'},
                                    {text: '操作系统', link: '/docs/测试界面.md'},
                                    {text: '计算机网络', link: '/docs/测试界面.md'},
                                ]
                        },
                        {
                            text: 'C/C++', items:
                                [
                                    {
                                        text: '<img src="/clion.png" class="nav-icon nav-icon--lg"> Clion',
                                        link: '/docs/测试界面.md'
                                    },
                                ]
                        },
                    ]
            },

        ],

        sidebar:
        // 会根据导航栏中链接的文章路由来匹配不同的侧边栏，根据侧边栏前的路由来显示该路由下的文章内容
            {
                '/docs/算法/代码随想录/训练营':
                    [
                        {
                            text: '算法训练营',
                            items:
                                [
                                    {text: '随想录刷题计划', link: '/docs/算法/代码随想录/随想录刷题计划.md'},
                                    {text: '每日任务汇总', link: '/docs/算法/代码随想录/每日任务汇总.md'},
                                    // ...setSidebarDefault('/docs/算法/代码随想录/训练营'),
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '数组',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/数组'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '链表',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/链表'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '哈希表',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/哈希表'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '字符串',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/字符串'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '栈与队列',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/栈与队列'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '二叉树',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/二叉树'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '回溯算法',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/回溯算法'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '贪心算法',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/贪心算法'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '动态规划',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/动态规划'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '单调栈',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/单调栈'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '图论',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/代码随想录/训练营/图论'),
                                            ]
                                    },
                                ]
                        }
                    ],
                '/docs/算法/蓝桥杯':
                    [
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: '常用归纳',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/蓝桥杯/常用归纳')
                                ]
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: '真题分析',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/蓝桥杯/真题分析')
                                ]
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: 'Java B组省赛真题',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/蓝桥杯/JavaB组省赛')
                                ]
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: 'Java B组国赛真题',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/蓝桥杯/JavaB组国赛')
                                ]
                        }
                    ],
                '/docs/算法/左程云':
                    [
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: '左程云算法',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/左程云'),
                                ]
                        }
                    ],
                '/docs/算法/洛谷':
                    [
                        {
                            text: '导论',
                            link: '/docs/算法/洛谷/导论.md'
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: '蓝桥杯真题',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/洛谷/蓝桥杯真题'),
                                ]
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: '洛谷题单',
                            items:
                                [
                                    ...setSidebarDefault('/docs/算法/洛谷/洛谷题单'),
                                ]
                        }
                    ],
                '/docs/算法/灵神题单':
                    [
                        {

                            text: '灵神题单',
                            items:
                                [
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '编程入门题单',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/灵神题单/编程入门题单'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '网格图',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/算法/灵神题单/网格图'),
                                            ]
                                    },
                                ]
                        }
                    ],

                // IDEA 安装
                '/docs/Java/IDEA/IDEA文章':
                    [
                        {
                            text: 'IDAE环境搭建',
                            items:
                                [
                                    ...setSidebarDefault('/docs/Java/IDEA/IDEA文章')
                                ]
                        }
                    ],
                // JavaSE 三个阶段
                '/docs/Java/第一阶段':
                    [
                        {
                            text: '第一阶段', items:
                                [
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '内容大纲', link: '/docs/Java/韩顺平Java课程大纲.md',
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '学习方法', link: '/docs/Java/学习方法.md',
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '基本语法', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第一阶段/基本语法'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '面向对象基础', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第一阶段/面向对象基础'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '面向对象中级', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第一阶段/面向对象中级'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '项目', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第一阶段/项目'),
                                            ]
                                    },
                                ]
                        }
                    ],
                '/docs/Java/第二阶段':
                    [
                        {
                            text: '第二阶段', items:
                                [
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '面向对象高级', items:
                                            [
                                                ...setSidebarDefault("/docs/Java/第二阶段/面向对象高级"),
                                            ]
                                    },
                                    {text: '66.枚举', link: '/docs/Java/第二阶段/66.枚举.md'},
                                    {text: '67.注解', link: '/docs/Java/第二阶段/67.注解.md'},
                                    {text: '68.异常', link: '/docs/Java/第二阶段/68.异常.md'},
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '常用类', items:
                                            [
                                                ...setSidebarDefault("/docs/Java/第二阶段/常用类"),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '集合', items:
                                            [
                                                ...setSidebarDefault("/docs/Java/第二阶段/集合"),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '线程', items:
                                            [
                                                ...setSidebarDefault("/docs/Java/第二阶段/线程"),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: 'IO流文件', items:
                                            [
                                                ...setSidebarDefault("/docs/Java/第二阶段/IO流文件"),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '项目：坦克大战', items:
                                            [
                                                ...setSidebarDefault("/docs/Java/第二阶段/项目：坦克大战"),
                                            ]
                                    },
                                ]
                        }

                    ],
                '/docs/Java/第三阶段':
                    [
                        {
                            text: '第三阶段', items:
                                [
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '网络编程', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第三阶段/网络编程'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '反射', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第三阶段/反射'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: 'JDBC', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第三阶段/JDBC'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '正则表达式', items:
                                            [
                                                ...setSidebarDefault('/docs/Java/第三阶段/正则表达式'),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '项目', items:
                                            [
                                                {
                                                    collapsible: true,   // 允许折叠
                                                    collapsed: false,    // 一开始就展开
                                                    text: '多用户即时通讯系统', items:
                                                        [
                                                            ...setSidebarDefault('/docs/Java/第三阶段/项目/多用户即时通讯系统'),
                                                        ]
                                                },
                                                {
                                                    collapsible: true,   // 允许折叠
                                                    collapsed: false,    // 一开始就展开
                                                    text: '满汉楼', items:
                                                        [
                                                            ...setSidebarDefault('/docs/Java/第三阶段/项目/满汉楼'),
                                                        ]
                                                }
                                            ]
                                    },
                                ]
                        },
                    ],

                // Java8
                '/docs/Java/Java8':
                    [
                        {
                            text: 'Java8',
                            items:
                                [
                                    ...setSidebarDefault('/docs/Java/Java8'),
                                ]
                        }
                    ],

                // Java章节作业三个阶段
                '/docs/Java/章节作业/第一阶段':
                    [
                        {
                            text: '第一阶段',
                            items:
                                [
                                    {
                                        text: '第三章: 变量',
                                        link: '/docs/Java/章节作业/第一阶段/第三章：变量/第三章作业.md'
                                    },
                                    {
                                        text: '第四章: 运算符',
                                        link: '/docs/Java/章节作业/第一阶段/第四章：运算符/第四章作业.md'
                                    },
                                    {
                                        text: '第五章: 程序控制结构',
                                        link: '/docs/Java/章节作业/第一阶段/第五章：程序控制结构/第五章作业.md'
                                    },
                                    {
                                        text: '第六章: 数组',
                                        link: '/docs/Java/章节作业/第一阶段/第六章：数组/第六章作业.md'
                                    },
                                    {
                                        text: '第七章: 面向对象基础',
                                        link: '/docs/Java/章节作业/第一阶段/第七章：面向对象基础/第七章作业.md'
                                    },
                                    {
                                        text: '第八章: 面向对象中级',
                                        link: '/docs/Java/章节作业/第一阶段/第八章：面向对象中级/第八章作业.md'
                                    },
                                ]
                        },
                    ],
                '/docs/Java/章节作业/第二阶段':
                    [
                        {
                            text: '第二阶段',
                            items:
                                [
                                    {
                                        text: '第十章: 面向对象高级',
                                        link: '/docs/Java/章节作业/第二阶段/第十章：面向对象高级/第十章作业.md'
                                    },
                                    {
                                        text: '第十二章: 异常',
                                        link: '/docs/Java/章节作业/第二阶段/第十二章：异常/第十二章作业,.md'
                                    },
                                    {
                                        text: '第十三章: 常用类',
                                        link: '/docs/Java/章节作业/第二阶段/第十三章：常用类/第十三章作业.md'
                                    },
                                    {
                                        text: '第十四章: 集合',
                                        link: '/docs/Java/章节作业/第二阶段/第十四章：集合/第十四章作业.md'
                                    },
                                    {
                                        text: '第十五章: 泛型',
                                        link: '/docs/Java/章节作业/第二阶段/第十五章：泛型/第十五章作业.md'
                                    },
                                    {
                                        text: '第十六章: 多线程',
                                        link: '/docs/Java/章节作业/第二阶段/第十七章：多线程/第十七章作业.md'
                                    },
                                    {
                                        text: '第十九章: IO流',
                                        link: '/docs/Java/章节作业/第二阶段/第十九章：IO流/第十九章作业.md'
                                    }
                                ]
                        },
                    ],
                '/docs/Java/章节作业/第三阶段':
                    [
                        {
                            text: '第三阶段',
                            items:
                                [
                                    {
                                        text: '第二十一章: 网络编程',
                                        link: '/docs/Java/章节作业/第三阶段/第二十一章：网络编程/第二十一章作业.md'
                                    },
                                    {
                                        text: '第二十三章：反射',
                                        link: '/docs/Java/章节作业/第三阶段/第二十三章：反射/第二十三章作业.md'
                                    },
                                    {
                                        text: '第二十七章：正则表达式',
                                        link: '/docs/Java/章节作业/第三阶段/第二十七章：正则表达式/第二十七章作业.md'
                                    },
                                ]
                        }
                    ],
                '/docs/算法/数据结构/Java':
                    [
                        {
                            text: 'Java数据结构',
                            items:
                                [
                                    ...setSidebarDefault("/docs/算法/数据结构/Java"),
                                ]
                        }
                    ],
                '/docs/前端/微信小程序':
                    [
                        {
                            text: '微信小程序',
                            items:
                                [
                                    ...setSidebarDefault('/docs/前端/微信小程序')
                                ]
                        }
                    ],
                '/docs/后端/MySQL':
                    [
                        {
                            text: '软件安装',
                            items:
                                [
                                    {
                                        text: 'MySQL 5.7',
                                        link: '/docs/后端/MySQL/软件安装/MySQL安装..md',
                                    },
                                    {
                                        text: 'Navicat 16',
                                        link: "/docs/后端/MySQL/软件安装/Navicat安装.md",
                                    },
                                    {
                                        text: 'SQLyog',
                                        link: '/docs/后端/MySQL/软件安装/SQLyog安装.md'
                                    },
                                    {
                                        text: 'DataGrip',
                                        link: '/docs/后端/MySQL/软件安装/DataGrip安装.md'
                                    }

                                ]
                        },
                        {
                            text: 'MySQL',
                            items:
                                [
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '基础篇',
                                        items:
                                            [
                                                ...setSidebarDefault("/docs/后端/MySQL/MySQL/基础篇"),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '进阶篇',
                                        items:
                                            [
                                                ...setSidebarDefault("/docs/后端/MySQL/MySQL/进阶篇"),
                                            ]
                                    },
                                    {
                                        collapsible: true,   // 允许折叠
                                        collapsed: false,    // 一开始就展开
                                        text: '运维篇',
                                        items:
                                            [
                                                ...setSidebarDefault("/docs/后端/MySQL/MySQL/运维篇"),
                                            ]
                                    },

                                ]
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: 'MySQL作业',
                            items:
                                [
                                    {
                                        text: '1. 多表查询练习（必做）',
                                        link: "/docs/后端/MySQL/MYSQL作业/1. 多表查询练习（必做）.md"
                                    },
                                    {
                                        text: '2. 作业一',
                                        link: "/docs/后端/MySQL/MYSQL作业/2. 作业一.md"
                                    },
                                    {
                                        text: '3. 作业二',
                                        link: "/docs/后端/MySQL/MYSQL作业/3. 作业二.md"
                                    },
                                    {
                                        text: '4. 作业三',
                                        link: "/docs/后端/MySQL/MYSQL作业/4. 作业三.md"
                                    },
                                    {
                                        text: '5. 作业四',
                                        link: "/docs/后端/MySQL/MYSQL作业/5. 作业四.md"
                                    },
                                    {
                                        text: '6. 作业五',
                                        link: "/docs/后端/MySQL/MYSQL作业/6. 作业五.md"
                                    },
                                ]
                        }
                    ],
                '/docs/后端/Redis':
                    [
                        {
                            text: 'Redis',
                            items:
                                [
                                    ...setSidebarDefault('/docs/后端/Redis')
                                ]
                        }
                    ],
                '/docs/后端/Springboot':
                    [
                        {
                            text: "Springboot",
                            items:
                                [
                                    ...setSidebarDefault("/docs/后端/Springboot")
                                ]
                        }
                    ],
                '/docs/后端/设计模式':
                    [
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: '设计模式',
                            items:
                                [
                                    ...setSidebarDefault('/docs/后端/设计模式'),
                                ]
                        }
                    ],
                '/docs/后端/项目笔记':
                    [
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: "解决方案",
                            items:
                                [
                                    ...setSidebarDefault("/docs/后端/项目笔记/解决方案")
                                ]
                        },
                        {
                            collapsible: true,   // 允许折叠
                            collapsed: false,    // 一开始就展开
                            text: "工具与配置",
                            items:
                                [
                                    ...setSidebarDefault("/docs/后端/项目笔记/工具与配置")
                                ]
                        },
                    ],
                '/docs/后端/Spring':
                    [
                        {
                            text: 'Spring',
                            items:
                                [
                                    ...setSidebarDefault('/docs/后端/Spring')
                                ]
                        }
                    ],
                '/docs/后端/DevOps/Linux':
                    [
                        {
                            text: 'Linux',
                            items:
                                [
                                    ...setSidebarDefault('/docs/后端/DevOps/Linux')
                                ]
                        }
                    ],
                '/docs/后端/DevOps/Docker':
                    [
                        {
                            text: 'Docker',
                            items:
                                [
                                    ...setSidebarDefault("/docs/后端/DevOps/Docker")
                                ]
                        }
                    ],
                '/docs/项目/Tlias智能学习辅助系统/后端模块':
                    [
                        {
                            text: 'Tlias项目-后端模块',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/Tlias智能学习辅助系统/后端模块')
                                ]
                        }
                    ],
                '/docs/项目/Tlias智能学习辅助系统/前端模块':
                    [
                        {
                            text: 'Tlias项目-前端模块',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/Tlias智能学习辅助系统/前端模块')
                                ]
                        }
                    ],
                '/docs/项目/Tlias智能学习辅助系统/项目部署':
                    [
                        {
                            text: 'Tlias项目部署',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/Tlias智能学习辅助系统/项目部署')
                                ]
                        }
                    ],
                '/docs/项目/苍穹外卖/项目介绍':
                    [
                        {
                            text: '苍穹外卖-项目介绍',
                            items:
                                [
                                    {
                                        text: '初始化SQL脚本',
                                        link: '/docs/项目/苍穹外卖/项目介绍/初始化SQL脚本.md'
                                    },
                                    {
                                        text: '数据库设计文档',
                                        link: '/docs/项目/苍穹外卖/项目介绍/数据库设计文档.md'
                                    },
                                    {
                                        text: 'Day 1',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/项目/苍穹外卖/项目介绍/Day 1')
                                            ]
                                    }

                                ]
                        }
                    ],
                '/docs/项目/苍穹外卖/后端模块':
                    [
                        {
                            text: '苍穹外卖-后端模块',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/苍穹外卖/后端模块')
                                ]
                        }
                    ],
                '/docs/项目/苍穹外卖/前端模块':
                    [
                        {
                            text: '苍穹外卖-前端模块',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/苍穹外卖/前端模块')
                                ]
                        }
                    ],
                '/docs/项目/中州养老/项目介绍':
                    [
                        {
                            text: '中州养老-项目介绍',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/中州养老/项目介绍')
                                ]
                        }
                    ],
                '/docs/项目/中州养老/后端模块':
                    [
                        {
                            text: '中州养老-后端模块',
                            items:
                                [
                                    ...setSidebarDefault('/docs/项目/中州养老/后端模块')
                                ]
                        }
                    ],
                '/docs/Python/PyCharm/文章':
                    [
                        {
                            text: 'Python环境搭建',
                            items:
                                [
                                    ...setSidebarDefault('/docs/Python/PyCharm/文章'),
                                ]
                        }
                    ],
                '/docs/Python/爬虫':
                    [
                        {
                            text: 'Python爬虫🐍',
                            items:
                                [
                                    {text: '基本介绍', link: '/docs/Python/爬虫/基本介绍.md'},
                                    {
                                        text: 'Urllib',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/Python/爬虫/Urllib'),
                                            ]
                                    },
                                    {
                                        text: '解析',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/Python/爬虫/解析'),
                                            ]
                                    },
                                    {
                                        text: 'Selenium',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/Python/爬虫/Selenium'),
                                            ]
                                    },
                                    {
                                        text: 'requests',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/Python/爬虫/requests'),
                                            ]
                                    },
                                    {
                                        text: 'Scrapy',
                                        items:
                                            [
                                                ...setSidebarDefault('/docs/Python/爬虫/Scrapy'),
                                            ]
                                    },

                                ]
                        }
                    ]
            },


        socialLinks:
            [
                {icon: 'github', link: 'https://github.com/jackson-ling'},
                {
                    icon:
                        {
                            svg: '<svg t="1750513309725" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5442" width="128" height="128"><path d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m259.1488-568.8832H480.4096a25.2928 25.2928 0 0 0-25.2928 25.2928l-0.0256 63.2064c0 13.952 11.3152 25.2928 25.2672 25.2928h177.024c13.9776 0 25.2928 11.3152 25.2928 25.2672v12.6464a75.8528 75.8528 0 0 1-75.8528 75.8528H366.592a25.2928 25.2928 0 0 1-25.2672-25.2928v-240.1792a75.8528 75.8528 0 0 1 75.8272-75.8528h353.9456a25.2928 25.2928 0 0 0 25.2672-25.2928l0.0768-63.2064a25.2928 25.2928 0 0 0-25.2672-25.2928H417.152a189.6192 189.6192 0 0 0-189.6192 189.6448v353.9456c0 13.9776 11.3152 25.2928 25.2928 25.2928h372.9408a170.6496 170.6496 0 0 0 170.6496-170.6496v-145.408a25.2928 25.2928 0 0 0-25.2928-25.2672z" fill="#C71D23" p-id="5443"></path></svg>'
                        },
                    link: 'https://gitee.com/jacksonling'
                },
                {
                    icon: {
                        svg: '<svg t="1750519385670" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4924" width="128" height="128"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m17.067-413.525c34.85 4.352 68.778 5.12 102.741 2.099 23.04-2.048 44.817-8.363 64.17-21.914 38.213-26.794 49.784-85.197 24.252-123.05-14.626-21.71-36.812-30.345-60.757-35.5-35.055-7.543-70.451-5.75-105.847-3.412-5.667 0.358-6.759 3.072-7.237 8.209-3.072 32.682-6.536 65.314-9.813 97.962-2.509 24.815-4.932 49.63-7.51 75.606z m53.401-33.929c1.963-20.907 3.635-39.339 5.427-57.77 1.554-15.907 3.414-31.779 4.728-47.702 0.358-4.284 1.553-6.656 5.956-6.383 15.616 1.041 31.71 0.034 46.729 3.652 36.488 8.824 48.725 54.307 23.347 83.03-15.82 17.903-36.762 23.586-59.256 25.088-8.465 0.546-17.015 0.085-26.93 0.085zM512 434.296c-2.185-0.65-3.533-1.178-4.932-1.434-37.718-6.878-75.69-8.329-113.647-2.816-20.975 3.038-41.011 9.489-57.48 23.33-22.99 19.32-21.641 46.848 4.402 62.003 13.056 7.595 28.024 12.51 42.599 17.289 14.08 4.608 28.996 6.826 43.144 11.264 12.596 3.925 14.012 14.319 3.584 22.306-3.345 2.56-7.44 5.086-11.537 5.751-11.195 1.826-22.698 4.386-33.826 3.567-24.098-1.775-48.042-5.461-72.55-8.43-1.366 10.615-2.936 23.09-4.557 35.942 4.181 1.365 7.68 2.73 11.264 3.618 33.946 8.5 68.386 9.608 102.912 5.12 20.087-2.611 39.475-7.902 56.695-19.03 28.604-18.483 36.694-57.19-4.676-75.383-14.506-6.383-30.19-10.41-45.482-15.087-11.418-3.481-23.314-5.615-34.526-9.523-9.78-3.413-11.145-12.203-3.038-18.398 4.659-3.55 10.718-6.997 16.384-7.373a480.853 480.853 0 0 1 53.384-0.853c15.377 0.7 30.652 3.55 46.49 5.53L512 434.295z m257.143 2.047l-18.21 177.955h54.153c4.779-45.637 9.71-90.727 14.063-135.885 0.614-6.366 2.355-8.84 8.687-9.011 11.434-0.273 22.886-1.98 34.287-1.57 23.722 0.853 42.393 9.727 38.4 43.263-2.902 24.27-5.598 48.572-8.244 72.875-1.092 10.07-1.826 20.19-2.73 30.413h55.33c3.584-35.26 7.987-70.059 10.496-104.994 3.413-47.463-17.766-73.319-64.683-80.214-40.96-6.007-81.34-0.34-121.549 7.134zM285.645 570.948c-8.738 1.297-16.384 2.8-24.098 3.482-25.652 2.236-51.32 3.942-76.305-4.267-13.91-4.59-24.679-12.578-29.799-25.958-7.902-20.702 0.888-47.104 19.832-60.314 17.374-12.117 37.717-15.923 58.453-15.923 22.545-0.017 45.09 2.423 68.233 3.84l5.239-39.51c-15.07-1.723-29.491-3.925-43.998-4.915-41.011-2.798-80.64 2.612-117.47 20.463-30.02 14.558-52.053 36.011-58.675 68.13-7.85 38.145 11.537 69.496 51.763 85.846 19.15 7.765 39.288 12.51 60.007 12.595 24.746 0.102 49.493-1.57 74.206-2.952 3.106-0.171 8.311-2.902 8.67-5.035 1.98-11.554 2.73-23.28 3.942-35.465z" fill="#DD1700" p-id="4925"></path></svg>'

                    },
                    link: 'https://blog.csdn.net/jackson0607?spm=1000.2115.3001.5343'
                }
            ],
        footer: {
            // message: '个人知识文档网站',
            copyright: 'Copyright © 2025 Jackson 凌 All Rights Reserved. | 粤ICP备2025441629号-1 ',
        },

        // 设置主页收缩框
        search: {
            provider: "local",
            options: {
                translations: {
                    button: {
                        buttonText: "搜索文档",
                        buttonAriaLabel: "搜索文档",
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "清除查询条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                        },
                    },
                },
            },
        },
    },
    // markdown 配置
    markdown:
        {
            // 代码块双主题：亮色 github-light，暗色 one-dark-pro
            theme: {
                light: 'github-light',
                dark: 'one-dark-pro',
            },

            // 代码块显示行数
            lineNumbers: true,

            // 全局定义容器名称
            container: {
                tipLabel: '提示',
                warningLabel: '警告',
                dangerLabel: '危险',
                infoLabel: '信息',
                detailsLabel: '详细信息'
            },

            // 注册 :::timeline 自定义容器
            config: (md) => {
                md.use(require('markdown-it-container'), 'timeline', {
                    render(tokens, idx) {
                        return tokens[idx].nesting === 1
                            ? '<div class="site-timeline">\n'
                            : '</div>\n'
                    }
                })
            },
        },
})
