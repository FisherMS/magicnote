import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import { withMermaid } from 'vitepress-plugin-mermaid'
//doc:https://emersonbottero.github.io/vitepress-plugin-mermaid/guide/more-examples.html#render
import generateSidebar from './config.sidebar'
import { useSidebar } from 'vitepress/theme'

//仅用于调试时显示的目录
const devFolders = ['posts/**/**.md']
//const devFolders = ['posts/**/**.md']
//用于排除Posts目录里某些子目录
const excludePostNames = ['2011', 'trash', 'draft', 'private']
//每页的文章数量
const pageSize = 11
// 判断是否是构建模式,NOTE：npm run build也是production模式。
const isProd = process.env.NODE_ENV === 'production'
//['posts/draft/**/*.md', 'posts/private-notes/**/*.md', 'posts/trash/**/*.md']
const excludePosts = excludePostNames.map((name) => `**/${name}/**/*.md`)
//excludePosts.push('README.md')
excludePosts.push('README.md', 'docs/**')

export default withMermaid(
    defineConfig({
        title: `MagicNote`,
        description: `Fisher's Blog. Learn to ask questions, good questions are more important than answers`,
        base: '/',
        ignoreDeadLinks: true,
        //cleanUrls: true,
        //lastUpdated: true,
        //srcDir: ".vitrepress/pages",
        //outDir: ".vitepress/pages", // 确保输出目录正确
        //cacheDir: ".vitepress/cache", //default value:.vitepress/cache
        // 动态设置 srcExclude : exclude the README.md , needn't to compiler
        srcExclude: isProd ? excludePosts : ['README.md'],
        vite: {
            //build: { minify: false }
            server: { port: 5600 },
            build: {
                chunkSizeWarningLimit: 1000 // 提高阈值至 1000 KB，消除告警
            },
            optimizeDeps: {
                include: [
                    'mermaid',
                    'fastdom',
                    'fastdom/extensions/fastdom-promised.js'
                ]
            }
        },
        head: [
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
            copyrightUrl: 'https://www.aicrosoft.com/', //copyright link
            copyrightName: `AICROSOFT`,
            // blogs page show firewokrs animation
            showFireworksAnimation: true,
            // outline: 2, //设置右侧aside显示层级
            aside: true,
            //outline:[2,3],
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
                // { text: 'Airene', link: 'http://airene.net' }  -- External link test
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
            ],
            // 使用导入的侧边栏配置
            //sidebar: generateSidebar,
            // sidebar:{
            //     '/job-v8/': 'auto'
            // },
            // sidebar: {
            //     './job-v8/': 'auto'
            // },
            // sidebar: [
            //     {
            //         text: '任务调度框架JobFactory-V8',
            //         items: [
            //             { text: 'Item A', link: 'posts/job-v8/v8-task-user-story' },
            //             { text: 'Item B', link: 'posts/job-v8/v8-task-readme-v1-2' }
            //         ]
            //     }
            // ],
            test: {
                environment: 'happy-dom',
                coverage: {
                    provider: 'v8',
                    reporter: ['text', 'json', 'html']
                }
            }
        } as any,
        markdown: {
            image: {
                // 开启图片懒加载
                lazyLoading: true
            }
        },
        mermaid: {
            // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
        }
        // optionally set additional config for plugin itself with MermaidPluginConfig
        // mermaidPlugin: {
        //     class: 'mermaid my-class' // set additional css classes for parent container
        // }
    })
)

