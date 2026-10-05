# 版本控制与发布文档管理规范

本目录集中管理博客项目的版本演进日志、发布文档与对外通告体系。

---

## 一、 核心文档职责与意义

| 文档 / 目录 | 职责与意义 | 内容来源与维护机制 | 面向受众 |
| :--- | :--- | :--- | :--- |
| **[`changes/`](changes/)** | **历史版本的变化日志库**。<br>每个版本独立为一个 Markdown 文件。<br>**命名规则**：文件名**只保留前两位**（如 `v2609.md`），后两位（如 `Build 20260928.1`）为流水线自动版本号。 | 功能开发与缺陷修复时持续增量追加。 | 核心开发人员、审查者 |
| **[`Release.md`](Release.md)** | **最后一次版本的变化日志**。<br>内容与 `changes/` 里最新的那个文件同样的内容。 | 每次版本发布或封板时，全文镜像同步自 `changes/` 最新的版本文件。 | 研发与测试团队、技术运维 |
| **[`changeLog.md`](changeLog.md)** | **对 `changes` 里的精炼摘要与索引**。<br>汇聚各版本的核心要点概要，提供全局快速检索能力。 | 发布新版本时增量提炼要点。 | 协作者、架构师、外部开发者 |
| **[`ReleaseNote.md`](ReleaseNote.md)** | **发布时针对 Release 的友好化的语言内容**。<br>采用面向用户、读者和非技术人员的通俗易懂语言，阐述新功能带来的价值。 | 发布前基于 `Release.md` 润色提炼而成，通俗表达、避免代码堆砌。 | 博客读者、终端用户、产品运营 |

---

## 二、 版本号生成规范

子工程的版本号严格**以 `package.json` 中的 `version` 字段为准**（当前为 `2.11.0`）：

$$\text{版本标识} = \underbrace{v\text{Major}.\text{Minor}}_{\text{前两位：package.json 规划版本 (v2.11)}} \,.\, \underbrace{\text{Patch}.\text{Rev}}_{\text{后两位：流水线自动版本号 (0.1)}}$$

1. **前两位（规划版本）**：
   - 规则：取 `package.json` 的主版本与次版本（如 `2.11.0` 对应 `v2.11`）；
   - 在 `changes/` 目录中的文件名严格以该两段命名，如 `changes/v2.11.md`。
2. **后两位（流水线自动版本号）**：
   - 规则：由 CI 流水线基于 Patch 与构建触发序号自动补全（如 `Build 2.11.0.1`），并在构建产物、日志控制台及部署报告中统一展示。
   - **注意区别**：只有总项目（根目录）才以当前 Git 分支名称为版本号；子项目一律以其 `package.json` 为准。


---

## 三、 CI/CD 自动化流水线引用规范

这些相关文档与 Azure DevOps CI/CD 流水线深度绑定：

1. **CI 执行时 (During Build)**：
   - 流水线脚本（`build.ps1`）在编译目标项目时，会自动扫描当前项目 `docs/` 目录下的 `Release.md`、`ReleaseNote.md`、`changeLog.md` 与 `changes/`；
   - 在构建控制台中高亮打印版本信息与关联文档路径，并导出对应的流水线输出变量供下游任务使用。
2. **CI 执行后 (Post-Build Summary)**：
   - 产物构建验证完成后，触发 `generate-ci-summary.ps1`；
   - 自动提取 `ReleaseNote.md`（友好发布说明）与 `Release.md`（技术变更）的核心内容；
   - 通过 `##vso[task.uploadsummary]` 指令生成 Markdown 卡片，直观呈现在 Azure DevOps 构建详情的 Summary 首页。
3. **CD 生产部署 (CD Deploy)**：
   - 自动化部署脚本（`deploy-pages.ps1`）在执行预发布或生产上线后，优先把友好发布说明（`ReleaseNote.md`）渲染到部署报告中，为上线审批人提供清晰易懂的验收指引。
