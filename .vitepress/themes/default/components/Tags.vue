<template>
    <div class="tags">
        <button
            v-for="(_, key) in data"
            :key="key"
            type="button"
            class="tag"
            :class="{ active: selectTag === key }"
            @click="toggleTag(String(key))">
            {{ key }} <sup>{{ data[key].length }}</sup>
        </button>
    </div>
    <div class="tag-header">
        <span class="tag-title">{{ selectTag }}</span>
        <span v-if="selectTag && data[selectTag]" class="tag-count">{{ data[selectTag].length }} 篇</span>
    </div>
    <a
        v-for="(article, index) in selectTag ? data[selectTag] : []"
        :key="index"
        :href="withBase(article.regularPath)"
        class="posts">
        <div class="post-container">
            <span class="post-dot"></span>
            <span class="post-title">{{ article.frontMatter.title }}</span>
        </div>
        <div class="date">{{ formatDateOnly(article.frontMatter.date) }}</div>
    </a>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useData, withBase, inBrowser } from 'vitepress'
import { initTags, formatDateOnly } from '../../../core'

const { theme } = useData()
const data = computed(() => initTags(theme.value.posts || []))

const defaultTag = computed(() => Object.keys(data.value)[0] || '')
const selectTag = ref(defaultTag.value)

const toggleTag = (tag: string) => {
    selectTag.value = tag
    if (inBrowser) {
        const url = new URL(window.location.href)
        url.searchParams.set('tag', tag)
        window.history.replaceState({}, '', url.toString())
    }
}

onMounted(() => {
    if (inBrowser) {
        const queryTag = new URLSearchParams(window.location.search).get('tag')
        if (queryTag && data.value[queryTag]) {
            selectTag.value = queryTag
        }
    }
})
</script>

<style scoped>
.tags {
    margin-top: 14px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 14px;
    font-size: 0.875rem;
    line-height: 22px;
    background-color: var(--vp-c-bg-alt);
    border: 1px solid transparent;
    transition: all 0.25s ease;
    border-radius: 9999px;
    color: var(--vp-c-text-1);
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.tag:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-brand);
    border-color: var(--vp-c-brand-soft);
}

.tag.active {
    background-color: var(--vp-c-brand);
    color: #ffffff;
    border-color: var(--vp-c-brand);
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.tag sup {
    color: var(--vp-c-brand);
    font-weight: 600;
    font-size: 0.75rem;
    transition: color 0.25s ease;
}

.tag.active sup {
    color: #ffffff;
    opacity: 0.9;
}

.tag-header {
    padding: 24px 0 10px 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
    border-bottom: 1px dashed var(--vp-c-divider, rgba(60, 60, 60, 0.12));
    margin-bottom: 8px;
}

.tag-title {
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--bt-theme-title);
    font-family: var(--date-font-family), serif;
}

.tag-count {
    font-size: 0.8125rem;
    color: var(--vp-c-text-3);
    font-family: var(--date-font-family), monospace;
}

@media screen and (max-width: 768px) {
    .tags {
        gap: 6px;
        margin-top: 10px;
        margin-bottom: 16px;
    }
    .tag {
        padding: 3px 11px;
        font-size: 0.8125rem;
        line-height: 20px;
    }
    .tag-header {
        padding: 16px 0 8px 0;
    }
    .tag-title {
        font-size: 1.1875rem;
    }
}
</style>
