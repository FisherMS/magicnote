import { describe, test, expect } from 'vitest'
import { generatePaginationArray } from '../.vitepress/core'
import { _extractDescriptionImages, _buildPageTemplate } from '../.vitepress/core/server/serverUtils'
import type { Post } from '../.vitepress/core/types'
import fs from 'fs-extra'
import { resolve } from 'path'

describe('generatePaginationArray', () => {
    test('returns full array without ellipsis when pagesNum <= maxItems', () => {
        expect(generatePaginationArray(5, 1)).toEqual([1, 2, 3, 4, 5])
        expect(generatePaginationArray(11, 6, 11)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    })

    test('handles currentPage near start with trailing ellipsis', () => {
        const result = generatePaginationArray(20, 2, 11)
        expect(result[0]).toBe(1)
        expect(result[1]).toBe(2)
        expect(result).toContain('...')
        expect(result[result.length - 2]).toBe(19)
        expect(result[result.length - 1]).toBe(20)
    })

    test('handles currentPage near end with leading ellipsis', () => {
        const result = generatePaginationArray(20, 19, 11)
        expect(result[0]).toBe(1)
        expect(result[1]).toBe(2)
        expect(result).toContain('...')
        expect(result[result.length - 2]).toBe(19)
        expect(result[result.length - 1]).toBe(20)
    })

    test('handles currentPage in middle with dual ellipses', () => {
        const result = generatePaginationArray(20, 10, 11)
        const ellipses = result.filter((item) => item === '...')
        expect(ellipses.length).toBe(2)
        expect(result[0]).toBe(1)
        expect(result[1]).toBe(2)
        expect(result).toContain(10)
        expect(result[result.length - 2]).toBe(19)
        expect(result[result.length - 1]).toBe(20)
    })

    test('clamps invalid boundaries defensively', () => {
        expect(generatePaginationArray(-5, -1)).toEqual([1])
        expect(generatePaginationArray(0, 10)).toEqual([1])
    })
})

describe('generatePaginationPages helpers', () => {
    test('_extractDescriptionImages extracts existing relative images', () => {
        const tmpDir = resolve('./tests/.tmp-test-images')
        fs.ensureDirSync(resolve(tmpDir, 'posts/2026/flashnote-v1-release'))
        fs.writeFileSync(resolve(tmpDir, 'posts/2026/flashnote-v1-release/image-20261016-220355.png'), '')

        try {
            const mockPosts: Post[] = [
                {
                    regularPath: '/posts/2026/flashnote-v1-release.html',
                    frontMatter: {
                        title: 'Test Post',
                        date: '2026-10-18',
                        description: '![image](./flashnote-v1-release/image-20261016-220355.png) Some text'
                    }
                },
                {
                    regularPath: '/posts/2026/another.html',
                    frontMatter: {
                        title: 'External image',
                        date: '2026-10-18',
                        description: '![ext](https://example.com/pic.png)'
                    }
                }
            ]

            const images = _extractDescriptionImages(mockPosts, tmpDir)
            expect(images.length).toBe(1)
            expect(images[0]).toEqual({
                postIndex: 0,
                rawUrl: './flashnote-v1-release/image-20261016-220355.png',
                importPath: './posts/2026/flashnote-v1-release/image-20261016-220355.png',
                varName: '_img_0_0'
            })
        } finally {
            fs.removeSync(tmpDir)
        }
    })

    test('_buildPageTemplate generates standard template when images is empty', () => {
        const template = _buildPageTemplate(1, 5, 10, [])
        expect(template).toContain('title: home')
        expect(template).toContain('const posts = theme.value.posts.slice(0,10);')
        expect(template).not.toContain('import _img')
    })

    test('_buildPageTemplate generates ESM imports and replacement mapping when images exist', () => {
        const template = _buildPageTemplate(1, 5, 10, [
            {
                postIndex: 0,
                rawUrl: './flashnote-v1-release/image-20261016-220355.png',
                importPath: './posts/2026/flashnote-v1-release/image-20261016-220355.png',
                varName: '_img_0_0'
            }
        ])
        expect(template).toContain(
            'import _img_0_0 from "./posts/2026/flashnote-v1-release/image-20261016-220355.png";'
        )
        expect(template).toContain('.replace("./flashnote-v1-release/image-20261016-220355.png", _img_0_0)')
    })
})
