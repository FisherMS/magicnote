/**
 * Minimal 极简主题入口
 */

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MinimalLayout from './components/MinimalLayout.vue'
import MinimalPage from './components/MinimalPage.vue'
import DefaultArchives from '../default/components/Archives.vue'
import DefaultCategory from '../default/components/Category.vue'
import DefaultTags from '../default/components/Tags.vue'
import DefaultComment from '../default/components/CommentGiscus.vue'
import type { App } from 'vue'

import './styles/minimal.css'

const minimalTheme: Theme = {
    ...DefaultTheme,
    Layout: MinimalLayout,
    enhanceApp({ app }: { app: App }) {
        app.component('Page', MinimalPage)
        app.component('Archives', DefaultArchives)
        app.component('Category', DefaultCategory)
        app.component('Tags', DefaultTags)
        app.component('Comment', DefaultComment)
    }
}

export default minimalTheme
