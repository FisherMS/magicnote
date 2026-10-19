import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import {
    PRESET_SUBTHEMES,
    SUBTHEME_STORAGE_KEY,
    SUBTHEME_ATTRIBUTE,
    getSubThemes,
    isValidSubTheme,
    getCurrentSubTheme,
    applySubTheme,
    generateSubThemeAntiFlickerScript
} from '../.vitepress/core'

describe('SubTheme Core Logic', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.removeAttribute(SUBTHEME_ATTRIBUTE)
    })

    afterEach(() => {
        localStorage.clear()
        document.documentElement.removeAttribute(SUBTHEME_ATTRIBUTE)
    })

    test('PRESET_SUBTHEMES contains expected defaults', () => {
        const ids = PRESET_SUBTHEMES.map((item) => item.id)
        expect(ids).toContain('default')
        expect(ids).toContain('nord')
        expect(ids).toContain('warm-paper')
        expect(ids).toContain('forest')
        expect(ids).toContain('dracula')
    })

    test('getSubThemes returns all presets', () => {
        const subthemes = getSubThemes('default')
        expect(subthemes.length).toBe(PRESET_SUBTHEMES.length)
    })

    test('isValidSubTheme identifies registered and unregistered ids', () => {
        expect(isValidSubTheme('default')).toBe(true)
        expect(isValidSubTheme('nord')).toBe(true)
        expect(isValidSubTheme('non-existent-theme')).toBe(false)
        expect(isValidSubTheme('')).toBe(false)
    })

    test('getCurrentSubTheme returns fallback when storage is empty or invalid', () => {
        expect(getCurrentSubTheme()).toBe('default')
        expect(getCurrentSubTheme('nord')).toBe('nord')

        localStorage.setItem(SUBTHEME_STORAGE_KEY, 'invalid-id')
        expect(getCurrentSubTheme()).toBe('default')
    })

    test('getCurrentSubTheme returns saved valid subtheme', () => {
        localStorage.setItem(SUBTHEME_STORAGE_KEY, 'forest')
        expect(getCurrentSubTheme()).toBe('forest')
    })

    test('applySubTheme updates DOM and localStorage', () => {
        const success = applySubTheme('warm-paper')
        expect(success).toBe(true)
        expect(document.documentElement.getAttribute(SUBTHEME_ATTRIBUTE)).toBe('warm-paper')
        expect(localStorage.getItem(SUBTHEME_STORAGE_KEY)).toBe('warm-paper')
    })

    test('applySubTheme falls back to default on invalid id', () => {
        const success = applySubTheme('unknown-subtheme')
        expect(success).toBe(true)
        expect(document.documentElement.getAttribute(SUBTHEME_ATTRIBUTE)).toBe('default')
        expect(localStorage.getItem(SUBTHEME_STORAGE_KEY)).toBe('default')
    })

    test('generateSubThemeAntiFlickerScript generates executable code with keys', () => {
        const script = generateSubThemeAntiFlickerScript()
        expect(script).toContain(SUBTHEME_STORAGE_KEY)
        expect(script).toContain(SUBTHEME_ATTRIBUTE)
        expect(script.startsWith('(()=>{')).toBe(true)
        expect(script.endsWith('})();')).toBe(true)
    })
})
