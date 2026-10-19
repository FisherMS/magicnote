<template>
    <div v-for="yearList in data" :key="yearList[0].frontMatter.date">
        <div class="year">
            <span class="year-title">{{ yearList[0].frontMatter.date.split('-')[0] }}</span>
            <span class="year-count">{{ yearList.length }} 篇</span>
        </div>
        <a v-for="(article, index) in yearList" :key="index" :href="withBase(article.regularPath)" class="posts">
            <div class="post-container">
                <span class="post-dot"></span>
                <span class="post-title">{{ article.frontMatter.title }}</span>
            </div>
            <div class="date">{{ formatDateOnly(article.frontMatter.date).slice(5) }}</div>
        </a>
    </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useYearSort, formatDateOnly } from '../../../core'

const { theme } = useData()
const data = computed(() => useYearSort(theme.value.posts || []))
</script>

<style scoped>
.year {
    padding: 24px 0 10px 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
    border-bottom: 1px dashed var(--vp-c-divider, rgba(60, 60, 60, 0.12));
    margin-bottom: 8px;
}
.year-title {
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--bt-theme-title);
    font-family: var(--date-font-family), serif;
}
.year-count {
    font-size: 0.8125rem;
    color: var(--vp-c-text-3);
    font-family: var(--date-font-family), monospace;
}
</style>
