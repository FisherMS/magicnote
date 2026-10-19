<template>
    <!-- 分类快速筛选 Pill 导航 -->
    <div class="category-pills">
        <button
            type="button"
            class="category-pill"
            :class="{ active: selectedCategory === ALL_CATEGORY }"
            @click="selectCategory(ALL_CATEGORY)">
            全部 <sup>{{ totalPosts }}</sup>
        </button>
        <button
            v-for="(_, cat) in data"
            :key="cat"
            type="button"
            class="category-pill"
            :class="{ active: selectedCategory === cat }"
            @click="selectCategory(String(cat))">
            {{ cat }} <sup>{{ data[cat].length }}</sup>
        </button>
    </div>

    <!-- 分类文章列表 -->
    <div v-for="(posts, cat) in filteredData" :key="cat" class="category-group">
        <div class="category-header">
            <span class="category-title">{{ cat }}</span>
            <span class="category-count">{{ posts.length }} 篇</span>
        </div>
        <a v-for="(article, index) in posts" :key="index" :href="withBase(article.regularPath)" class="posts">
            <div class="post-container">
                <span class="post-dot"></span>
                <span class="post-title">{{ article.frontMatter.title }}</span>
            </div>
            <div class="date">{{ formatDateOnly(article.frontMatter.date) }}</div>
        </a>
    </div>

    <!-- 空状态提示 -->
    <div v-if="filteredDataCount === 0" class="category-empty">暂无该分类下的文章</div>
</template>

<script lang="ts" setup>
import { useData, withBase, inBrowser } from 'vitepress'
import { computed, ref, onMounted } from 'vue'
import { initCategory, formatDateOnly } from '../../../core'

const ALL_CATEGORY = 'ALL'
const { theme } = useData()
const data = computed(() => initCategory(theme.value.posts || []))

const selectedCategory = ref<string>(ALL_CATEGORY)

const totalPosts = computed(() => {
    return Object.values(data.value).reduce((sum, list) => sum + list.length, 0)
})

const filteredData = computed(() => {
    if (selectedCategory.value === ALL_CATEGORY) {
        return data.value
    }
    const cat = selectedCategory.value
    if (data.value[cat]) {
        return { [cat]: data.value[cat] }
    }
    return {}
})

const filteredDataCount = computed(() => {
    return Object.keys(filteredData.value).length
})

const selectCategory = (cat: string) => {
    selectedCategory.value = cat
    if (inBrowser) {
        const url = new URL(window.location.href)
        if (cat === ALL_CATEGORY) {
            url.searchParams.delete('category')
        } else {
            url.searchParams.set('category', cat)
        }
        window.history.replaceState({}, '', url.toString())
    }
}

onMounted(() => {
    if (inBrowser) {
        const queryCat = new URLSearchParams(window.location.search).get('category')
        if (queryCat && data.value[queryCat]) {
            selectedCategory.value = queryCat
        }
    }
})
</script>

<style scoped>
.category-pills {
    margin-top: 14px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.category-pill {
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

.category-pill:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-brand);
    border-color: var(--vp-c-brand-soft);
}

.category-pill.active {
    background-color: var(--vp-c-brand);
    color: #ffffff;
    border-color: var(--vp-c-brand);
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.category-pill sup {
    color: var(--vp-c-brand);
    font-weight: 600;
    font-size: 0.75rem;
    transition: color 0.25s ease;
}

.category-pill.active sup {
    color: #ffffff;
    opacity: 0.9;
}

.category-group {
    margin-bottom: 20px;
}

.category-header {
    padding: 24px 0 10px 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
    border-bottom: 1px dashed var(--vp-c-divider, rgba(60, 60, 60, 0.12));
    margin-bottom: 8px;
}

.category-title {
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--bt-theme-title);
    font-family: var(--date-font-family), serif;
}

.category-count {
    font-size: 0.8125rem;
    color: var(--vp-c-text-3);
    font-family: var(--date-font-family), monospace;
}

.category-empty {
    padding: 40px 0;
    text-align: center;
    color: var(--vp-c-text-3);
    font-size: 0.9375rem;
}

@media screen and (max-width: 768px) {
    .category-pills {
        gap: 6px;
        margin-top: 10px;
        margin-bottom: 16px;
    }
    .category-pill {
        padding: 3px 11px;
        font-size: 0.8125rem;
        line-height: 20px;
    }
    .category-header {
        padding: 16px 0 8px 0;
    }
    .category-title {
        font-size: 1.1875rem;
    }
}
</style>
