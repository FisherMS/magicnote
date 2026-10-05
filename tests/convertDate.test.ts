import { describe, test, expect } from 'vitest'
import { convertDateV2 } from '../.vitepress/theme/date' // 根据实际路径修改

describe('convertDateV2', () => {
    // 测试有效 Date 对象
    test('handles valid Date objects', () => {
        const date = new Date(2023, 9, 5) // 注意：月份从 0 开始（10月）
        expect(convertDateV2(date)).toBe('2023-10-05')
    })

    // 测试 ISO 格式字符串
    test('converts ISO strings to formatted date', () => {
        expect(convertDateV2('2025-05-01T12:30:00Z')).toBe('2025-05-01')
        expect(convertDateV2('1998-12-31T23:59:59.999Z')).toBe('1998-12-31')
    })

    // 测试日期+时间字符串
    test('formats date+time strings with padding', () => {
        expect(convertDateV2('2023-10-05 9:5')).toBe('2023-10-05 09:05')
        expect(convertDateV2('2000-01-01 0:0:0')).toBe('2000-01-01 00:00')
    })

    // 测试纯日期字符串
    test('returns pure date strings as-is', () => {
        expect(convertDateV2('2023-10-05')).toBe('2023-10-05')
        expect(convertDateV2('  1999-12-31  ')).toBe('1999-12-31') // 测试前后空格
    })

    // 测试无效输入
    test('handles invalid inputs', () => {
        // 无效 Date 对象
        expect(convertDateV2(new Date('invalid'))).toBe('')
        // 无效字符串格式
        expect(convertDateV2('not-a-date')).toBe('')
        // 空字符串
        expect(convertDateV2('')).toBe('')
        // @ts-ignore 测试非法类型（需要忽略 TS 类型检查）
        expect(convertDateV2(123)).toBe('')
    })

    // 测试边界值
    test('handles edge cases', () => {
        // 闰年测试
        expect(convertDateV2('2024-02-29 23:59')).toBe('2024-02-29 23:59')
        // 午夜时间
        expect(convertDateV2('2000-01-01 00:00')).toBe('2000-01-01 00:00')
        // 单数字月份和日期
        expect(convertDateV2('2023-3-5 1:2')).toBe('2023-3-5 01:02')
    })

    // 测试时区敏感性
    test('handles timezone correctly', () => {
        // 注意：此测试假设运行在 UTC 时区
        const utcDate = new Date('2023-10-05T00:00:00Z')
        expect(convertDateV2(utcDate)).toBe('2023-10-05')

        // 本地时间转换测试（需根据实际时区调整）
        const localDate = new Date(2023, 9, 5, 12, 30) // 本地时间 2023-10-05
        expect(convertDateV2(localDate)).toBe('2023-10-05')
    })
})
