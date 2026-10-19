/**
 * Default 主题入口
 */

import { Theme, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'
import Comment from './components/CommentGiscus.vue'
import { App, onMounted, watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'

import './styles/custom.css'

const theme: Theme = {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp({ app }: { app: App }) {
        app.component('Tags', Tags)
        app.component('Category', Category)
        app.component('Archives', Archives)
        app.component('Page', Page)
        app.component('Comment', Comment)
    },
    setup() {
        const route = useRoute()

        const initZoom = () => {
            mediumZoom('.main img', {
                background: 'var(--vp-c-bg)',
                margin: 24,
                scrollOffset: 0
            })
        }

        onMounted(() => {
            initZoom()
        })

        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        )
    }
}

export default theme
