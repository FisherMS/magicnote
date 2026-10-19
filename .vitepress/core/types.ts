/**
 * 博客核心数据契约与类型定义
 */

import type { DefaultTheme } from 'vitepress'

export interface PostFrontMatter {
    date: string
    title: string
    category?: string
    tags?: string[]
    description?: string
    order?: number
    [key: string]: unknown
}

export interface Post {
    frontMatter: PostFrontMatter
    regularPath: string
}

export interface SubThemeItem {
    id: string
    name: string
    description: string
    primaryColor: string
    previewColor?: string
}

export interface BlogThemeConfig extends DefaultTheme.Config {
    posts: Post[]
    copyrightUrl?: string
    copyrightName?: string
    showFireworksAnimation?: boolean
    version?: string
    vitepressVersion?: string
    buildYear?: number
}
