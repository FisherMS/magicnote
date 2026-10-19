<template>
    <div v-for="(article, index) in posts" :key="index" class="post-list">
        <div class="post-header">
            <div class="post-title">
                {{ article.frontMatter.order > 0 ? '📌' : '' }}
                <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
            </div>
        </div>
        <div
            class="describe"
            v-html="renderDescriptionMarkdown(article.frontMatter.description, article.regularPath)"></div>
        <div class="post-info">
            {{ article.frontMatter.date }}
            <span v-for="item in article.frontMatter.tags" :key="item"
                ><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span
            >
        </div>
    </div>

    <div v-if="pagesNum > 1" class="pagination">
        <span v-for="item in paginationItems" :key="item.key" :class="['link', { active: item.isCurrent }]">
            <a v-if="item.link" :href="item.link">{{ item.text }}</a>
            <span v-else>{{ item.text }}</span>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'
import { PropType, computed } from 'vue'
import { generatePaginationArray, renderDescriptionMarkdown } from '../../../core'
interface Article {
    regularPath: string
    frontMatter: {
        order: number
        title: string
        description: string
        date: string
        tags: string[]
    }
}
const props = defineProps({
    posts: {
        type: Array as PropType<Article[]>,
        required: true
    },
    pageCurrent: {
        type: Number as PropType<number>,
        required: true
    },
    pagesNum: {
        type: Number as PropType<number>,
        required: true
    }
})

const pageArray = computed(() => {
    return generatePaginationArray(props.pagesNum, props.pageCurrent)
})

interface PageItem {
    key: string
    text: string | number
    isCurrent: boolean
    link?: string
}

const paginationItems = computed<PageItem[]>(() => {
    return pageArray.value.map((item, idx) => {
        const isCurrent = item === props.pageCurrent
        const isEllipsis = item === '...'
        return {
            key: `${item}-${idx}`,
            text: item,
            isCurrent,
            link: !isEllipsis && !isCurrent ? withBase(item === 1 ? '/index.html' : `/page_${item}.html`) : undefined
        }
    })
})
</script>

<style scoped>
.post-list {
    border-bottom: 1px dashed var(--vp-c-divider);
    padding: 14px 0 14px 0;
}
.post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.post-title {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--bt-theme-title) !important;
    margin: 0.1rem 0;
}
.post-title a {
    color: var(--bt-theme-title) !important;
}

.describe {
    font-size: 0.9375rem;
    display: block;
    overflow: visible;
    color: var(--vp-c-text-2);
    margin: 10px 0;
    line-height: 1.5rem;

    /* -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; */
}
.pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
}
.link {
    display: inline-block;
    width: 28px;
    text-align: center;
    border: 1px var(--vp-c-divider) solid;
    border-right: none;
    font-weight: 400;
}

/* 最后一个 link 单独加右边框 */
.link:last-child {
    border-right: 1px solid var(--vp-c-divider);
}
.link.active {
    background: var(--vp-c-text-1);
    color: var(--vp-c-neutral-inverse);
    border: 1px solid var(--vp-c-text-1) !important;
}

@media screen and (max-width: 768px) {
    .post-list {
        padding: 14px 0 14px 0;
    }
    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .post-title {
        font-size: 1.0625rem;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        width: 100%;
    }
    .describe {
        font-size: 0.9375rem;
        display: block;
        overflow: visible;
        margin: 0.5rem 0 1rem;
        word-break: break-word;
    }
}
</style>
