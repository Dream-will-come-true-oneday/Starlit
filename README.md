# Starlit · 星记

> 一款以**艾宾浩斯记忆曲线**为核心的英语学习应用——从日常对话一路进阶到经济、IT 等专业领域。每天学一点，按时复盘，让知识真正长在你的脑子里。

当前界面采用「星际控制台」视觉系统：深墨黑背景、细网格结构、冷白文字、青绿色信号色与琥珀状态色，强调长期学习时的扫描效率和状态反馈。

[English description below](#english)

---

## 项目简介

Starlit（星记）把"学什么"和"怎么不忘"两件事拧成一条路：

- **学什么**：单词、短语、语法、实用知识四大模块，按 **L1 日常 → L2 社交 → L3 职场 → L4 经济 → L5 IT** 五级难度递进，覆盖日常交流到专业领域。
- **怎么不忘**：每学完一个知识点，自动生成 6 个复习节点（第 1/2/4/7/15/30 天）。到期打卡 = 点亮，逾期未打卡 = 熄灭。一张记忆曲线图，把"记得住"这件事可视化。

整个应用**本地优先（offline-first）**：学习数据先写本地，断网也能学，联网后自动同步云端，换设备不丢进度。

---

## ✨ 核心特性

- **四大学习模块**
  - 单词（220 条，翻转卡，含音标/例句）
  - 短语（135 条，含真实语境例句）
  - 语法（54 条，规则 + 结构公式 + 例句）
  - 实用知识（60 条，数字时间、缩写、易混词、职场/经济/IT 黑话 + 学习资源推荐）
- **记忆曲线复盘**：每个知识点一张 SVG 曲线图，6 个复习节点，打卡点亮 / 逾期熄灭；节点可直接点击打卡或取消（误操作可恢复）
- **分模块独立难度**：单词 / 短语 / 语法 / 实用知识各自 L1-L5 独立推进，可自选起点——词汇量够就跳过前面等级，生疏的模块从头学起
- **等级可前进也可回退**：切换到较低等级不会删除高等级的已学记录、记忆曲线或复盘记录；返回某等级时，会定位到该等级第一个未学内容，方便保留原进度继续学习
- **学习规划视图**：时间线展示过去 / 今天 / 未来每日内容，含「每日句子」
- **仪表盘**：今日新学 + 待复盘、连续打卡天数、四模块进度、四模块难度总览
- **复盘中心**：今日到期优先 + 逾期回顾 + 每项完整曲线可补卡
- **AI 对话练习**：围绕当天内容生成场景，支持文字 / 浏览器语音输入，结束后生成薄弱点、优势和改进建议报告
- **数据可备份**：导出 / 导入 / 重置，刷新不丢
- **账号与跨设备同步**：邮箱注册登录（JWT），进度云端同步（后端 API 已就绪）

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────┐
│  前端（Vue 3 SPA）                            │
│  Vue 3 + Vite 5 + Pinia + Vue Router 4        │
│  Lucide 图标 + 原生 CSS（星际控制台视觉系统）  │
│  学习数据 → localStorage（离线优先）           │
│  同步引擎 → src/api/{client,sync}.js          │
└───────────────┬─────────────────────────────┘
                │  HTTPS（JWT）
┌───────────────▼─────────────────────────────┐
│  后端（FastAPI）                              │
│  FastAPI + SQLAlchemy 2.0 + Pydantic v2       │
│  认证 JWT + bcrypt · SQLite(本地) / PG(生产)   │
└───────────────┬─────────────────────────────┘
                │
        ┌───────▼────────┐
        │   PostgreSQL 16 │  （生产；本地默认 SQLite）
        └────────────────┘
```

| 层 | 技术栈 | 说明 |
|:---|:---|:---|
| 前端 | Vue 3 / Vite 5 / Pinia / Vue Router 4 | 纯静态，可托管到 COS+CDN |
| 持久化（本地） | localStorage | 离线可用，刷新不丢 |
| 后端 | FastAPI / SQLAlchemy 2.0 / Pydantic v2 | 同步 / 打卡 / 内容 API |
| 安全 | JWT（HS256）+ bcrypt | 注册登录与跨设备同步 |
| 数据库 | SQLite（开发）/ PostgreSQL 16（生产） | 通过环境变量切换 |

---

## 📁 目录结构

```
.
├── index.html
├── package.json                 # 前端依赖与脚本
├── vite.config.js
├── src/
│   ├── api/                     # 后端对接：client.js + sync.js（本地优先同步）
│   ├── components/
│   │   ├── common/              # MemoryCurveChart / ReviewCheckIn / DayCard ...
│   │   ├── word/  phrase/  grammar/  extra/
│   ├── composables/             # useMemoryCurve（曲线算法）/ useDailyPlan
│   ├── data/                    # 内容库：words/ phrases/ grammar/ extra/ sentences/（L1-L5）
│   ├── repositories/            # localStorage 封装
│   ├── stores/                  # Pinia：progress / review / plan / module
│   ├── views/                   # Dashboard / PlanView / Word·Phrase·Grammar·Extra / ReviewCenter
│   └── router/                  # Hash 路由：今日 / 规划 / 四个模块 / 复盘 / 练习
├── scripts/
│   └── export-content.mjs       # 把前端内容库导出为 JSON（供后端迁移）
└── backend/
    ├── app/                     # FastAPI：routers / models / security / config
    ├── data/content-export.json# 迁移数据（由 export-content.mjs 生成）
    ├── migrate_content.py       # 内容入库脚本
    ├── requirements.txt
    ├── Dockerfile / docker-compose.yml
    └── .env.example
```

---

## 🚀 快速开始（本地开发）

### 1. 前端

```bash
npm install
npm run dev        # http://localhost:5173
```

构建生产包并本地预览：

```bash
npm run build
npm run preview    # 默认 http://localhost:4173
```

### 2. 后端（可选，用于体验账号与同步）

要求 **Python 3.11+**。

```bash
cd backend
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 回到项目根目录，导出内容库为 JSON
cd ..
node scripts/export-content.mjs                        # 生成 backend/data/content-export.json

# 导入内容并启动 API（本地默认 SQLite）
cd backend
python migrate_content.py
uvicorn app.main:app --reload --port 8000             # http://localhost:8000/docs
```

健康检查：`GET /api/health` → `{"status":"ok","service":"Starlit API"}`

> 不接后端也能完整体验前端（数据存 localStorage）。后端提供账号注册、登录与跨设备同步能力。

---

## 🧭 页面与学习流程

| 路由 | 页面 | 主要用途 |
|:---|:---|:---|
| `#/` | 今日学习 | 查看今日新学、待复盘、连续打卡和四模块进度 |
| `#/plan` | 学习规划 | 按日期浏览每日学习内容和完成率 |
| `#/words` | 单词 | 学习词汇、查看已学列表和记忆曲线 |
| `#/phrases` | 短语 | 学习真实语境短语 |
| `#/grammar` | 语法 | 学习规则、结构公式和例句 |
| `#/extra` | 其他知识 | 学习缩写、易混词和领域表达 |
| `#/review` | 复盘中心 | 处理今日到期和逾期复习项 |
| `#/practice` | AI 对话练习 | 用当天学习内容进行对话并生成报告 |

四个学习模块分别维护自己的等级指针。点击模块页的等级标签可以调整起点：

- 切换到更高等级：从该等级开始学习，前面等级的内容不会挤占当前计划。
- 切换回较低等级：已学记录、复盘节点和记忆曲线全部保留；系统会从该等级第一个未学项目继续。

## 🧠 记忆曲线机制

每个知识点学完后，按艾宾浩斯遗忘规律生成 **6 个复习节点**：

| 节点 | 第 1 次 | 第 2 次 | 第 3 次 | 第 4 次 | 第 5 次 | 第 6 次 |
|:---|:---|:---|:---|:---|:---|:---|
| 间隔（天） | 1 | 2 | 4 | 7 | 15 | 30 |
| 状态 | 待打卡 → 点亮 ✓ | 待打卡 → 点亮 ✓ | … | … | … | … |

- **点亮**：在节点当日（或之前）完成打卡，该节点变为已掌握。
- **熄灭**：超过节点日期仍未打卡，视为遗忘，节点熄灭。
- **可撤销**：误点击亮后，再点一次节点即可取消，不会卡死在"已点亮"。
- 全部 6 个节点点亮即标记为「已掌握」。

记忆曲线图用 SVG 实时绘制，直观展示「记得住」的进度。各模块的等级互不影响：学单词到 L3 的同时，短语仍可从 L1 开始。

---

## 🔄 数据同步设计（Local-first）

前端默认把数据写入本地，联网时再同步到云端：

1. **本地操作** → 写入 localStorage（离线可用）
2. **增量上传** → `POST /api/progress/sync`（带 `updated_at`，已打卡状态优先，避免冲突丢失）
3. **换设备拉取** → `GET /api/progress/snapshot`（首登全量合并）

后端 API 清单：

| 方法 | 路径 | 说明 |
|:---|:---|:---|
| POST | `/api/auth/register` `/api/auth/login` | 注册 / 登录（JWT） |
| GET | `/api/items?type=word&level=1` | 内容查询（只读） |
| POST | `/api/progress/sync` | 进度增量同步 |
| GET | `/api/progress/snapshot` | 全量拉取（换设备） |
| POST | `/api/reviews/{item_key}/checkin` | 复习打卡 |
| GET | `/api/plans/daily?date=2026-08-12` | 每日计划 |

完整交互式文档见 `http://localhost:8000/docs`（Swagger）。

---

## 📦 部署上线

部署相关（备案、COS+CDN、Docker 编排、Nginx HTTPS、备份）已单独整理在 **[DEPLOYMENT.md](./DEPLOYMENT.md)**，按步骤操作即可，无需写代码。

摘要：

```bash
# 构建前端
npm run build                      # 产出 dist/ → 上传 COS + CDN

# 部署后端（服务器）
cd backend && cp .env.example .env   # 填 SECRET_KEY / CORS_ORIGINS
docker compose up -d --build          # 自动建表 + 导入内容 + 启动 API
```

---

## 📌 内容规模

| 模块 | 数量 | 分级 |
|:---|:---|:---|
| 单词 | 220 | L1-L5 |
| 短语 | 135 | L1-L5 |
| 语法 | 54 | L1-L5 |
| 实用知识 | 60 | L1-L5 |
| **合计** | **469** | 迁移脚本一次性入库 |

---

## 🗺️ Roadmap

- **每日对话练习（已完成）**：按当天学习内容生成对话场景，与 AI 进行文字或浏览器语音对话，结束后生成薄弱点 / 优势 / 学习建议报告
- **发音评估**：接入云端语音识别后，增加发音准确度评估
- **内容扩充**：继续扩充单词 / 短语 / 语法 / 实用知识库

完整变更记录见 [CHANGELOG.md](./CHANGELOG.md)。

---

## 🐛 已修复 Bug 清单

> 2026-08-12 集中联调期发现并修复的问题，留档备查。

| 问题 | 根因 | 修复 |
|:---|:---|:---|
| 学习规划视图每天内容完全相同 | `generatePlanRange` 未按日期差平移内容指针，所有日期从同一位置切片 | 以"今天"为基准按天数差平移四模块指针 |
| 规划视图单词/短语为空 | 数据键是复数 `words/phrases`，调用方传单数 `word/phrase` 映射失败 | `getItemsByType` 增加单复数映射 `TYPE_KEY_MAP` |
| 学满一级后计划变空 | `contentIndex` 为跨等级累积指针，却在单等级列表内切片；等级推进逻辑未被调用 | 计划改从跨等级合并列表取内容（L1→L5 连续流），等级自动同步 |
| 记忆曲线图右侧文字截断（如"第30天/09/17"） | SVG 左右边距只有 10px，最右节点文字超出 viewBox 被裁剪 | 边距 10px → 24px |
| 误点亮后无法取消打卡 | 缺少 `unCheckIn`，已完成节点按钮被 `disabled` | 新增 `unCheckIn` 全链路；曲线节点点击可取消，今日面板加"取消"链接 |
| 对话练习 AI 回复为空（空气泡） | DeepSeek v4 为推理模型，`max_tokens` 不足时思考占满 token、`content` 为空 | `max_tokens` 统一提至 20 万（仅上限，按实际输出计费）；`content` 为空自动重试一次 |
| 对话练习 AI 复读开场白/用户发言 | 前端用户消息在 `history` 与 `user_text` 双传；后端开场白从 `scenario` 与 `history` 双塞 | 前端 `sendTurn` 传 `slice(0,-1)`；后端仅当 `history` 为空时兜底开场白 |
| `[REPLY]/[HINT]` 解析残留标记 | 无 `[HINT]` 时 `[REPLY]` 标记未剥离（单测发现） | `parse_reply_hint` 统一先剥 `[HINT]` 再剥 `[REPLY]` |
| 后端本地启动报错（开发期） | passlib 1.7.4 与 bcrypt 4.x 不兼容；Python 3.13 下 pydantic-core 需 Rust 编译 | 改用 bcrypt 官方库；升级 pydantic 至 3.13 兼容版本 |
| 同步快照返回数字 id 而非 item_key | snapshot 接口映射错误 | 修复 item_key 映射 |

---

## 🤝 贡献

欢迎提 Issue 与 PR。内容库（单词/短语/语法/实用知识）均以纯数据文件存放在 `src/data/`，新增或修正内容无需改动逻辑代码，导出后通过迁移脚本入库即可。

---

## 📄 License

本项目目前用于学习与演示，License 待定。如需商用请先联系作者。

---

## English

**Starlit (星记)** is an English-learning app built around the **Ebbinghaus memory curve**. It guides learners from everyday conversation up to professional domains (economics, IT, etc.) across four modules — *words, phrases, grammar, and practical knowledge* — organized into five difficulty levels (L1–L5).

Every item you learn automatically spawns 6 spaced-repetition checkpoints (days 1/2/4/7/15/30). Check in on time → the node lights up; miss it → it goes dark; click again to undo. A live SVG memory curve makes "actually remembering" visible. Each module has its **own independent difficulty level**, so you can start words at L3 while keeping phrases at L1 — no forced global progression.

- **Frontend**: Vue 3 + Vite 5 + Pinia, offline-first (localStorage).
- **Backend**: FastAPI + SQLAlchemy 2.0, JWT auth, SQLite (dev) / PostgreSQL (prod).
- **Sync**: local-first — local writes sync to cloud on connect, so progress survives device switches.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment, and `http://localhost:8000/docs` for the API reference.
