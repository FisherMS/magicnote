type Post = {
    frontMatter: {
        date: string
        title: string
        category: string
        tags: string[]
        description: string
    }
    regularPath: string
}

export function initTags(posts: Post[]): Record<string, Post[]> {
    const data: Record<string, Post[]> = {}
    posts.forEach((post) => {
        post.frontMatter.tags?.forEach((tag) => {
            data[tag] = data[tag] || []
            data[tag].push(post)
        })
    })

    return Object.fromEntries(Object.entries(data).sort(([, posts1], [, posts2]) => posts2.length - posts1.length))
}

export function initCategory(posts: Post[]) {
    const data: Record<string, Post[]> = {}
    for (let index = 0; index < posts.length; index++) {
        const element = posts[index]
        const category = element.frontMatter.category
        if (category) {
            if (data[category]) {
                data[category].push(element)
            } else {
                data[category] = []
                data[category].push(element)
            }
        }
    }
    return data
}

export function useYearSort(posts: Post[]): Post[][] {
    const grouped: Record<string, Post[]> = {}

    posts.forEach((post) => {
        const dateStr = post.frontMatter.date
        const year = new Date(dateStr).getFullYear().toString()
        if (!grouped[year]) {
            grouped[year] = []
        }
        grouped[year].push(post)
    })

    const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

    return sortedYears.map((year) => grouped[year].sort((a, b) => b.frontMatter.date.localeCompare(a.frontMatter.date)))
}

import { marked } from 'marked'

marked.setOptions({
    gfm: true,
    breaks: true
})

/**
 * 将 FrontMatter 中的 Markdown 编译为 HTML，并自动将相对路径转换为正确绝对路径
 * @param content 原始 Markdown 字符串
 * @param regularPath 文章的路由路径（如 /posts/draft/example.html）
 */
export function renderDescriptionMarkdown(content?: string, regularPath?: string): string {
    if (!content || typeof content !== 'string') return ''

    let processed = content.trim()
    if (!processed) return ''

    // 若提供了文章路由路径，自动修正其中的相对路径（针对图片与文件链接）
    if (regularPath) {
        const lastSlashIndex = regularPath.lastIndexOf('/')
        const baseDir = lastSlashIndex !== -1 ? regularPath.substring(0, lastSlashIndex) : ''

        if (baseDir) {
            // 匹配 Markdown 中的链接与图片 [text](url) 或 ![alt](url)
            processed = processed.replace(
                /(!?\[.*?\]\()([^)]+)(\))/g,
                (match, prefix, url, suffix) => {
                    const trimmedUrl = url.trim()
                    if (/^(https?:|\/|#|mailto:)/i.test(trimmedUrl)) {
                        return match
                    }
                    const cleanUrl = trimmedUrl.replace(/^\.\//, '')
                    return `${prefix}${baseDir}/${cleanUrl}${suffix}`
                }
            )
        }
    }

    try {
        return marked.parse(processed, { async: false }) as string
    } catch (e) {
        console.error('Failed to parse description markdown:', e)
        return content
    }
}

/**
 * 动态检测摘要文本中是否包含图片（同时支持 Markdown 语法与原生 HTML <img> 标签）
 * @param content 摘要文本
 * @returns true 表示包含图片，false 表示为纯文本/无图片
 */
export function hasImageInDescription(content?: string): boolean {
    if (!content || typeof content !== 'string') return false
    // 匹配 Markdown 语法 ![alt](url) 或 HTML 语法 <img ...>
    return /!\[.*?\](?:\(.*?\)|\[.*?\])|<img\b[^>]*>/i.test(content)
}
