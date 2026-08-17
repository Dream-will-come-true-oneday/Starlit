# Changelog

本文件记录 Starlit 的重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)，版本号暂沿用项目现有的 `1.0.0`。

## [Unreleased] - 2026-08-17

### Added

- 新增「星际控制台」全局视觉系统：深色网格背景、统一状态色、信号轨道、焦点样式和 reduced-motion 支持。
- 新增 `AppIcon` 图标封装，统一使用 `lucide-vue-next`，并为图标按钮补充无障碍名称。
- 新增 Starlit 品牌 favicon，修复开发和预览环境中的 favicon 404。
- 首页升级为今日学习驾驶舱，集中展示今日新学、今日复盘、连续打卡、模块进度和等级状态。
- 规划、复盘和 AI 练习页面补齐时间线、状态面板、语音控制、错误态和报告态的响应式布局。
- 新增本次版本的实施文档：`spec.md`、`plan.md`、`task.md`、`checklist.md`。

### Changed

- 四个学习模块统一等级切换、学习会话、已学列表、空状态和记忆曲线弹层的交互结构。
- 等级选择支持双向切换。回退到低等级时，不删除原有进度、复盘记录或记忆曲线，并定位到该等级第一个未学项目。
- 复盘节点支持键盘操作、完成后取消打卡，`ReviewCheckIn` 的禁用态和状态文案统一。
- 记忆曲线节点增加 `tabindex`、`role="button"`、Enter/Space 操作和 `aria-label`。
- 导航改为品牌、图标、当前页信号线结构；移动端导航支持横向滚动并保留品牌标识。
- AI 对话练习统一空闲、生成中、对话中、语音识别、等待 AI、报告生成、错误和完成状态。

### Fixed

- 修复复盘项缺少 `scheduledDate` 时，今日待打卡状态无法正确显示的问题。
- 修复单词模块切换到低等级后无法回退的问题。
- 修复记忆曲线最右侧日期文字在 SVG 边界处被裁切的问题。
- 修复已完成复盘节点无法取消打卡的问题。

### Verification

- `npm run build` 构建通过。
- Playwright 已检查 8 个路由在 1280×800、390×844、375×812 下的布局；无横向溢出。
- 浏览器控制台无 404、运行时异常或未处理错误。

## [1.0.0] - 2026-08-12

### Added

- 发布 Starlit 英语学习应用 MVP。
- 提供单词、短语、语法、实用知识四个 L1-L5 学习模块。
- 提供本地优先进度、艾宾浩斯 1/2/4/7/15/30 天复盘计划、学习规划、复盘中心和数据备份。
- 提供 FastAPI 后端的 JWT 账号、内容查询、进度同步和复盘 API。

[Unreleased]: https://github.com/Dream-will-come-true-oneday/Starlit/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Dream-will-come-true-oneday/Starlit/releases/tag/v1.0.0
