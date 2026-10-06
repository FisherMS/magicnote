![MagicNote Logo](public/assets/logo/32.png)

# MagicNote

基于 [VitePress](https://vitepress.dev/) 深度定制的个人技术博客，衍生自开源主题 [vitepress-blog-pure](https://github.com/airene/vitepress-blog-pure)，并在**富媒体渲染、工程化质量门禁、交互体验与高容错业务逻辑**上完成了全面演进。

- 📦 **GitHub 开源仓库**：[https://github.com/FisherMS/magicnote](https://github.com/FisherMS/magicnote)

---

## 在线演示与效果预览 (Live Demo & Production)

- 🌐 **当前版本部署效果 (blogdemo)**：[https://blogdemo.aicro.net/](https://blogdemo.aicro.net/)
  > *说明*：展示当前版本脱敏后的纯净部署效果。部分依赖第三方私有凭证的功能未配置时无法显示（例如：基于 GitHub Discussions 的 Giscus 评论系统等）。
- 🚀 **正式使用的全功能效果 (blog url)**：[https://blog.aicro.net/](https://blog.aicro.net/)
  > *说明*：正式线上运行的完整博客，包含全量博文、交互评论与生产指标追踪。线上部署频率依据发布周期推进，可能会暂时落后于当前开发版本。

---

## 一、 核心特性与架构演进 (v2.11 独立演进全景)

![MagicNote 架构演进与特性全景](./docs/changes/v2_11_release_cover.jpg)


- **极简架构 & 纯净 SSG**：基于 VitePress 1.x 原生内核，打包产物轻量、加载极速。
- **自动化文章分页流水线**：
  - 自动扫描 `posts/` 目录中的文章并按日期和置顶权重排序；
  - 编译期动态生成多页导航（`page_*.md` 与 `index.md`）。
- **Markdown 摘要沉浸式渲染**：
  - FrontMatter 的 `description` 支持原生 Markdown 语法（加粗、斜体、列表、超链接、图片等）；
  - **相对路径自动重写**：自动将文章摘要中的相对路径（如 `./images/pic.png`）转换为站点根路径，彻底杜绝首页列表 404 断裂；
  - **正文页图文摘要智能规避**：若摘要中包含图片，进入文章正文详情页后自动隐去摘要，避免首屏图片重复，纯文字摘要则正常保留展示。
- **资源权责隔离与纯粹声明式架构**：
  - 严格隔离开发者公共资产（`public/`）与博主内容资产（`posts/`），严禁跨界混杂；
  - 移除侵入式的底层文件流代理与跨目录复制钩子，恢复纯粹的 VitePress 声明式配置，并通过 CI 审计门禁确保资产纯净安全。
- **技术图表绘制**：内置 `vitepress-plugin-mermaid`，原生支持在 Markdown 中编写 Flowchart、Sequence、Class 等技术架构图。
- **图片全屏灯箱放大**：集成 `medium-zoom`，支持路由无刷新切换，文章及详情页插图点击即放大。
- **自动化测试质量门禁**：
  - 集成 `vitest` + `@vitest/coverage-v8` + `happy-dom`；
  - 对核心日期格式化算法、Markdown 摘要渲染、相对路径重写等关键逻辑进行 100% 单元测试覆盖。
- **置顶支持**：通过 FrontMatter 中的 `order: number` 实现加权倒排置顶，并显示 📌 图钉。
- **离线全文检索**：集成 VitePress 原生 `local` 搜索，零外部依赖，极速检索。
- **数据分析与评论**：内置 Google Analytics 4 (GA4，可按需配置) 与基于 GitHub Discussions 的 Giscus 评论系统。

---

## 二、 快速上手与命令

当前项目严格基于 `pnpm v10` 依赖治理。

### 1. 安装依赖
```bash
pnpm install
```

### 2. 常用开发指令
```bash
# 启动本地开发服务器（默认端口 5600）
pnpm dev

# 运行自动化单元测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm coverage

# 全量生产环境 SSG 构建
pnpm build

# 本地预览生产构建产物
pnpm preview
```

---

## 三、 博文编写规范 (Writing Guide)

所有博客文章推荐存放在 `posts/` 目录下（支持任意深度的子目录如 `posts/2026/`、`posts/draft/`）。

### FrontMatter 标准格式
```markdown
---
title: 图片粘贴文件上传的测试示例
date: "2026-10-02 10:56"
category: 随笔
tags:
  - C#
  - TEST
order: 1 # 大于 0 即代表置顶，数值越大越靠前
description: |-
  这是文章的摘要内容，支持 **加粗** 和超链接。
  若摘要中包含图片（如 `![演示](./assets/pic.png)`），列表页沉浸渲染，进入详情页自动隐去。
---

# 正文标题（可选）
正文内容...
```

#### 字段说明：
- `title`（必填）：文章标题；
- `date`（推荐）：发布日期，支持 `YYYY-MM-DD`、`YYYY-MM-DD HH:mm` 或 ISO 格式，内置算法自动免疫时区漂移；
- `order`（可选）：置顶权重，大于 0 时在标题前展示 📌 并优先排在顶部；
- `category`（可选）：分类名称，同步汇总至 `/pages/category`；
- `tags`（可选）：标签列表，同步汇总至 `/pages/tags`；
- `description`（可选）：文章摘要，支持标准 Markdown 与相对路径静态资源。

---

## 四、 核心目录结构

```text
├── .vitepress/
│   ├── config.ts               # VitePress 站点核心配置 (Mermaid、SEO、搜索、构建)
│   ├── theme/
│   │   ├── components/         # 页面组件 (Page.vue、NewLayout.vue、Comment 等)
│   │   ├── custom.css          # 自定义视觉样式与富媒体适配
│   │   ├── date.ts             # 日期标准化核心算法
│   │   ├── functions.ts        # 摘要 Markdown 渲染、路径重写与标签归类
│   │   ├── index.ts            # 主题入口、MediumZoom 与 GA 注册
│   │   └── serverUtils.ts      # Node 编译期文章扫描与分页生成逻辑
├── pages/                      # 基础索引页面 (category, archives, tags, about)
├── posts/                      # 博主内容资产库 (博文 Markdown 与文章专属插图/多媒体)
├── public/                     # 开发者全局公共资源 (站点 logo, favicon 等)
├── tests/                      # Vitest 单元测试套件
├── docs/                       # 项目架构、版本演进与发布文档体系
│   ├── index.md                # 统一文档中心门户 (Documentation Portal)
│   ├── Release.md              # 当前最新版本发布技术详单 (v2.11)
│   ├── ReleaseNote.md          # 面向读者的友好化版本更新通报
│   ├── changeLog.md            # 历史版本核心要点摘要与检索索引
│   ├── configuration-guide.md  # 博客模板环境配置与上线指引
│   ├── README.md               # 版本控制与 CI/CD 发布管理规范
│   ├── vitepress-blog-pure-comparison.md # 与上游主题深度对比与重构分析
│   └── changes/                # 历史各版本独立技术详单库 (如 v2.11.md)
└── package.json
```

### 资源权责划分与边界隔离原则 (Resource Boundaries)

为了保障工程架构的长期高内聚与低耦合，MagicNote 确立了严格的资源权责隔离规范：

1. **`public/` 目录归【开发者管理】**：
   - 仅用于存放站点的**全局公共静态资源**（如 `public/favicon.ico`、`public/assets/logo/` 等）；
   - **绝对红线**：严禁将任何博文内容、博文配图或 `posts/` 业务目录复制或发布到 `public/` 目录下。CI 清洗与安全门禁会对 `public/posts` 进行零容忍拦截。
2. **`posts/` 目录归【博主管理】**：
   - 文章 Markdown 源文件以及博文所引用的插图、封面图等，由博主在文章同级或专属子目录下就地维护（如 `posts/2026/images/`）；
   - 博主在 Markdown 中直接使用相对路径（如 `![演示](./images/pic.png)`）进行引用，由 VitePress 原生资产管道编译打包，杜绝跨越侵入 `public/`。
3. **`.vitepress/config.ts` 保持纯粹声明式**：
   - 站点配置文件严格保持声明式纯粹性，不充当 Node.js 静态文件流代理或跨目录文件搬运工，保障开发与构建的高效稳定。

---

## 五、 文档中心与版本管理体系 (Documentation & Releases)

本工程建立了完备的文档与版本发布管理体系，集中维护于 [`docs/`](docs/) 目录，并与 Azure DevOps CI/CD 自动化流水线深度集成：

### 1. 核心文档矩阵

| 文档 / 路径 | 职责与定位 | 目标受众 |
| :--- | :--- | :--- |
| **[📚 统一文档中心门户 (docs/index.md)](docs/index.md)** | 项目文档、架构报告与 Azure DevOps Markdown Reports 统一索引入口 | 全体研发 / 访客 |
| **[📑 最新发布技术详单 (docs/Release.md)](docs/Release.md)** | 当前最新版本（**v2.11**）全量变更日志、底层配置与测试状态镜像 | 研发团队 / 运维审查 |
| **[🌟 读者友好发布通告 (docs/ReleaseNote.md)](docs/ReleaseNote.md)** | 采用面向读者的通俗易懂语言，阐述新版本带来的功能价值与体验改进 | 博客读者 / 终端访客 |
| **[📊 版本演进摘要索引 (docs/changeLog.md)](docs/changeLog.md)** | 汇总各规划版本的核心演进亮点，提供全局快速检索能力 | 架构师 / 协作者 |
| **[🛠️ 模板环境配置指南 (docs/configuration-guide.md)](docs/configuration-guide.md)** | 包含站点脱敏配置、数据分析 (GA4)、广告 (AdSense)、评论 (Giscus) 与部署实战 | 开发者 / 站长 |
| **[🗂️ 历史全量版本库 (docs/changes/)](docs/changes/v2.11.md)** | 各历史版本独立技术详单（如 [v2.11.md](docs/changes/v2.11.md)） | 审计 / 历史溯源 |
| **[📖 版本与发布管理规范 (docs/README.md)](docs/README.md)** | 规划版本（`package.json`）与流水线自动版本号（`Build 2.11.0.1`）生成准则与 CI/CD 绑定机制 | 核心维护者 / CI 管理员 |
| **[🔍 博客架构演进对比报告 (docs/vitepress-blog-pure-comparison.md)](docs/vitepress-blog-pure-comparison.md)** | 相比上游 `vitepress-blog-pure` 在 SSG 分页、Markdown 摘要渲染、测试门禁等方面的深度演进分析 | 架构设计 / 技术选型 |


---

## 六、 历史备忘与扩展资源

### 1. 架构考量与常见问题
- **根目录临时文件**：运行 `pnpm dev` 时，`serverUtils.ts` 会动态在应用根目录生成 `index.md` 与 `page_*.md` 分页文件，以利用 VitePress 原生路由渲染首页及分页，构建时由 Git 自动跟踪或覆写。
- **代理与部署**：可通过 Cloudflare Workers 搭建 CORS 代理或辅助中转。
- **Google AdSense**：可在 `.vitepress/config.ts` 中的 `head` 按需配置 Google AdSense 脚本：
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
  ```

### 2. 相关扩展参考
- [VitePress 插件汇总](https://vitepress.yiov.top/plugin)
- [VitePress 主题配置指南](https://zhichao.org/vitepress/theme-config)
- [与上游 vitepress-blog-pure 详细对比分析报告](docs/vitepress-blog-pure-comparison.md)

---

## 七、 鸣谢 (Credits)

- 本博客主题最初衍生自 [Airene](https://github.com/airene) 的开源项目 [vitepress-blog-pure](https://github.com/airene/vitepress-blog-pure)；
- 核心静态渲染基于 [Vue.js](https://vuejs.org/) 与 [VitePress](https://vitepress.dev/)。

---

## 八、 许可证 (License)

[MIT License](https://opensource.org/licenses/MIT)

