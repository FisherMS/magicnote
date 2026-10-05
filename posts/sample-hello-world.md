---
title: "欢迎使用 MagicNote 博客模板 (Hello World)"
date: "2026-10-01 10:00"
category: "指南"
tags:
  - "入门"
  - "VitePress"
order: 1
description: "欢迎使用基于 VitePress 深度定制的个人技术博客模板！本文演示基础排版、代码高亮与分类标签。"
---

# 欢迎使用 MagicNote 博客模板

这是一篇用于演示博客系统基础功能的示例文章。本博客模板基于 [VitePress](https://vitepress.dev/) 深度定制，兼具极速加载与现代感阅读体验。

## 特性一览
- **自动化文章分页流水线**：编译期自动扫描 `posts/` 目录中的文章，按日期与置顶权重生成多页导航；
- **沉浸式富文本摘要**：摘要支持 Markdown 语法与相对路径图片自动重写；
- **全屏插图灯箱**：集成 `medium-zoom`，点击即可无缝平滑放大。

## 代码高亮演示

```typescript
// 快速定义一个博文接口
interface PostMeta {
  title: string
  date: string
  category?: string
  tags?: string[]
  order?: number
}

export function formatPostTitle(post: PostMeta): string {
  return `${post.order ? '📌 ' : ''}${post.title}`
}
```

欢迎开始编写属于你自己的精彩博文！
