import { describe, test, expect } from 'vitest'
import { initCategory, initTags, useYearSort } from '../.vitepress/core'
import type { Post } from '../.vitepress/core'

const mockPosts: Post[] = [
    {
        regularPath: '/posts/2026/p1.html',
        frontMatter: {
            title: 'Post 1',
            date: '2026-05-10',
            category: 'Tech',
            tags: ['Vue', 'Vite']
        }
    },
    {
        regularPath: '/posts/2026/p2.html',
        frontMatter: {
            title: 'Post 2',
            date: '2026-06-01',
            category: 'Life',
            tags: ['Vue']
        }
    },
    {
        regularPath: '/posts/2025/p3.html',
        frontMatter: {
            title: 'Post 3',
            date: '2025-12-01',
            category: 'Tech',
            tags: ['Architecture', 'Vue']
        }
    },
    {
        regularPath: '/posts/2025/p4.html',
        frontMatter: {
            title: 'Post 4 (No category & tags)',
            date: '2025-01-15'
        }
    }
]

describe('taxonomy utilities (initCategory, initTags, useYearSort)', () => {
    describe('initCategory', () => {
        test('groups posts by category correctly and ignores uncategorized', () => {
            const categories = initCategory(mockPosts)
            expect(Object.keys(categories)).toEqual(['Tech', 'Life'])
            expect(categories['Tech'].length).toBe(2)
            expect(categories['Life'].length).toBe(1)
            expect(categories['Tech'].map((p) => p.frontMatter.title)).toContain('Post 1')
            expect(categories['Tech'].map((p) => p.frontMatter.title)).toContain('Post 3')
        })

        test('handles empty posts gracefully', () => {
            expect(initCategory([])).toEqual({})
        })
    })

    describe('initTags', () => {
        test('aggregates posts by tags and sorts by frequency descending', () => {
            const tags = initTags(mockPosts)
            // 'Vue' 出现 3 次，应该排在第一位
            const tagKeys = Object.keys(tags)
            expect(tagKeys[0]).toBe('Vue')
            expect(tags['Vue'].length).toBe(3)
            expect(tags['Vite'].length).toBe(1)
            expect(tags['Architecture'].length).toBe(1)
        })

        test('handles empty posts gracefully', () => {
            expect(initTags([])).toEqual({})
        })
    })

    describe('useYearSort', () => {
        test('groups posts by year descending and sorts inner posts by date descending', () => {
            const grouped = useYearSort(mockPosts)
            expect(grouped.length).toBe(2)

            // 第一组是 2026
            expect(grouped[0][0].frontMatter.date).toBe('2026-06-01')
            expect(grouped[0][1].frontMatter.date).toBe('2026-05-10')

            // 第二组是 2025
            expect(grouped[1][0].frontMatter.date).toBe('2025-12-01')
            expect(grouped[1][1].frontMatter.date).toBe('2025-01-15')
        })
    })
})
