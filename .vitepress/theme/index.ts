import { Theme, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'
import Comment from './components/CommentGiscus.vue'
import { App, onMounted, watch, nextTick } from 'vue' // 引入 Vue 的 App 类型
import mediumZoom from 'medium-zoom'

import './custom.css'

export default {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp({ app }: { app: App }) {
        // 全局注册后，在Vue里就能直接使用了
        app.component('Tags', Tags)
        app.component('Category', Category)
        app.component('Archives', Archives)
        app.component('Page', Page)
        app.component('Comment', Comment)
    },

    // 组合式 API 设置
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
} satisfies Theme
