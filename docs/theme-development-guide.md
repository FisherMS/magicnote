# VitePress 多主题开发与接入指南

本项目采用 **“编译期确定、共享内核 (Shared Core)、物理隔离多主题”** 的架构模式。

---

## 一、 核心架构全景

```text
.vitepress/
├── core/                      # [共享业务内核] 包含数据解析、日期、分页、类型定义
│   ├── types.ts
│   ├── index.ts
│   ├── server/serverUtils.ts  # Node 端 Markdown 解析与分页数据生成
│   └── utils/                 # 通用纯函数（date, pagination, functions）
├── themes/                    # [多主题物理隔离目录]
│   ├── default/               # 默认经典主题
│   ├── minimal/               # 极简示例主题
│   └── index.ts               # 主题注册表与编译期解析器 (Theme Dispatcher)
└── theme/                     # [VitePress 规范入口]
    └── index.ts               # 按 process.env.VITE_BLOG_THEME 分发导出
```

---

## 二、 如何新增一个新主题（以 `v3-card` 为例）

### 1. 新建主题目录
在 `.vitepress/themes/` 目录下创建新主题目录：
```text
.vitepress/themes/v3-card/
├── components/                # 专属组件（自定义 Layout、列表卡片等）
│   ├── CardLayout.vue
│   └── CardPage.vue
├── styles/                    # 专属样式与变量
│   └── card.css
└── index.ts                   # 主题入口（实现 Theme 接口）
```

### 2. 实现主题入口契约
在 `.vitepress/themes/v3-card/index.ts` 中：
```typescript
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CardLayout from './components/CardLayout.vue'
import CardPage from './components/CardPage.vue'
import type { App } from 'vue'

import './styles/card.css'

const cardTheme: Theme = {
    ...DefaultTheme,
    Layout: CardLayout,
    enhanceApp({ app }: { app: App }) {
        // 注册主题专属组件，若未定制归档/标签页可复用 default 组件
        app.component('Page', CardPage)
    }
}

export default cardTheme
```

### 3. 注册新主题
在 [.vitepress/themes/index.ts](file:///Volumes/data/projects/AicrosoftWebs/apps/blog.aicro.net_vitepress/.vitepress/themes/index.ts) 中注册：
```typescript
import defaultTheme from './default'
import minimalTheme from './minimal'
import cardTheme from './v3-card'

export const themes: Record<string, Theme> = {
    default: defaultTheme,
    minimal: minimalTheme,
    'v3-card': cardTheme
}
```

### 4. 在 `package.json` 中配置快捷命令
在 [package.json](file:///Volumes/data/projects/AicrosoftWebs/apps/blog.aicro.net_vitepress/package.json) 中添加对应脚本：
```json
{
  "scripts": {
    "dev:card": "cross-env VITE_BLOG_THEME=v3-card vitepress dev --host 0.0.0.0",
    "build:card": "cross-env VITE_BLOG_THEME=v3-card vitepress build"
  }
}
```

---

## 三、 数据使用规范

主题组件可直接从 `core` 导入通用方法与类型：
```typescript
import { generatePaginationArray, useYearSort, convertDateV2 } from '../../../core'
import type { Post } from '../../../core'
```
在组件内通过 VitePress 标准 API 获取所有文章列表：
```typescript
import { useData } from 'vitepress'
const { theme } = useData()
const posts = theme.value.posts // 获取经过 core 预解析的全量文章数据
```
