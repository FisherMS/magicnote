import { describe, it, expect } from 'vitest'
import { _convertOrder, _compareDate } from '../.vitepress/theme/serverUtils'

describe('serverUtils order and sorting logic', () => {
    describe('_convertOrder', () => {
        it('should return 0 for undefined or null', () => {
            expect(_convertOrder(undefined)).toBe(0)
            expect(_convertOrder(null)).toBe(0)
        })

        it('should return the numeric value if number is provided', () => {
            expect(_convertOrder(5)).toBe(5)
            expect(_convertOrder(0)).toBe(0)
            expect(_convertOrder(-1)).toBe(-1)
        })

        it('should convert valid number string to number', () => {
            expect(_convertOrder('10')).toBe(10)
            expect(_convertOrder('3.5')).toBe(3.5)
        })

        it('should return 0 for non-numeric string or invalid input', () => {
            expect(_convertOrder('abc')).toBe(0)
            expect(_convertOrder({})).toBe(0)
            expect(_convertOrder([])).toBe(0)
        })
    })

    describe('_compareDate with order & top', () => {
        it('should prioritize higher order over lower order regardless of date', () => {
            const post1 = { frontMatter: { date: 20261001, order: 1 } }
            const post2 = { frontMatter: { date: 20260901, order: 5 } }

            // post2 has higher order (5 > 1), so sorting descending should place post2 first
            const list = [post1, post2].sort(_compareDate)
            expect(list[0]).toBe(post2)
            expect(list[1]).toBe(post1)
        })

        it('should fallback to date comparison when order is identical or 0', () => {
            const newerPost = { frontMatter: { date: 20261002, order: 0 } }
            const olderPost = { frontMatter: { date: 20261001, order: 0 } }

            const list = [olderPost, newerPost].sort(_compareDate)
            expect(list[0]).toBe(newerPost)
            expect(list[1]).toBe(olderPost)
        })

        it('should handle undefined or default 0 order gracefully', () => {
            const normalPost = { frontMatter: { date: 20260101, order: 0 } }
            const orderedPost = { frontMatter: { date: 20250101, order: 2 } }

            const list = [normalPost, orderedPost].sort(_compareDate)
            expect(list[0]).toBe(orderedPost)
            expect(list[1]).toBe(normalPost)
        })
    })
})
