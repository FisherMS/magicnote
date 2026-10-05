# 📚 博客系统文档中心 (Documentation Portal)

欢迎查阅博客技术中台文档中心。本文档作为 CI/CD 自动化报告与本地技术查阅的统一索引门户。

---

## 🚀 核心发布与版本导航

| 文档 | 职责说明 | 目标受众 |
| :--- | :--- | :--- |
| **[📑 最新发布详单 (Release.md)](./Release.md)** | 最新版本的技术变更全单、依赖变动与质量门禁状态 | 研发人员 / 运维团队 |
| **[🌟 读者发布通报 (ReleaseNote.md)](./ReleaseNote.md)** | 面向博客读者与终端访客的友好功能更新说明 | 站点访客 / 读者 |
| **[📊 版本演进摘要 (changeLog.md)](./changeLog.md)** | 历史所有正式版本的核心要点概要与检索索引 | 研发团队 / 协作者 |
| **[🗂️ 历史全量版本库 (changes/)](./changes/v2.11.md)** | 各历史版本独立技术详单（如 [v2.11.md](./changes/v2.11.md)） | 审计 / 历史溯源 |

---

## 🛠️ 架构设计与工程规范

- **[📖 子项目开发与维护手册 (README.md)](./README.md)**：包含本地启动、构建预览、测试运行、目录职责与设计原则；
- **[🛠️ 博客模板环境配置与上手指引 (configuration-guide.md)](./configuration-guide.md)**：包含站点脱敏配置、数据分析 (GA4)、广告接入 (AdSense)、评论系统 (Giscus) 与自动化部署实战；
- **[🔍 博客架构演进与纯血对比 (vitepress-blog-pure-comparison.md)](./vitepress-blog-pure-comparison.md)**：对比纯血 VitePress 博客升级前后的架构优化、静态分页算法与核心收益。

---

## 🧪 自动化测试与质量保障

- **测试套件**：Vitest + V8 Coverage + happy-dom；
- **核心用例**：
  - [convertDate.test.ts](../tests/convertDate.test.ts)：日期多格式安全解析与时区避让；
  - [descriptionMarkdown.test.ts](../tests/descriptionMarkdown.test.ts)：FrontMatter 摘要 Markdown 渲染安全。
- **本地执行**：
  ```bash
  # 运行全量单元测试
  pnpm test

  # 运行覆盖率分析并导出报告
  pnpm run coverage
  ```
