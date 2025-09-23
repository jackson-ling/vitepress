import path from 'node:path'
import fs from 'node:fs'

// 文件根目录
const DIR_PATH = path.resolve()
// 白名单，过滤掉不是文章的文件和文件夹
const WHITE_LIST = ['index.md', '.vitepress', 'node_modules', '.idea', 'assets']

// 判断是否是文件夹
const isDirectory = (filePath) => fs.lstatSync(filePath).isDirectory()

// 取差值
const intersections = (arr1, arr2) => arr1.filter(item => !arr2.includes(item))

// 把方法导出直接使用
function getList(params, path1, pathname, isRoot = false) {
    // 存放结果
    const res = []

    // 开始遍历params
    for (let file of params) {
        // 拼接目录
        const dir = path.join(path1, file)
        // 判断是否是文件夹
        const isDir = isDirectory(dir)
        if (isDir) {
            // 如果是文件夹, 读取之后作为下一次递归参数
            const files = fs.readdirSync(dir)
            // 排除白名单中的文件夹
            const subItems = intersections(files, WHITE_LIST)
            res.push({
                text: file,
                collapsible: isRoot, // 只有根目录设置折叠功能
                collapsed: false, // 默认全部内容展开
                items: getList(subItems, dir, `${pathname}/${file}`),
            })
        } else {
            // 获取文件名，并去除扩展名
            const name = path.basename(file, '.md')
            // 排除非 .md 文件
            const suffix = path.extname(file)
            if (suffix !== '.md') {
                continue
            }
            res.push({
                text: name, // 不显示 .md 后缀
                link: `${pathname}/${name}`, // 保留文件名作为链接
            })
        }
    }
    return res
}

export const set_sidebar = (pathname) => {
    // 获取pathname的路径
    const dirPath = path.join(DIR_PATH, pathname)
    // 读取pathname下的所有文件或者文件夹
    const files = fs.readdirSync(dirPath)
    // 过滤掉白名单中的文件和文件夹
    const items = intersections(files, WHITE_LIST)
    // 使用 getList 函数生成侧边栏，根目录设置为折叠
    return getList(items, dirPath, pathname, true) // 设置根目录为可折叠
};
