---
title: "富媒体排版、图文摘要避让与技术图表演示"
date: "2026-10-02 14:30"
category: "特性演示"
tags:
  - "Markdown"
  - "Mermaid"
  - "图表"
order: 2
description: |-
  这是一篇进阶特性演示文章，演示首页摘要包含图片、Markdown 富文本排版与正文自动智能避让。

  ![示例架构预览图](./images/sample.svg)

  若摘要中包含相对路径图片，系统会在首页自动重写路径，并在进入正文后智能隐藏顶部摘要，避免图片重复！
---

# 富媒体与技术图表演示

本篇示例文章展示本博客模板强大的高级渲染特性。

## 一、 相对路径图片与灯箱放大

下面的插图支持点击平滑放大：

![示例架构预览图](./images/sample.svg)

## 二、 Mermaid 技术架构图原生渲染

内置 `vitepress-plugin-mermaid`，直接在 Markdown 中编写 Flowchart 或 Sequence 时序图：

```mermaid
graph TD
    A[编写 Markdown 博文] --> B[本地编译: pnpm dev]
    B --> C{运行质量门禁}
    C -->|Vitest 自动化测试| D[打包 SSG 产物: pnpm build]
    D --> E[一键自动化部署至 Cloudflare Pages]
```

## 三、 置顶图钉机制

通过在 FrontMatter 中设置 `order: number`（数值越大越靠前），即可让关键文章优先固定在首页顶部并显示 📌 图钉。
