<template>
    <div class="minimal-page">
        <div v-for="(article, index) in posts" :key="index" class="minimal-article-item">
            <h2 class="minimal-article-title">
                <a :href="withBase(article.regularPath)">
                    {{ article.frontMatter.order > 0 ? '📌 ' : '' }}{{ article.frontMatter.title }}
                </a>
            </h2>
            <div class="minimal-article-meta">
                <span>{{ article.frontMatter.date }}</span>
                <span v-if="article.frontMatter.category"> · {{ article.frontMatter.category }}</span>
            </div>
            <p v-if="article.frontMatter.description" class="minimal-article-desc">
                {{ article.frontMatter.description }}
            </p>
        </div>

        <nav v-if="pagesNum > 1" class="minimal-pagination">
            <span v-for="item in paginationItems" :key="item.key" :class="['page-item', { active: item.isCurrent }]">
                <a v-if="item.link" :href="item.link">{{ item.text }}</a>
                <span v-else>{{ item.label }}</span>
            </span>
        </nav>
    </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'
import { computed, PropType } from 'vue'
import { generatePaginationArray } from '../../../core'
import type { Post } from '../../../core'

const props = defineProps({
    posts: {
        type: Array as PropType<Post[]>,
        required: true
    },
    pageCurrent: {
        type: Number,
        required: true
    },
    pagesNum: {
        type: Number,
        required: true
    }
})

const pageArray = computed(() => generatePaginationArray(props.pagesNum, props.pageCurrent))

interface MinimalPageItem {
    key: string
    text: string | number
    label: string
    isCurrent: boolean
    link?: string
}

const paginationItems = computed<MinimalPageItem[]>(() => {
    return pageArray.value.map((item, idx) => {
        const isCurrent = item === props.pageCurrent
        const isEllipsis = item === '...'
        return {
            key: `${item}-${idx}`,
            text: item,
            label: isCurrent ? `[${item}]` : String(item),
            isCurrent,
            link: !isEllipsis && !isCurrent ? withBase(item === 1 ? '/index.html' : `/page_${item}.html`) : undefined
        }
    })
})
</script>

<style scoped>
.minimal-page {
    padding: 20px 0;
}
.minimal-article-item {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vp-c-divider);
}
.minimal-article-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 6px 0;
}
.minimal-article-title a {
    color: var(--vp-c-text-1);
    text-decoration: none;
}
.minimal-article-title a:hover {
    color: var(--vp-c-brand);
}
.minimal-article-meta {
    font-size: 0.85rem;
    color: var(--vp-c-text-2);
    margin-bottom: 8px;
}
.minimal-article-desc {
    font-size: 0.95rem;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
}
.minimal-pagination {
    margin-top: 32px;
    display: flex;
    gap: 12px;
    justify-content: center;
}
.page-item {
    font-size: 0.95rem;
}
.page-item.active {
    font-weight: 700;
    color: var(--vp-c-brand);
}
</style>
