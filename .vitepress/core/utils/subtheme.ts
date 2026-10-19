/**
 * 子主题（Sub-theme）运行时管理与状态同步核心纯函数
 */

import type { SubThemeItem } from '../types'

export const SUBTHEME_STORAGE_KEY = 'magicnote-subtheme'
export const SUBTHEME_ATTRIBUTE = 'data-subtheme'

/**
 * 内置预设子主题集合
 */
export const PRESET_SUBTHEMES: SubThemeItem[] = [
    {
        id: 'default',
        name: '经典蓝',
        description: '默认清晰明朗的经典科技蓝调',
        primaryColor: '#2563eb'
    },
    {
        id: 'nord',
        name: '极光灰',
        description: '北欧极光冷淡优雅配色',
        primaryColor: '#88c0d0'
    },
    {
        id: 'warm-paper',
        name: '暖阳纸',
        description: '温润护眼的仿纸质书卷感',
        primaryColor: '#d97706'
    },
    {
        id: 'forest',
        name: '苍翠森',
        description: '深沉自然的翡翠青翠色系',
        primaryColor: '#059669'
    },
    {
        id: 'dracula',
        name: '紫罗兰',
        description: '高雅冷艳的霓虹暗夜紫调',
        primaryColor: '#8b5cf6'
    }
]

/**
 * 获取可用的子主题列表
 * @param themeName 当前大主题名称，支持未来按大主题定制子主题集合
 */
export function getSubThemes(_themeName?: string): SubThemeItem[] {
    return [...PRESET_SUBTHEMES]
}

/**
 * 校验给定的 subThemeId 是否在可用列表中
 */
export function isValidSubTheme(subThemeId: string, allowedList = PRESET_SUBTHEMES): boolean {
    return allowedList.some((theme) => theme.id === subThemeId)
}

/**
 * 安全获取当前激活的子主题 ID（兼容 SSR 与浏览器端）
 */
export function getCurrentSubTheme(fallback = 'default'): string {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return fallback
    }
    try {
        const saved = localStorage.getItem(SUBTHEME_STORAGE_KEY)
        if (saved && isValidSubTheme(saved)) {
            return saved
        }
    } catch {
        // 忽略跨域或无权限存储异常
    }
    return fallback
}

/**
 * 切换并应用子主题（更新 DOM 属性 + 同步 localStorage）
 */
export function applySubTheme(subThemeId: string): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false
    }

    const targetId = isValidSubTheme(subThemeId) ? subThemeId : 'default'

    try {
        document.documentElement.setAttribute(SUBTHEME_ATTRIBUTE, targetId)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(SUBTHEME_STORAGE_KEY, targetId)
        }
        return true
    } catch {
        return false
    }
}

/**
 * 生成防闪烁（Zero-FOUC）内联脚本代码，注入到 SSR head 中
 */
export function generateSubThemeAntiFlickerScript(
    storageKey = SUBTHEME_STORAGE_KEY,
    attrName = SUBTHEME_ATTRIBUTE
): string {
    return `(()=>{try{const s=localStorage.getItem('${storageKey}');if(s){document.documentElement.setAttribute('${attrName}',s);}}catch(e){}})();`
}
