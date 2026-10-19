<template>
    <div
        ref="wrapperRef"
        class="subtheme-wrapper theme-capsule"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 前面：子样式选择器 -->
        <button
            class="capsule-btn subtheme-trigger"
            type="button"
            :aria-expanded="isOpen"
            aria-label="选择极简色彩风格"
            @click="toggleDropdown">
            <span class="color-dot" :style="{ backgroundColor: currentThemeItem.primaryColor }"></span>
            <span class="trigger-label">{{ currentThemeItem.name }}</span>
            <span class="chevron" :class="{ open: isOpen }">▾</span>
        </button>

        <!-- 胶囊内部分割线 -->
        <span class="capsule-divider" aria-hidden="true"></span>

        <!-- 后面：亮暗切换 -->
        <button
            class="capsule-btn appearance-trigger"
            type="button"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            aria-label="切换浅色/深色外观"
            @click.stop="toggleAppearance">
            <span class="sun-icon vpi-sun" aria-hidden="true" />
            <span class="moon-icon vpi-moon" aria-hidden="true" />
        </button>

        <Transition name="fade-slide">
            <div v-if="isOpen" class="subtheme-menu" role="menu">
                <div class="menu-header">
                    <span class="menu-title">极简风格调色盘</span>
                </div>
                <div class="theme-list">
                    <button
                        v-for="item in subThemes"
                        :key="item.id"
                        class="theme-item"
                        :class="{ active: item.id === currentSubThemeId }"
                        type="button"
                        role="menuitem"
                        @click="selectSubTheme(item.id)">
                        <span class="theme-swatch" :style="{ backgroundColor: item.primaryColor }"></span>
                        <span class="theme-name">{{ item.name }}</span>
                        <span v-if="item.id === currentSubThemeId" class="check-icon">✓</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useData } from 'vitepress'
import { getSubThemes, getCurrentSubTheme, applySubTheme, type SubThemeItem } from '../../../core'

const { isDark } = useData()
const toggleAppearance = inject('toggle-appearance', () => {
    isDark.value = !isDark.value
})

const wrapperRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const subThemes = getSubThemes('minimal')
const currentSubThemeId = ref('default')
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const currentThemeItem = computed<SubThemeItem>(() => {
    return subThemes.find((t) => t.id === currentSubThemeId.value) || subThemes[0]
})

function handleMouseEnter() {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
    }
    isOpen.value = true
}

function handleMouseLeave() {
    leaveTimer = setTimeout(() => {
        isOpen.value = false
    }, 150)
}

function toggleDropdown() {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
    }
    isOpen.value = !isOpen.value
}

function selectSubTheme(id: string) {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
    }
    currentSubThemeId.value = id
    applySubTheme(id)
    isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
    if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        isOpen.value = false
    }
}

onMounted(() => {
    currentSubThemeId.value = getCurrentSubTheme('default')
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
    }
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.theme-capsule {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 28px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 9999px;
    user-select: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
}

.theme-capsule:hover {
    border-color: var(--vp-c-brand);
}

.capsule-btn {
    display: inline-flex;
    align-items: center;
    border: none;
    background: transparent;
    cursor: pointer;
    height: 100%;
    color: var(--vp-c-text-2);
    font-size: 0.8rem;
    transition:
        color 0.2s ease,
        background-color 0.2s ease;
    padding: 0;
}

.subtheme-trigger {
    gap: 6px;
    padding: 0 8px 0 10px;
    border-radius: 9999px 0 0 9999px;
}

.subtheme-trigger:hover {
    color: var(--vp-c-text-1);
    background-color: var(--vp-c-bg-elv);
}

.color-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

.trigger-label {
    line-height: 1;
    white-space: nowrap;
}

.chevron {
    font-size: 0.7rem;
    transition: transform 0.2s ease;
}

.chevron.open {
    transform: rotate(180deg);
}

/* 胶囊内部分割线 */
.capsule-divider {
    width: 1px;
    height: 14px;
    background-color: var(--vp-c-divider);
    flex-shrink: 0;
}

/* 亮暗切换按钮 */
.appearance-trigger {
    padding: 0 9px 0 8px;
    border-radius: 0 9999px 9999px 0;
    justify-content: center;
    color: var(--vp-c-text-2);
}

.appearance-trigger:hover {
    color: var(--vp-c-text-1);
    background-color: var(--vp-c-bg-elv);
}

.sun-icon,
.moon-icon {
    width: 14px;
    height: 14px;
    transition:
        transform 0.25s ease,
        opacity 0.2s ease;
}

.sun-icon {
    display: inline-block;
}

.moon-icon {
    display: none;
}

:root.dark .sun-icon {
    display: none;
}

:root.dark .moon-icon {
    display: inline-block;
}

.appearance-trigger:hover .sun-icon {
    transform: rotate(45deg);
    color: #eab308;
}

.appearance-trigger:hover .moon-icon {
    transform: rotate(-20deg);
    color: #38bdf8;
}

.subtheme-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    width: 160px;
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    padding: 6px;
    z-index: 100;
}

.subtheme-menu::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    height: 8px;
}

.menu-header {
    padding: 4px 6px;
    border-bottom: 1px solid var(--vp-c-divider);
    margin-bottom: 4px;
}

.menu-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.theme-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.theme-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 5px 6px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--vp-c-text-1);
    text-align: left;
    transition: background 0.15s;
}

.theme-item:hover,
.theme-item.active {
    background: var(--vp-c-bg-soft);
}

.theme-swatch {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.theme-name {
    flex: 1;
}

.check-icon {
    font-size: 0.75rem;
    color: var(--vp-c-brand);
    font-weight: bold;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
