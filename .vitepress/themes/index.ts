/**
 * 多主题注册表与解析中心
 */

import type { Theme } from 'vitepress'
import defaultTheme from './default'
import minimalTheme from './minimal'

export const themes: Record<string, Theme> = {
    default: defaultTheme,
    minimal: minimalTheme
}

/**
 * 根据主题名称或环境变量 VITE_BLOG_THEME 解析目标主题
 * @param themeName 可选显式传入主题名称
 * @returns 对应的 VitePress Theme 实例
 */
export function resolveTheme(themeName?: string): Theme {
    const target = themeName || (typeof process !== 'undefined' ? process.env.VITE_BLOG_THEME : undefined) || 'default'
    const theme = themes[target]
    if (!theme) {
        console.warn(`[ThemeDispatcher] Theme "${target}" not found, fallback to "default".`)
        return defaultTheme
    }
    return theme
}
