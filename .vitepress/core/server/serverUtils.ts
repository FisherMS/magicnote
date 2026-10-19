/**
 * Node 端 Markdown 检索与文章数据提取服务
 */

import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'fs-extra'
import { resolve } from 'path'
import { convertDateV2 } from '../utils/date'
import type { Post } from '../types'

export async function getPosts(
    pageSize: number,
    isProd: boolean = true,
    excludePosts: string[] = ['README.md'],
    devFolders: string[] = []
): Promise<Post[]> {
    const showFolders = !isProd ? devFolders : ['posts/**/**.md']
    const ignorePaths = isProd ? excludePosts : []

    const paths = await globby(showFolders, {
        ignore: ignorePaths
    })

    // 数据清洗管道
    const posts: Post[] = await Promise.all(
        paths.map(async (item) => {
            const content = await fs.readFile(item, 'utf-8')
            return _normalizePost(item, content)
        })
    )

    // 强类型稳定双因子排序
    const sortedPosts = posts.sort(_compareDate)

    // 构建期生成分页 markdown 文件 (按需注入图片静态依赖)
    await generatePaginationPages(sortedPosts, pageSize)

    return sortedPosts
}

export function _normalizePost(filePath: string, rawContent: string): Post {
    const { data } = matter(rawContent)
    const order = _convertOrder(data.order)
    return {
        frontMatter: {
            ...data,
            date: convertDateV2(data.date),
            order,
            title: data.title || ''
        },
        regularPath: `/${filePath.replace('.md', '.html')}`
    }
}

export interface ExtractedImage {
    postIndex: number
    rawUrl: string
    importPath: string
    varName: string
}

export function _extractDescriptionImages(pagePosts: Post[], basePath: string = resolve('./')): ExtractedImage[] {
    const images: ExtractedImage[] = []

    pagePosts.forEach((post, postIdx) => {
        const description = post.frontMatter?.description
        if (!description || typeof description !== 'string') return

        const regularPath = post.regularPath || ''
        const lastSlash = regularPath.lastIndexOf('/')
        const postDir = lastSlash !== -1 ? regularPath.substring(1, lastSlash) : ''

        let imgCount = 0
        const recordImage = (rawUrl: string) => {
            const trimmed = rawUrl.trim()
            if (/^(https?:|\/|#|mailto:|data:)/i.test(trimmed)) return

            const cleanRel = trimmed.replace(/^\.\//, '')
            const importPath = `./${postDir ? postDir + '/' : ''}${cleanRel}`
            const fullDiskPath = resolve(basePath, importPath)

            if (fs.existsSync(fullDiskPath)) {
                images.push({
                    postIndex: postIdx,
                    rawUrl: trimmed,
                    importPath,
                    varName: `_img_${postIdx}_${imgCount++}`
                })
            }
        }

        const mdRegex = /!\[.*?\]\(([^)]+)\)/g
        let mdMatch: RegExpExecArray | null
        while ((mdMatch = mdRegex.exec(description)) !== null) {
            recordImage(mdMatch[1])
        }

        const htmlRegex = /<img\b[^>]*?\bsrc=["']([^"']+)["']/gi
        let htmlMatch: RegExpExecArray | null
        while ((htmlMatch = htmlRegex.exec(description)) !== null) {
            recordImage(htmlMatch[1])
        }
    })

    return images
}

export function _buildPageTemplate(
    pageIndex: number,
    totalPages: number,
    pageSize: number,
    images: ExtractedImage[] = []
): string {
    const isFirstPage = pageIndex === 1
    const title = isFirstPage ? 'home' : `page_${pageIndex}`
    const sliceStart = pageSize * (pageIndex - 1)
    const sliceEnd = pageSize * pageIndex

    if (images.length === 0) {
        return `
---
page: true
title: ${title}
aside: false
comment: false
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(${sliceStart},${sliceEnd});
</script>
<Page :posts="posts" :pageCurrent="${pageIndex}" :pagesNum="${totalPages}" />
`.trim()
    }

    const importStatements = images.map((img) => `import ${img.varName} from "${img.importPath}";`).join('\n')

    const replacementsByPost = new Map<number, ExtractedImage[]>()
    for (const img of images) {
        if (!replacementsByPost.has(img.postIndex)) {
            replacementsByPost.set(img.postIndex, [])
        }
        replacementsByPost.get(img.postIndex)!.push(img)
    }

    const mappingCode = Array.from(replacementsByPost.entries())
        .map(([postIdx, imgs]) => {
            const replaces = imgs.map((img) => `.replace(${JSON.stringify(img.rawUrl)}, ${img.varName})`).join('')
            return `if (idx === ${postIdx} && copy.frontMatter?.description) {
        copy.frontMatter.description = copy.frontMatter.description${replaces};
    }`
        })
        .join('\n    ')

    return `
---
page: true
title: ${title}
aside: false
comment: false
---
<script setup>
import { useData } from "vitepress";
${importStatements}

const { theme } = useData();
const rawPosts = theme.value.posts.slice(${sliceStart},${sliceEnd});
const posts = rawPosts.map((p, idx) => {
    const copy = { ...p, frontMatter: { ...p.frontMatter } };
    ${mappingCode}
    return copy;
});
</script>
<Page :posts="posts" :pageCurrent="${pageIndex}" :pagesNum="${totalPages}" />
`.trim()
}

export async function generatePaginationPages(postsOrTotal: Post[] | number, pageSize: number) {
    const isArray = Array.isArray(postsOrTotal)
    const total = isArray ? postsOrTotal.length : postsOrTotal
    const pagesNum = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1
    const basePath = resolve('./')

    if (total > 0) {
        for (let i = 1; i < pagesNum + 1; i++) {
            const pagePosts = isArray ? postsOrTotal.slice(pageSize * (i - 1), pageSize * i) : []
            const images = isArray ? _extractDescriptionImages(pagePosts, basePath) : []
            const page = _buildPageTemplate(i, pagesNum, pageSize, images)

            const file = `${basePath}/page_${i}.md`
            await fs.writeFile(file, page)
        }
    }
    // 将 page_1 重命名为 index 承载首页
    await fs.move(`${basePath}/page_1.md`, `${basePath}/index.md`, { overwrite: true })
}

export function _compareDate(
    obj1: { frontMatter: { date: number | string; order?: number } },
    obj2: { frontMatter: { date: number | string; order?: number } }
): number {
    const order1 = typeof obj1.frontMatter.order === 'number' ? obj1.frontMatter.order : 0
    const order2 = typeof obj2.frontMatter.order === 'number' ? obj2.frontMatter.order : 0
    const orderCompare = order2 - order1
    if (orderCompare !== 0) return orderCompare

    const d1 = String(obj1.frontMatter.date)
    const d2 = String(obj2.frontMatter.date)
    if (d1 === d2) return 0
    return d1 < d2 ? 1 : -1
}

export function _convertOrder(input?: unknown): number {
    if (input === undefined || input === null) return 0
    if (typeof input === 'number') return input
    const num = Number(input)
    return isNaN(num) ? 0 : num
}
