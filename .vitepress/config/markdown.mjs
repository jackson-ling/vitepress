import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** Markdown 渲染、Shiki 与 :::timeline 容器配置。 */
export const markdown = {
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
}
