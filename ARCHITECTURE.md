# 英语学习应用 — 架构规划文档

> 生成时间：2026-08-12 | 方法论：Vibe Coding 架构师 | 阶段：Phase 1-4 完成 + 其他知识模块规划

---

## 1. 项目背景

开发一款覆盖"单词、短语、语法、其他知识"四大模块的英语学习应用，从日常生活场景起步，逐步进阶到经济、IT 等专业领域。核心差异化功能是艾宾浩斯记忆曲线复盘系统——每个学习项学完后自动生成 6 个复习节点，用户在对应日期打卡则点亮，否则熄灭。

## 2. 目标用户

有一定英语基础、希望系统化提升英语能力的学习者，需要科学记忆管理而非简单刷词。

## 3. 核心需求

1. **四大独立模块**：单词、短语、语法、其他知识，各自独立学习路径
2. **五级难度进阶**：L1 日常 → L2 社交 → L3 职场 → L4 经济 → L5 IT
3. **记忆曲线复盘**：每个学习项自动生成 6 个复习节点（Day 1/2/4/7/15/30）
4. **打卡点亮系统**：按期打卡 = 点亮，逾期未打卡 = 熄灭
5. **每日学习计划**：自动汇总当天待学习 + 待复盘内容
6. **学习规划视图**：时间线展示过去/今天/未来的每日学习内容，含每日句子
7. **进度可视化**：连续打卡天数、完成率、等级进度

## 4. 架构设定

| 维度 | 决策 |
|:---|:---|
| 产品形态 | Web 应用（SPA） |
| 架构模式 | 四层分层架构（Presentation / State / Data / Content） |
| 运行环境 | 纯前端，浏览器本地运行，零部署 |
| 数据持久化 | localStorage（Repository 模式封装，可迁移） |

## 5. 技术约束

| 技术 | 版本 | 用途 |
|:---|:---|:---|
| Vue 3 | ^3.4 | UI 框架（Composition API） |
| Vite | ^5.0 | 构建工具 |
| Pinia | ^2.1 | 状态管理 |
| Vue Router | ^4.3 | 路由 |
| Day.js | ^1.11 | 日期计算（记忆曲线调度） |
| CSS | 原生 CSS + CSS Variables | 样式（暗色主题优先） |

**不引入的依赖**：不使用 UI 组件库（Element/Naive），不使用 Tailwind，不使用图表库（记忆曲线用 SVG 手绘）。

## 6. 非功能需求

- **性能**：首屏加载 < 2s，localStorage 读写 < 50ms
- **兼容性**：Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+
- **响应式**：桌面 1024px+ 优先，移动端 375px+ 可用
- **数据安全**：学习数据本地存储，支持导出/导入 JSON 备份
- **可扩展**：数据层 Repository 模式，未来可替换为 IndexedDB 或后端 API

## 7. 实施计划（任务拆解）

```
英语学习应用
├── M0: 项目初始化 & 基础架构
│   ├── M0.1 Vite + Vue 3 项目搭建
│   ├── M0.2 Pinia + Vue Router 配置
│   ├── M0.3 localStorage Repository 封装
│   └── M0.4 全局样式 & 布局骨架
├── M1: 学习内容数据层
│   ├── M1.1 数据 Schema 定义（Item / Review / Progress）
│   ├── M1.2 单词库 L1-L5（每级 30-50 词）
│   ├── M1.3 短语库 L1-L5（每级 20-30 条）
│   ├── M1.4 语法库 L1-L5（每级 10-15 条）
│   └── M1.5 其他知识库 L1-L5（每级 10-15 条，含学习资源推荐）
├── M2: 记忆曲线核心引擎
│   ├── M2.1 艾宾浩斯复习间隔算法
│   ├── M2.2 复习计划自动生成
│   ├── M2.3 打卡状态管理（lit / unlit）
│   └── M2.4 记忆曲线 SVG 可视化组件
├── M3: 单词模块
│   ├── M3.1 单词学习卡片（翻转卡）
│   ├── M3.2 单词列表 & 等级筛选
│   └── M3.3 单词记忆曲线打卡图
├── M4: 短语模块
│   ├── M4.1 短语学习卡片（含例句）
│   ├── M4.2 短语列表 & 筛选
│   └── M4.3 短语记忆曲线打卡图
├── M5: 语法模块
│   ├── M5.1 语法讲解卡片（规则+例句）
│   ├── M5.2 语法列表 & 筛选
│   └── M5.3 语法记忆曲线打卡图
├── M9: 其他知识模块（实用英语 + 资源推荐）
│   ├── M9.1 其他知识卡片（要点+示例+推荐）
│   ├── M9.2 其他知识列表 & 分类筛选
│   └── M9.3 其他知识记忆曲线打卡图
├── M6: 仪表盘 & 进度系统
│   ├── M6.1 今日待学习 + 待复盘总览
│   ├── M6.2 连续打卡天数
│   ├── M6.3 各模块完成进度
│   └── M6.4 等级解锁状态
├── M8: 学习规划视图
│   ├── M8.1 时间线视图组件（过去/今天/未来）
│   ├── M8.2 每日计划自动生成算法
│   ├── M8.3 日卡详情展开（新学+复盘+每日句子）
│   └── M8.4 历史回看 & 未来预览导航
└── M7: 打磨 & 优化
    ├── M7.1 移动端响应式适配
    ├── M7.2 数据导出/导入
    └── M7.3 整体联调 & 边界测试
```

**模块依赖关系**：
- M0 → 所有模块的基础
- M1 → M2/M3/M4/M5/M9/M8 依赖内容数据
- M2 → M3/M4/M5/M9/M8 依赖记忆曲线引擎
- M3/M4/M5/M9 → M6 依赖各模块数据汇总
- M8 → M6 仪表盘可引用规划视图数据
- M6/M8 → M7 最后打磨

**实施顺序**：M0 → M1 → M2 → M3 → M4 → M5 → M9 → M8 → M6 → M7

## 8. 输出要求

每个模块完成时需输出：
- **代码**：符合目录结构规范，组件职责单一
- **说明**：关键设计决策的注释
- **验证**：`npm run dev` 启动后功能可正常使用

## 9. 验收标准

| 验收项 | 标准 |
|:---|:---|
| 四大模块 | 单词/短语/语法/其他知识各有独立学习页面和列表 |
| 记忆曲线 | 每个学习项（含其他知识）学完后自动生成 6 个复习节点 |
| 打卡系统 | 到期可打卡，打卡后节点点亮，未打卡熄灭 |
| 难度进阶 | L1-L5 逐级解锁，完成当前等级解锁下一级 |
| 数据持久化 | 刷新页面数据不丢失，支持导出/导入备份 |
| 每日计划 | 首页显示当天待学习 + 待复盘内容（含其他知识） |
| 学习规划视图 | 时间线展示过去/今天/未来每日内容，含每日句子 |
| 资源推荐 | 其他知识模块内置学习资源推荐（播客/美剧/阅读/频道） |
| 响应式 | 桌面和移动端均可正常使用 |

## 10. 限制条件

1. **不过度设计**：MVP 阶段不实现用户系统、社交功能、云同步
2. **不引入 UI 组件库**：用原生 CSS，保持轻量
3. **不引入图表库**：记忆曲线用 SVG 手绘，完全可控
4. **不使用 TypeScript**：MVP 用纯 JS，降低复杂度（后续可迁移）
5. **不实现语音朗读**：MVP 不依赖浏览器 TTS API
6. **每次只做一个模块**：完成验证后再做下一个

---

## 附录 A：数据模型

### LearningItem（学习内容）

```javascript
{
  id: "word-l1-001",           // 唯一ID：类型-等级-序号
  type: "word",                 // word | phrase | grammar | extra
  level: 1,                     // 1-5
  category: "greetings",        // 主题分类
  content: "hello",             // 英文内容
  meaning: "你好",              // 中文释义
  phonetic: "/həˈloʊ/",         // 音标（单词专属）
  example: "Hello, how are you?", // 例句
  exampleCn: "你好，你怎么样？",   // 例句翻译

  // —— 其他知识（type: extra）专属字段 ——
  detail: "易混点：...",        // 详细知识点讲解（其他知识专属）
  structure: "S + V + O",       // 结构公式（语法/其他知识可用）
  rule: "使用规则说明",          // 规则要点
  tips: ["学习提示1", "学习提示2"], // 学习技巧（其他知识专属）
  recommend: {                   // 学习资源推荐（其他知识专属，可选）
    type: "podcast",             // podcast | show | reading | channel
    name: "BBC Learning English",
    desc: "推荐理由与简介",
    link: "https://..."          // 可选外链
  }
}
```

### ReviewRecord（复习记录）

```javascript
{
  reviewId: 0,                  // 0-5，对应 6 个复习节点
  scheduledDate: "2026-08-13",  // 计划复习日期
  status: "pending",            // pending | completed | missed
  completedDate: null           // 实际完成日期
}
```

### LearningProgress（学习进度）

```javascript
{
  itemId: "word-l1-001",
  type: "word",
  learnedDate: "2026-08-12",    // 首次学习日期
  reviews: [ReviewRecord, ...], // 6 条复习记录
  memoryStrength: 33,           // 记忆强度 0-100（已完成的复习占比）
  isMastered: false             // 6 次复习全部完成
}
```

### AppData（应用全局数据）

```javascript
{
  version: "1.0.0",
  createdAt: "2026-08-12",
  currentLevel: 1,              // 当前解锁等级
  streakDays: 3,                // 连续打卡天数
  lastCheckInDate: "2026-08-11",
  contentIndex: {               // 内容进度指针（用于生成未来计划，四模块）
    word: 15,                   // 已学到第 15 个单词
    phrase: 9,
    grammar: 3,
    extra: 2                    // 已学到第 2 条其他知识
  },
  progress: [LearningProgress, ...] // 所有学习进度
}
```

### DailyPlan（每日学习计划）

```javascript
{
  date: "2026-08-12",           // 日期
  dayStatus: "today",           // past | today | future

  // 新学内容（四模块 + 每日句子）
  newItems: {
    words: ["word-l1-016", "word-l1-017", "word-l1-018", "word-l1-019", "word-l1-020"],
    phrases: ["phrase-l1-010", "phrase-l1-011", "phrase-l1-012"],
    grammar: ["grammar-l1-004"],
    extra: ["extra-l1-003", "extra-l1-004"],        // 其他知识（含资源推荐）
    sentence: "I'd like to order a coffee, please.", // 每日句子
    sentenceCn: "我想要点一杯咖啡。"
  },

  // 复盘内容（来自记忆曲线调度，四模块同体系）
  reviewItems: [
    { itemId: "word-l1-001", type: "word", reviewId: 2, status: "completed" },
    { itemId: "phrase-l1-003", type: "phrase", reviewId: 1, status: "pending" },
    { itemId: "extra-l1-002", type: "extra", reviewId: 1, status: "pending" },
    // ...
  ],

  // 完成统计
  completion: {
    newTotal: 10,               // 5 words + 3 phrases + 1 grammar + 1 extra
    newCompleted: 3,
    reviewTotal: 6,
    reviewCompleted: 1
  }
}
```

## 附录 B：记忆曲线算法

```javascript
// 艾宾浩斯复习间隔（天）
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30];

// 学完一个知识点时调用，生成复习计划
function generateReviewSchedule(learnedDate) {
  return REVIEW_INTERVALS.map((days, index) => ({
    reviewId: index,
    scheduledDate: dayjs(learnedDate).add(days, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    completedDate: null
  }));
}

// 获取今天需要复盘的所有学习项
function getTodayReviews(allProgress) {
  const today = dayjs().format('YYYY-MM-DD');
  return allProgress.filter(item =>
    item.reviews.some(r =>
      r.scheduledDate === today && r.status === 'pending'
    )
  );
}

// 打卡：完成一次复习
function checkIn(progress, reviewId) {
  const review = progress.reviews.find(r => r.reviewId === reviewId);
  if (review && review.status === 'pending') {
    review.status = 'completed';
    review.completedDate = dayjs().format('YYYY-MM-DD');
  }
  progress.memoryStrength = Math.round(
    (progress.reviews.filter(r => r.status === 'completed').length / 6) * 100
  );
  progress.isMastered = progress.reviews.every(r => r.status === 'completed');
  return progress;
}

// 检查并标记逾期的复习为 missed
function markMissedReviews(allProgress) {
  const today = dayjs().format('YYYY-MM-DD');
  allProgress.forEach(item => {
    item.reviews.forEach(r => {
      if (r.status === 'pending' && r.scheduledDate < today) {
        r.status = 'missed';
      }
    });
  });
  return allProgress;
}
```

## 附录 B2：每日学习计划算法

```javascript
// 每日学习量配置
const DAILY_CONFIG = {
  wordsPerDay: 5,
  phrasesPerDay: 3,
  grammarPerDay: 1,
  extraPerDay: 1,          // 其他知识每日 1 条（含资源推荐）
};

// 每日句子库（按等级分组，与新学内容主题对应）
const DAILY_SENTENCES = {
  1: [
    { en: "I'd like to order a coffee, please.", cn: "我想要点一杯咖啡。" },
    { en: "What time does the train arrive?", cn: "火车几点到？" },
    // ...
  ],
  // L2-L5 同结构
};

// 生成指定日期的学习计划
function generateDailyPlan(date, level, contentIndex, allProgress) {
  const today = dayjs().format('YYYY-MM-DD');
  const dayStatus = date < today ? 'past' : date === today ? 'today' : 'future';

  // 1. 从内容库取新学内容（四模块）
  const words = getWords(level, contentIndex.word, DAILY_CONFIG.wordsPerDay);
  const phrases = getPhrases(level, contentIndex.phrase, DAILY_CONFIG.phrasesPerDay);
  const grammar = getGrammar(level, contentIndex.grammar, DAILY_CONFIG.grammarPerDay);
  const extra = getExtra(level, contentIndex.extra, DAILY_CONFIG.extraPerDay);

  // 2. 取每日句子
  const sentenceIndex = contentIndex.word % DAILY_SENTENCES[level].length;
  const sentence = DAILY_SENTENCES[level][sentenceIndex];

  // 3. 从记忆曲线获取当天复盘项（四模块同体系）
  const reviewItems = allProgress
    .flatMap(item =>
      item.reviews
        .filter(r => r.scheduledDate === date)
        .map(r => ({ itemId: item.itemId, type: item.type, reviewId: r.reviewId, status: r.status }))
    );

  // 4. 计算完成统计
  const newTotal = words.length + phrases.length + grammar.length + extra.length;
  const newCompleted = countCompletedNewItems(date, words, phrases, grammar, extra);
  const reviewTotal = reviewItems.length;
  const reviewCompleted = reviewItems.filter(r => r.status === 'completed').length;

  return {
    date,
    dayStatus,
    newItems: { words, phrases, grammar, extra, sentence },
    reviewItems,
    completion: { newTotal, newCompleted, reviewTotal, reviewCompleted }
  };
}

// 生成连续 N 天的计划（用于时间线视图）
function generatePlanRange(startDate, days, level, contentIndex, allProgress) {
  const plans = [];
  for (let i = 0; i < days; i++) {
    const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
    plans.push(generateDailyPlan(date, level, contentIndex, allProgress));
  }
  return plans;
}
```

> **注意（2026-08-12 更新）**：其他知识（extra）已纳入学习规划视图体系——每日新学内容、contentIndex 内容进度指针、每日复盘调度均包含 extra，与三大模块完全一致。

## 附录 C：目录结构

```
english-learning-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── moduleStore.js       # 单词/短语/语法数据
│   │   ├── reviewStore.js       # 记忆曲线调度
│   │   ├── progressStore.js     # 等级/连续打卡/统计
│   │   └── planStore.js         # 每日学习计划生成与缓存
│   ├── repositories/
│   │   └── storage.js           # localStorage 适配器
│   ├── data/
│   │   ├── words/
│   │   │   ├── l1-daily-life.js
│   │   │   ├── l2-social.js
│   │   │   ├── l3-workplace.js
│   │   │   ├── l4-economics.js
│   │   │   └── l5-it.js
│   │   ├── phrases/
│   │   │   └── (同上结构)
│   │   ├── grammar/
│   │   │   └── (同上结构)
│   │   ├── extra/                   # 其他知识库（实用英语 + 资源推荐）
│   │   │   ├── l1-practical.js
│   │   │   ├── l2-social.js
│   │   │   ├── l3-workplace.js
│   │   │   ├── l4-economics.js
│   │   │   └── l5-it.js
│   │   └── sentences/              # 每日句子库
│   │       ├── l1-sentences.js
│   │       └── (L2-L5 同结构)
│   ├── components/
│   │   ├── common/
│   │   │   ├── MemoryCurveChart.vue   # 记忆曲线 SVG 图
│   │   │   ├── ReviewCheckIn.vue      # 打卡按钮
│   │   │   ├── LevelBadge.vue         # 等级徽章
│   │   │   ├── RecommendCard.vue      # 学习资源推荐卡片（其他知识用）
│   │   │   └── DayCard.vue            # 每日计划卡片（规划视图用）
│   │   ├── word/
│   │   │   ├── WordCard.vue
│   │   │   └── WordList.vue
│   │   ├── phrase/
│   │   │   ├── PhraseCard.vue
│   │   │   └── PhraseList.vue
│   │   ├── grammar/
│   │   │   ├── GrammarCard.vue
│   │   │   └── GrammarList.vue
│   │   └── extra/
│   │       ├── ExtraCard.vue
│   │       └── ExtraList.vue
│   ├── views/
│   │   ├── Dashboard.vue        # 首页仪表盘
│   │   ├── PlanView.vue         # 学习规划时间线视图
│   │   ├── WordModule.vue       # 单词模块
│   │   ├── PhraseModule.vue     # 短语模块
│   │   ├── GrammarModule.vue    # 语法模块
│   │   ├── ExtraModule.vue      # 其他知识模块
│   │   └── ReviewCenter.vue     # 复盘中心
│   ├── composables/
│   │   ├── useMemoryCurve.js    # 记忆曲线逻辑
│   │   ├── useCheckIn.js        # 打卡逻辑
│   │   └── useDailyPlan.js      # 每日计划生成逻辑
│   ├── utils/
│   │   └── date.js              # Day.js 封装
│   └── styles/
│       └── main.css             # 全局样式 + CSS 变量
└── public/
```

## 附录 D：内容分级规划

| 等级 | 主题 | CEFR | 单词 | 短语 | 语法 | 其他知识 | 每日句子 |
|:---|:---|:---|:---|:---|:---|:---|:---|
| L1 | 日常生活 | A1-A2 | 50 | 30 | 12 | 12 | 30 |
| L2 | 社交互动 | A2-B1 | 50 | 30 | 12 | 12 | 30 |
| L3 | 职场办公 | B1-B2 | 40 | 25 | 10 | 12 | 25 |
| L4 | 经济金融 | B2-C1 | 40 | 25 | 10 | 12 | 25 |
| L5 | IT科技 | C1-C2 | 40 | 25 | 10 | 12 | 25 |
| **合计** | | | **220** | **135** | **54** | **60** | **135** |

**L1 单词示例**：hello, goodbye, thank you, sorry, please, yes, no, name, family, friend, water, food, shop, price, bus, train, weather, sunny, rain, house...

**L4 单词示例**：inflation, GDP, revenue, tariff, commodity, bull market, bear market, dividend, portfolio, liquidity, monetary, fiscal...

**L5 单词示例**：algorithm, database, framework, deployment, scalability, authentication, API, repository, iteration, refactoring, concurrency, microservice...

## 附录 D2：其他知识模块内容规划（type: extra）

定位：**课堂上学不到的实用英语**——把零散但高频的"英语生存技能"与"视野拓展资源"系统化，同样纳入记忆曲线打卡。

| 等级 | 分类 | 学习内容示例 | 资源推荐示例 |
|:---|:---|:---|:---|
| L1 | 数字时间 | 钟点/日期/年龄/电话号码表达 | Peppa Pig（动画） |
| L1 | 日常缩略 | I'm / don't / can't / let's | BBC 慢速新闻 |
| L1 | 礼貌用语 | 请求/道歉/感谢的多种说法 | English with Lucy |
| L2 | 常见缩写 | ASAP / e.g. / etc. / FYI / PS | Friends 生活美剧 |
| L2 | 高频句型 | Could you...? / How about...? | 日常对话类播客 |
| L2 | 场景表达 | 点餐/问路/订房/看病 | EnglishClass101 |
| L3 | 易混词辨析 | affect/effect、principal/principle | The Office（职场美剧） |
| L3 | 邮件固定表达 | attachment / as per / look forward to | TED 演讲 |
| L3 | 职场地道词 | touch base / circle back / brainstorm | Business English Pod |
| L4 | 经济术语速记 | CPI / PMI / 滞胀 / 央行工具 | The Economist |
| L4 | 金融缩写 | ROI / EBITDA / IPO / ETF | Financial Times 播客 |
| L4 | 精读方法 | 财经新闻三段式精读法 | Planet Money |
| L5 | IT 黑话 | CI/CD / DevOps / K8s / SaaS | Syntax 技术播客 |
| L5 | 技术写作句式 | It is worth noting... / key takeaway | Martin Fowler 博客 |
| L5 | 极客文化 | GitHub / Stack Overflow 使用习惯 | Hacker News |

**数据结构**：复用 LearningItem（type: extra），扩展 `detail`（知识点讲解）、`structure`（结构公式）、`rule`（规则）、`tips[]`（学习技巧）、`recommend`（资源推荐对象）等可选字段。

**与记忆曲线的关系**：其他知识条目同样在学习后自动生成 6 个复习节点，独立打卡点亮/熄灭，纳入每日复盘计划。

---

## 附录 E：上线部署架构规划（2026-08-12 决策版）

> 决策结论：**小范围公开（10-100 人）· 需要账号 · Python FastAPI · 云平台推荐腾讯云**。
> 原则：Local-first 本地优先同步，离线可用；架构预留升级空间，不一步到位。

### E.1 目标形态

| 维度 | 决策 |
|:---|:---|
| 产品形态 | 静态 SPA（Vue 3，构建产物托管） + REST API + 云数据库 |
| 规模 | 10-100 用户，单机 Docker 部署足够 |
| 认证 | 邮箱注册/登录，JWT + bcrypt，refresh token |
| 后端 | Python 3.11 + FastAPI + SQLAlchemy 2.0 + Alembic |
| 数据库 | PostgreSQL 14+（云托管优先，本地联调用 Docker） |
| 数据同步 | Local-first：本地先行 + 变更队列 + 增量同步 + 时间戳冲突合并 |
| 备份 | 每日 pg_dump 快照 → 对象存储（保留 30 天） |
| 部署 | 前端：COS+CDN（腾讯云）；后端：轻量服务器 Docker Compose |

### E.2 部署拓扑

```
用户浏览器
   │ HTTPS
   ├─▶ 腾讯云 COS + CDN（静态资源：SPA 构建产物）
   └─▶ API 网关 / Nginx → FastAPI (Uvicorn, Docker)
                                │
                                ├─▶ PostgreSQL（云数据库或同机容器）
                                └─▶ 对象存储 COS（备份、未来附件）
```

- 域名 + ICP 备案（腾讯云，提前 1-2 周流程）
- 后端单实例 2C2G 即可支撑 100 人；扩容 = 多实例 + 负载均衡

### E.3 数据库设计（PostgreSQL）

```sql
users:            id, email UNIQUE, password_hash, nickname, level, streak_days,
                  last_checkin_date, created_at
learning_items:   id, type(word|phrase|grammar|extra), level, category, content,
                  meaning, phonetic, example, example_cn, structure, rule,
                  detail, tips(jsonb), recommend(jsonb), version, UNIQUE(type,item_key)
user_progress:    id, user_id, item_id, learned_date, memory_strength, is_mastered,
                  updated_at, UNIQUE(user_id,item_id)
review_records:   id, user_id, item_id, review_id(0-5), scheduled_date,
                  status(pending|completed|missed), completed_date, updated_at,
                  UNIQUE(user_id,item_id,review_id)
sync_meta:        user_id, device_id, last_sync_at  -- 增量同步游标
```

- 时间戳 `updated_at` 用于同步冲突合并（后写覆盖 Last-Write-Wins）
- 索引：`review_records(user_id, scheduled_date)`（每日复盘查询）、`learning_items(type,level)`

### E.4 API 设计（RESTful + JWT）

```
POST   /api/auth/register                邮箱注册
POST   /api/auth/login                   登录，返回 access/refresh token
GET    /api/items?type=&level=&offset=   内容查询（只读，公共缓存）
POST   /api/progress/sync                增量同步（本地优先核心接口）
GET    /api/progress/snapshot            全量拉取（首次登录/换设备）
POST   /api/reviews/{rid}/checkin        复习打卡
GET    /api/plans/daily?date=            每日计划（新学+复盘）
GET    /api/me                           个人统计（streak/完成率）
POST   /api/export | /api/import         数据备份导出/导入
```

同步协议：客户端本地变更写入 `变更队列`（带 updated_at），定期 `POST /api/progress/sync` 批量提交；服务端返回冲突记录，按时间戳后写覆盖。

### E.5 数据管道

| 管道 | 方向 | 实现 |
|:---|:---|:---|
| 内容管道 | 一次性 | Python 迁移脚本：读现有 JS/JSON 内容 → 清洗校验 → 批量入库（带 version） |
| 同步管道 | 双向增量 | 客户端变更队列 → sync API → 服务端事务写入 + 返回游标 |
| 备份管道 | 每日定时 | cron + pg_dump → COS 对象存储，保留 30 天 |
| （预留）AI 内容管道 | 单向 | LLM 生成新词汇/例句 → 人工审核 → 入库，版本化发布 |

### E.6 上线实施路线（在本地 MVP 完成后进行）

```
S1 后端骨架     FastAPI 项目 + 数据库表 + Alembic 迁移 + JWT 认证
S2 同步引擎     内容/进度/打卡/计划 四组 API + 同步协议实现
S3 前端接入     Repository 层新增 RemoteAdapter，Local-first 双写
S4 内容迁移     迁移脚本 + learning_items 全量入库 + API 分发
S5 部署上线     前端 COS+CDN、后端 Docker、域名备案、HTTPS、备份 cron
S6 验证压测     多设备同步、离线可用、打卡点亮、备份恢复演练
```

### E.7 成本估算（小范围公开，腾讯云）

| 项 | 配置 | 月成本（约） |
|:---|:---|:---|
| 轻量服务器 | 2C2G（API + 可选 DB） | ¥50-80 |
| 云数据库 PostgreSQL | 最小规格 | ¥0-100（可先用服务器内 Docker 省钱） |
| COS + CDN | 静态资源 + 备份，流量很小 | ¥10-30 |
| 域名 + 备案 | .com 年费 | ¥70/年 |
| **合计** | | **约 ¥70-210/月** |

### E.8 风险与注意

1. **备案**：腾讯云国内托管需 ICP 备案（1-2 周），提前准备域名与材料；急用可先海外方案过渡
2. **数据安全**：JWT 密钥环境变量管理、密码 bcrypt、SQL 参数化；导出/导入接口限流
3. **同步冲突**：学习场景 LWW 足够；打卡为不可逆操作，冲突以"已打卡"优先
4. **迁移兼容**：localStorage 已有数据在首次登录后引导导入云端，避免丢数据
