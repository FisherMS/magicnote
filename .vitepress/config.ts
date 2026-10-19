import { defineConfigWithTheme } from 'vitepress'
import { getPosts } from './core/server/serverUtils'
import { generateSubThemeAntiFlickerScript } from './core'
import { withMermaid } from 'vitepress-plugin-mermaid'
import type { BlogThemeConfig } from './core/types'

// 仅用于本地调试时显示的特定开发目录
const devFolders = ['posts/**/**.md']

// 用于排除 Posts 目录里某些私有或废弃目录
const excludePostNames = ['2011', 'trash', 'draft', 'private']
const excludePosts = excludePostNames.map((name) => `**/${name}/**/*.md`)
excludePosts.push('README.md', 'docs/**')

// 每页文章展示数量
const pageSize = 11
const isProd = process.env.NODE_ENV === 'production'

export default withMermaid(
    defineConfigWithTheme<BlogThemeConfig>({
        title: 'MagicNote',
        description: "Fisher's Blog. Learn to ask questions, good questions are more important than answers",
        base: '/',
        ignoreDeadLinks: true,
        srcExclude: isProd ? excludePosts : ['README.md'],
        vite: {
            server: { port: 5600 },
            build: {
                chunkSizeWarningLimit: 1000 // 提高阈值至 1000 KB，消除图表库打包告警
            },
            optimizeDeps: {
                include: ['mermaid', 'fastdom', 'fastdom/extensions/fastdom-promised.js']
            }
        },
        head: [
            // 子主题防闪烁初始化脚本 (Zero-FOUC)
            ['script', {}, generateSubThemeAntiFlickerScript()],
            // Google Analytics 4 (GA4)
            [
                'script',
                {
                    async: '',
                    src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'
                }
            ],
            [
                'script',
                {},
                `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');`
            ],
            // Google AdSense
            [
                'script',
                {
                    async: '',
                    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX',
                    crossorigin: 'anonymous'
                }
            ]
        ],
        themeConfig: {
            logo: '/assets/logo/32.png',
            posts: await getPosts(pageSize, isProd, excludePosts, devFolders),
            buildYear: new Date().getFullYear(),
            copyrightUrl: 'https://www.aicrosoft.com/',
            copyrightName: 'AICROSOFT',
            showFireworksAnimation: true,
            aside: true,
            outline: {
                label: '文章摘要'
            },
            search: {
                provider: 'local'
            },
            nav: [
                { text: '🏡Home', link: '/' },
                { text: '📚 Category', link: '/pages/category' },
                { text: '📦Archives', link: '/pages/archives' },
                { text: '🔖Tags', link: '/pages/tags' },
                { text: 'ℹ️About', link: '/pages/about' }
            ],
            socialLinks: [
                { icon: 'github', link: 'https://github.com/FisherMS' },
                { icon: 'twitter', link: 'https://x.com/AicroSupport' },
                {
                    icon: {
                        svg: `<svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20">
                <path d="M874.666667 375.189333V746.666667a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V375.189333l266.090667 225.6a149.333333 149.333333 0 0 0 193.152 0L874.666667 375.189333zM810.666667 213.333333a64.789333 64.789333 0 0 1 22.826666 4.181334 63.616 63.616 0 0 1 26.794667 19.413333 64.32 64.32 0 0 1 9.344 15.466667c2.773333 6.570667 4.48 13.696 4.906667 21.184L874.666667 277.333333v21.333334L553.536 572.586667a64 64 0 0 1-79.893333 2.538666l-3.178667-2.56L149.333333 298.666667v-21.333334a63.786667 63.786667 0 0 1 35.136-57.130666A63.872 63.872 0 0 1 213.333333 213.333333h597.333334z" ></path>
                </svg>`
                    },
                    link: 'mailto:fisher@aicro.net'
                }
            ]
        },
        markdown: {
            image: {
                lazyLoading: true
            },
            config: (md) => {
                const defaultCodeInline = md.renderer.rules.code_inline
                md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
                    tokens[idx].attrSet('v-pre', '')
                    return defaultCodeInline
                        ? defaultCodeInline(tokens, idx, options, env, self)
                        : self.renderToken(tokens, idx, options)
                }
            }
        },
        mermaid: {}
    })
)

