/**
 * gen_sidebar.js — 自动生成 VitePress 侧边栏配置
 *
 * 工作原理：
 *   1. 读取指定目录下的所有文件和子文件夹
 *   2. 过滤掉白名单中的非文章文件（如 index.md、assets 等）
 *   3. 递归生成嵌套的侧边栏结构，文件夹为可折叠分组，.md 文件为链接项
 *   4. 文件按名称中的数字自然排序（如 1.xx < 2.xx < 10.xx）
 *
 * 使用方式：
 *   在 config.mjs 中导入并调用 set_sidebar('/docs/xxx')，
 *   返回值可直接展开到 sidebar 配置的 items 数组中。
 */
import path from 'node:path'
import fs from 'node:fs'

/** 项目根目录（process.cwd()），所有路径基于此计算 */
const DIR_PATH = path.resolve()

/**
 * 白名单 — 这些文件/文件夹不会出现在侧边栏中
 * 如需排除其他目录，直接在此数组中添加名称即可
 */
const WHITE_LIST = ['index.md', '.vitepress', 'node_modules', '.idea', 'assets']

/**
 * 判断路径是否为文件夹
 * @param {string} filePath - 绝对路径
 * @returns {boolean}
 */
const isDirectory = (filePath) => fs.lstatSync(filePath).isDirectory()

/**
 * 数组差集 — 从 arr1 中排除 arr2 包含的元素
 * @param {string[]} arr1 - 原始数组
 * @param {string[]} arr2 - 需要排除的元素
 * @returns {string[]} 差集结果
 */
const difference = (arr1, arr2) => arr1.filter(item => !arr2.includes(item))

/**
 * 自然排序 — 按文件名中的数字排序
 * 例如：'1.概述.md' < '2.变量.md' < '10.数组.md'
 * @param {string} a - 文件名
 * @param {string} b - 文件名
 * @returns {number}
 */
const naturalSort = (a, b) => {
    const aNum = parseInt(a.match(/\d+/)?.[0] ?? '0', 10)
    const bNum = parseInt(b.match(/\d+/)?.[0] ?? '0', 10)
    return aNum - bNum
}

/**
 * 递归生成侧边栏 items 数组
 *
 * @param {string[]} params - 当前目录下的文件/文件夹名称列表（已过滤白名单）
 * @param {string} path1 - 当前目录的绝对路径
 * @param {string} pathname - 当前目录的 URL 路径（如 /docs/Java/第一阶段）
 * @param {boolean} isRoot - 是否为根目录层级（根目录的分组默认可折叠）
 * @returns {Array<{text: string, items?: Array, link?: string, collapsible?: boolean, collapsed?: boolean}>}
 */
function getList(params, path1, pathname, isRoot = false) {
    const res = []
    // 文件按名称中的数字自然排序
    params.sort(naturalSort)

    for (let file of params) {
        const dir = path.join(path1, file)
        const isDir = isDirectory(dir)

        if (isDir) {
            // 文件夹 → 递归生成子项，根目录层级设置 collapsible
            const files = fs.readdirSync(dir)
            const subItems = difference(files, WHITE_LIST)
            res.push({
                text: file,
                collapsible: isRoot,
                collapsed: false,
                items: getList(subItems, dir, `${pathname}/${file}`),
            })
        } else {
            // 文件 → 仅保留 .md 文件，去除扩展名作为显示文本
            const name = path.basename(file, '.md')
            const suffix = path.extname(file)
            if (suffix !== '.md') {
                continue
            }
            res.push({
                text: name,
                link: `${pathname}/${name}`,
            })
        }
    }
    return res
}

/**
 * 生成指定目录的侧边栏配置
 *
 * 使用方式（在 config.mjs 中）：
 *   import { set_sidebar } from './gen_sidebar.js'
 *   sidebar: {
 *     '/docs/Java/第一阶段': [
 *       { text: '章节', items: [...set_sidebar('/docs/Java/第一阶段')] }
 *     ]
 *   }
 *
 * @param {string} pathname - URL 路径（如 '/docs/Java/第一阶段'）
 * @returns {Array} 可直接展开到 sidebar items 中的侧边栏配置数组
 */
export const set_sidebar = (pathname) => {
    // 去除前导 /，确保 path.join 正确拼接为项目内相对路径
    const relPath = pathname.replace(/^\//, '')
    const dirPath = path.join(DIR_PATH, relPath)

    // 目录不存在时返回空数组，避免构建报错
    if (!fs.existsSync(dirPath)) {
        return []
    }

    const files = fs.readdirSync(dirPath)
    const items = difference(files, WHITE_LIST)
    return getList(items, dirPath, pathname, true)
}
