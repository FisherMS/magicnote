<template>
    <div class="site-footer">
        Copyright © 2025 - Present
        <a class="vitepress" :href="copyrightUrl"  target="_blank" >{{ copyrightName }}</a> |
        <a class="vitepress" :href="repLink"  target="_blank" >{{ repName }}</a>
        <span> v{{ version }}</span>
        <br />
        Powered by <a class="vitepress" target="_blank" href="//vitepress.vuejs.org/">VitePress - 1.6.3</a>
        Theme by <a class="vitepress" target="_blank" href="//github.com/airene/vitepress-blog-pure">Vitepress-blog</a>
    </div>
</template>
<script lang="ts" setup>
import { useData } from 'vitepress'
import pkg from '../../../package.json'

const { site, theme } = useData()
const webTitle = site.value.title
const copyrightName = theme.value.copyrightName
const copyrightUrl = theme.value.copyrightUrl
const repName = "MagicNote"
const repLink = "https://github.com/FisherMS/magicnote"
const version = theme.value.version || pkg.version
</script>

<style>
.site-footer {
    color: #888;
    text-align: center;
    font-size: 0.75rem;
    width: 100%;
    padding: 15px 0;
    overflow: auto;
}
.vitepress {
    color: var(--vp-c-text-1);
    font-weight: 700;
}
</style>
