<template>
    <Layout>
        <template #doc-before>
            <div v-if="!$frontmatter.page" class="minimal-doc-header">
                <h1 v-if="$frontmatter.title" class="minimal-title">{{ $frontmatter.title }}</h1>
                <div class="minimal-meta">
                    <span v-if="$frontmatter.date">📅 {{ $frontmatter.date }}</span>
                    <span v-if="$frontmatter.tags?.length">🏷️ {{ $frontmatter.tags.join(', ') }}</span>
                </div>
            </div>
        </template>
        <template #nav-bar-content-after>
            <SubThemeSwitcher />
        </template>
        <template #layout-bottom>
            <footer class="minimal-footer">
                <p>Minimalist Edition · Powered by VitePress</p>
            </footer>
        </template>
    </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import SubThemeSwitcher from './SubThemeSwitcher.vue'
const { Layout } = DefaultTheme
</script>

<style scoped>
.minimal-doc-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vp-c-divider);
}
.minimal-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--vp-c-text-1);
}
.minimal-meta {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    display: flex;
    gap: 16px;
}
</style>
