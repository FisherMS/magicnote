import { describe, test, expect } from 'vitest'
import { renderDescriptionMarkdown, hasImageInDescription } from '../.vitepress/theme/functions'

describe('renderDescriptionMarkdown', () => {
    test('renders plain text and basic formatting', () => {
        const input = '这是**粗体**与*斜体*'
        const output = renderDescriptionMarkdown(input)
        expect(output).toContain('<strong>粗体</strong>')
        expect(output).toContain('<em>斜体</em>')
    })

    test('handles empty or non-string inputs gracefully', () => {
        expect(renderDescriptionMarkdown('')).toBe('')
        expect(renderDescriptionMarkdown('   ')).toBe('')
        // @ts-ignore
        expect(renderDescriptionMarkdown(null)).toBe('')
        // @ts-ignore
        expect(renderDescriptionMarkdown(undefined)).toBe('')
    })

    test('rewrites relative paths when regularPath is provided', () => {
        const input = `文件： [download](./assets/test.zip)\n![screenshot](./images/pic.png)`
        const regularPath = '/posts/draft/my-article.html'
        const output = renderDescriptionMarkdown(input, regularPath)

        // 验证相对路径已替换为基于 /posts/draft 的路径
        expect(output).toContain('href="/posts/draft/assets/test.zip"')
        expect(output).toContain('src="/posts/draft/images/pic.png"')
    })

    test('preserves absolute URLs and external protocols', () => {
        const input = `[website](https://aicro.net) [local](/assets/logo.png) [anchor](#section)`
        const regularPath = '/posts/2026/test.html'
        const output = renderDescriptionMarkdown(input, regularPath)

        expect(output).toContain('href="https://aicro.net"')
        expect(output).toContain('href="/assets/logo.png"')
        expect(output).toContain('href="#section"')
    })
})

describe('hasImageInDescription', () => {
    test('returns true when description contains Markdown images', () => {
        expect(hasImageInDescription('文件：\n![image](./test.png)')).toBe(true)
        expect(hasImageInDescription('前缀 ![alt text](https://aicro.net/pic.jpg) 后缀')).toBe(true)
    })

    test('returns true when description contains HTML <img> tags', () => {
        expect(hasImageInDescription('这是一段文本 <img src="/test.png" alt="demo">')).toBe(true)
        expect(hasImageInDescription('<img src="foo.jpg"/>')).toBe(true)
    })

    test('returns false for plain text and non-image links', () => {
        expect(hasImageInDescription('这是一段纯文字摘要')).toBe(false)
        expect(hasImageInDescription('下载文件： [followbook.zip](./download/file.zip)')).toBe(false)
        expect(hasImageInDescription('包含 [网页链接](https://aicro.net) 和 **加粗文本**')).toBe(false)
    })

    test('handles empty or invalid inputs safely', () => {
        expect(hasImageInDescription('')).toBe(false)
        expect(hasImageInDescription('   ')).toBe(false)
        // @ts-ignore
        expect(hasImageInDescription(null)).toBe(false)
        // @ts-ignore
        expect(hasImageInDescription(undefined)).toBe(false)
    })
})

