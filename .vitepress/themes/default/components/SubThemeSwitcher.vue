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
            aria-label="选择色彩子主题"
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
                    <span class="menu-title">风格调色盘</span>
                    <span class="menu-subtitle">即时切换当前主题风格</span>
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
                        <div class="theme-info">
                            <span class="theme-name">{{ item.name }}</span>
                            <span class="theme-desc">{{ item.description }}</span>
                        </div>
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
const subThemes = getSubThemes('default')
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
    color: var(--vp-c-text-1);
    font-size: 0.8125rem;
    font-weight: 500;
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
    color: var(--vp-c-brand);
    background-color: var(--vp-c-bg-elv);
}

.color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
}

.trigger-label {
    line-height: 1;
    white-space: nowrap;
}

.chevron {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
    line-height: 1;
    color: var(--vp-c-text-2);
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
    color: var(--vp-c-brand);
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
    top: calc(100% + 8px);
    right: 0;
    width: 230px;
    background: var(--vp-c-bg-elv);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.15),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 8px;
    z-index: 100;
}

.subtheme-menu::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    height: 10px;
}

.menu-header {
    padding: 6px 8px 8px;
    border-bottom: 1px solid var(--vp-c-divider);
    margin-bottom: 6px;
}

.menu-title {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.menu-subtitle {
    display: block;
    font-size: 0.6875rem;
    color: var(--vp-c-text-2);
    margin-top: 2px;
}

.theme-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.theme-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 6px 8px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition:
        background 0.15s ease,
        transform 0.1s ease;
}

.theme-item:hover {
    background: var(--vp-c-bg-soft);
    transform: translateX(2px);
}

.theme-item.active {
    background: var(--vp-c-bg-soft);
    font-weight: 600;
}

.theme-swatch {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow:
        0 0 0 2px var(--vp-c-bg-elv),
        0 0 0 3px var(--vp-c-divider);
}

.theme-item.active .theme-swatch {
    box-shadow:
        0 0 0 2px var(--vp-c-bg-elv),
        0 0 0 3px var(--vp-c-brand);
}

.theme-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.theme-name {
    font-size: 0.8125rem;
    color: var(--vp-c-text-1);
    line-height: 1.2;
}

.theme-desc {
    font-size: 0.6875rem;
    color: var(--vp-c-text-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    margin-top: 2px;
}

.check-icon {
    font-size: 0.8125rem;
    color: var(--vp-c-brand);
    font-weight: bold;
}

/* 动效 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
