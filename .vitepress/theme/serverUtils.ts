import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'fs-extra'
import { resolve } from 'path'
import { convertDateV2 } from './date'

async function getPosts(
    pageSize: number,
    isProd: boolean = true,
    excludePosts: string[] = ['README.md'],
    devFolders: string[] = []
) {
    const showFolders = !isProd ? devFolders : ['posts/**/**.md']
    const ignorePaths = isProd ? excludePosts : []

    console.log('showFolders-->', showFolders)

    let paths = await globby(showFolders, {
        ignore: ignorePaths
    })

    //这里只是生成分页时才用到
    await generatePaginationPages(paths.length, pageSize)

    let posts = await Promise.all(
        paths.map(async (item) => {
            const content = await fs.readFile(item, 'utf-8')
            const { data } = matter(content)
            const order = _convertOrder(data.order)
            return {
                frontMatter: {
                    ...data,
                    // 处理日期：无效日期回退当前时间
                    date: convertDateV2(data.date),
                    // 处理 order：非数值时强制转换为 0
                    order
                },
                regularPath: `/${item.replace('.md', '.html')}`
            }
        })
    )
    posts.sort(_compareDate as any)
    return posts
}

async function generatePaginationPages(total: number, pageSize: number) {
    //  pagesNum
    let pagesNum = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1
    const paths = resolve('./')

    if (total > 0) {
        for (let i = 1; i < pagesNum + 1; i++) {
            const page = `
---
page: true
title: ${i === 1 ? 'home' : 'page_' + i}
aside: false
comment: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
</script>
<Page :posts="posts" :pageCurrent="${i}" :pagesNum="${pagesNum}" />
`.trim()

            const file = paths + `/page_${i}.md`
            await fs.writeFile(file, page)
        }
    }
    // rename page_1 to index for homepage
    await fs.move(paths + '/page_1.md', paths + '/index.md', { overwrite: true })
}

function _compareDate(
    obj1: { frontMatter: { date: number; order: number } },
    obj2: { frontMatter: { date: number; order: number } }
) {
    const orderCompare = obj2.frontMatter.order - obj1.frontMatter.order
    if (orderCompare !== 0) return orderCompare
    return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
}

function _convertOrder(input?: unknown): number {
    if (input === undefined || input === null) return 0
    if (typeof input === 'number') return input
    const num = Number(input)
    return isNaN(num) ? 0 : num
}

export { getPosts, _compareDate, _convertOrder }
