# Release (Version 2.11)

> 💡 **说明**：本文件为当前最新一次版本的变化日志，内容镜像同步自 [changes/v2.11.md](changes/v2.11.md)。
> 面向用户的友好化发布说明见 [ReleaseNote.md](ReleaseNote.md)，版本摘要索引见 [changeLog.md](changeLog.md)。

---

## Build 2.11.0.1 (20261005.1)


### Added
- **自动化测试体系构建**：集成 Vitest 5 + V8 Coverage + happy-dom 测试套件，构建 15+ 自动化测试用例，覆盖核心日期转换算法、相对路径解析与 Markdown 渲染安全。
- **Markdown 摘要沉浸式渲染**：支持在 FrontMatter `description` 中编写加粗、斜体、链接等富文本 Markdown 语法，并通过 `marked` 管道在首页列表与分页流中直接编译渲染。
- **相对路径自动重写**：针对博文中 `./images/pic.png` 相对路径资源，自动计算并转为站点根路径 `/posts/.../images/pic.png`，彻底消除首页列表展示时的图片 404 异常。
- **正文详情页图文摘要智能规避**：新增 `hasImageInDescription` 智能识别算法，若摘要中包含图片，正文顶部自动隐去摘要区块，杜绝图片重复渲染。
- **图片点击全屏放大灯箱**：原生集成 `medium-zoom`，支持路由切换时自动重载，提升正文插图阅读沉浸感。
- **架构图与思维导图支持**：集成 `vitepress-plugin-mermaid`，支持直接在 Markdown 中编写 Flowchart、Sequence、Class 等技术架构图。
- **本地开发目录隔离调试**：引入 `devFolders` 配置，支持本地仅编译指定工作区目录，大幅缩短热更新耗时。
- **广告与统计集成**：接入 Google AdSense 与 Google Analytics 4 原生静态配置。
- **CI 测试与代码覆盖率报告原生点亮**：配置 Vitest 导出标准 JUnit 报告 (`test-results.xml`)，并在流水线中接入 `PublishTestResults@2` 与升级为 `PublishCodeCoverageResults@2`，摆脱对构建机本地 .NET Core 运行时的依赖，原生激活 Azure DevOps 的 Tests 与 Code Coverage 专属 Tab。
- **开源清洗与演示站自动发布**：新增 CI 源码清洗与脱敏导出机制，自动将本次发布相关文档发布到演示博客 (blogdemo) 中，并对齐 GitHub `dev/v2.11` 分支。


### Changed
- **资源权责边界与纯粹化治理**：严格隔离开发者公共资产与博主内容资产——`public/` 仅限开发者管理站点全局静态资产（Logo、Favicon），严禁混入任何 `posts/` 业务资源；博主资产就地留存在 `posts/` 目录下；彻底移除 `config.ts` 中的文件流代理中间件与 `buildEnd` 跨目录复制钩子，使站点配置回归纯粹声明式。
- **版本号对齐**：统一规范版本号为 2.11.0，对应规划版本 `v2.11` 与流水线构建号 `Build 2.11.0.1`。
- **GitHub 同步分支规范化**：同步到 GitHub 的分支统一升级为 `dev/v两位版本号` 规范（当前为 `dev/v2.11`）。
- **分析与跟踪架构收敛统一**：移除冗余的 Google 跟踪代码管理器 (GTM) 以及前端运行时插件 `vitepress-plugin-google-analytics`，将 Google Analytics 4 (GA4) 与 Google AdSense 直接统一收敛至 `.vitepress/config.ts` 的 `head` 配置中，消除主题层无谓的运行时注入，确保静态生成与 SSR 一致性。
- **包管理与脚本安全升级**：严格绑定 `pnpm@10.27.0`，锁定依赖解析并规范构建流水线。
- **构建告警阈值治理**：将 Rollup 单包体积警告阈值提升至 1000 KB (`chunkSizeWarningLimit: 1000`)，消除引入大型图表库后的误报提示。
- **日期标准化算法**：彻底重构 `date.ts`，免疫客户端时区偏移，严格标准化输出 `YYYY-MM-DD HH:mm`。
- **页脚版权版本动态化**：将页脚硬编码的 VitePress 引擎版本改为动态解析 `package.json`（自动规整 `^`/`~` 前缀），实现与当前升级的 `v1.6.4` 实时联动。

### Fixed
- 修复 Vite 5/8 在开发期（Dev 模式）加载 Mermaid 等 CommonJS 深层依赖时缺少 `default` 导出导致的白屏问题。
- 修复置顶字段从 `order` 迁移至 `top` 后的优先级倒排失效缺陷。
- 修复开源源码清洗时的静态资源渗透问题：在 `clean-blog-source.ps1` 中彻底移除向 `public/posts` 复制示例图片的违规逻辑，并在 `audit-cleaned-source.ps1` 门禁中对 `public/posts` 设立零容忍拦截，彻底杜绝权责混淆。
