<template>
    <Layout>
        <template #doc-before>
            <div style="padding-top: 20px" class="post-info" v-if="!$frontmatter.page">
                <div class="post-header">
                    <div class="post-title">{{ $frontmatter.order > 0 ? '📌' : '' }} {{ $frontmatter.title }}</div>
                </div>
                {{ convertDateV2($frontmatter.date) }} &nbsp;&nbsp;
                <span v-for="item in $frontmatter.tags"
                    ><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span
                >
                <div
                    v-if="$frontmatter.description && !hasImageInDescription($frontmatter.description)"
                    class="describe"
                    v-html="renderDescriptionMarkdown($frontmatter.description, route.path)"
                ></div>
            </div>
        </template>
        <template #doc-bottom>
            <Comment />
        </template>
    </Layout>
    <Copyright />
</template>
<script setup>
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
import { withBase, useRoute } from 'vitepress'
import { convertDateV2 } from '../date'
import { renderDescriptionMarkdown, hasImageInDescription } from '../functions'
const { Layout } = DefaultTheme
const route = useRoute()
</script>
<style scoped>
.post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0 8px 0;
}
.post-title {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--bt-theme-title) !important;
    margin: 0.1rem 0;
}
.describe {
    font-size: 0.9375rem;
    color: var(--vp-c-text-2);
    margin: 10px 0;
    line-height: 1.5rem;
    padding: 8px;
    border-top: 1px dashed #efefef;
    border-bottom: 1px dashed #efefef;
    font-style: italic;
    font-weight: bold;

    display: block;
    overflow: visible;
    /* -webkit-box-orient: vertical; */
    /* -webkit-line-clamp: 3; */
}

@media screen and (max-width: 768px) {
    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 8px 0 8px 0;
    }
    .post-title {
        font-size: 1.0625rem;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        width: 17rem;
    }
    .describe {
        font-size: 0.9375rem;
        margin: 0.5rem 0 1rem;
        border-top: 1px dashed #efefef;
        border-bottom: 1px dashed #efefef;
        font-style: italic;
        font-weight: bold;

        display: block;
        overflow: visible;
        /* -webkit-box-orient: vertical; */
        /* -webkit-line-clamp: 3; */
    }
}
</style>
