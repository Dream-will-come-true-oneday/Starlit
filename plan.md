# Starlit「星际控制台」界面优化 Plan

## 架构概览

以现有 Vue 3 + 原生 CSS Variables 为基础，新增 `AppIcon` 作为轻量图标适配层，统一应用壳和跨模块视觉 token；页面继续直接使用现有 Pinia store、composable 和 API。

## 核心接口

### AppIcon

- `name: string`：图标注册名。
- `size: number|string = 16`：图标尺寸。
- `strokeWidth: number|string = 1.8`：线宽。
- `label?: string`：有值时输出可访问名称，无值时设置 `aria-hidden`。

### MemoryCurveChart

- 保持现有 `check-in` 与 `un-check-in` 事件。
- SVG 节点增加 `tabindex`、`role="button"`、`aria-label` 和 Enter/Space 键盘触发。

## 模块设计

- 全局层：重设 `main.css` token、网格背景、导航、按钮、徽章、卡片、焦点和响应式规则；`App.vue` 增加带图标的导航；`index.html` 增加 favicon。
- 首页层：Dashboard 重排为今日驾驶舱，使用现有计算属性，不引入新状态。
- 学习层：Word/Phrase/Grammar/Extra 及 Card/List/LearnSession/LevelBadge 使用同一会话和等级视觉结构。
- 计划复盘层：PlanView/DayCard/ReviewCenter/MemoryCurveChart/ReviewCheckIn 统一状态轨道、日期和操作反馈。
- 练习层：Practice 只调整结构与样式，保留 `generateScenario`、`sendTurn`、`generateReport` 和语音 composable。

## 文件组织

```text
src/components/common/AppIcon.vue       # Lucide 图标适配层
src/styles/main.css                     # 全局 token 与组件样式
src/App.vue                             # 应用壳和导航
src/views/*.vue                         # 页面结构与 scoped 样式
src/components/**/*.vue                 # 可复用卡片、列表、时间线和图表
public/favicon.svg                      # Starlit 品牌 favicon
```

## 技术决策

| 决策点 | 选择 | 理由 |
| --- | --- | --- |
| 图标 | lucide-vue-next | 轻量、线性、一致且支持可访问标签 |
| 图表 | 保留现有 SVG | 不增加图表依赖，保留节点交互 |
| 主题 | 深色星际控制台 | 与 Starlit 现有暗色基线一致，适合沉浸学习 |
| 数据 | 复用现有 stores/API | 降低行为回归风险 |
