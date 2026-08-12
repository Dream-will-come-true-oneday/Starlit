/**
 * L5 IT科技（C1-C2）其他知识库
 */
export default [
  {
    id: 'extra-l5-001', type: 'extra', level: 5, category: 'it-jargon',
    content: 'IT 黑话：CI / CD / DevOps',
    meaning: '开发运维核心概念',
    detail: 'CI = 持续集成（continuous integration，代码频繁合并并自动测试）；CD = 持续交付/部署（continuous delivery/deployment）；DevOps = 开发+运维一体化文化。',
    example: 'Our team adopted CI/CD, cutting release time from weeks to hours.',
    exampleCn: '我们团队采用 CI/CD，把发布周期从几周缩短到几小时。',
    tips: ['CI 关注"自动构建测试"，CD 关注"自动发布"', 'DevOps 是文化+工具链，不只是职位'],
    recommend: { type: 'podcast', name: 'Syntax（Web 开发播客）', desc: '前端全栈双主播，聊技术接地气', link: 'https://syntax.fm' }
  },
  {
    id: 'extra-l5-002', type: 'extra', level: 5, category: 'it-jargon',
    content: 'IT 黑话：K8s / 容器 / 微服务',
    meaning: '容器编排与架构',
    detail: 'K8s = Kubernetes（容器编排平台）；container = 容器（轻量虚拟化，如 Docker）；microservices = 微服务（小服务独立部署）；monolith = 单体应用。',
    example: 'We run our microservices on Kubernetes for automatic scaling.',
    exampleCn: '我们在 Kubernetes 上运行微服务以实现自动扩缩容。',
    tips: ['读 K8s 为 "kay-eights"，不读字母拼写', '演进路径：单体 → 模块化 → 微服务'],
    recommend: { type: 'reading', name: 'Martin Fowler 博客', desc: '架构与代码质量权威，英文精炼', link: 'https://martinfowler.com' }
  },
  {
    id: 'extra-l5-003', type: 'extra', level: 5, category: 'it-jargon',
    content: '云服务：SaaS / PaaS / IaaS',
    meaning: '云服务的三种模式',
    detail: 'SaaS = 软件即服务（直接用，如 Google Docs）；PaaS = 平台即服务（只管应用，如 Vercel）；IaaS = 基础设施即服务（只管硬件，如 AWS EC2）。',
    example: 'Serverless platforms are a form of PaaS with auto-scaling.',
    exampleCn: 'Serverless 平台是带自动扩缩容的一种 PaaS。',
    tips: ['从 IaaS 到 SaaS：用户操心的事越来越少', 'Serverless 免运维但要注意冷启动'],
    recommend: { type: 'podcast', name: 'Syntax', desc: '云服务专题集讲得通俗', link: 'https://syntax.fm' }
  },
  {
    id: 'extra-l5-004', type: 'extra', level: 5, category: 'tech-writing',
    content: '技术写作：It is worth noting that...',
    meaning: '论文与文档的强调句式',
    detail: '表达"值得注意的是"：It is worth noting that... / Notably, ... / A key takeaway is... 用于引出重要结论或提醒读者。',
    example: 'It is worth noting that the new algorithm reduces latency by 40%.',
    exampleCn: '值得注意的是，新算法将延迟降低了 40%。',
    tips: ['正式文档避免 I think，用客观句式', 'key takeaway = 核心要点，文档结尾常用'],
    recommend: { type: 'reading', name: '技术文档写作指南', desc: '学习专业措辞与结构', link: '' }
  },
  {
    id: 'extra-l5-005', type: 'extra', level: 5, category: 'tech-writing',
    content: '技术写作：This paper proposes...',
    meaning: '学术/技术论文常用开头',
    detail: '论文框架动词：propose（提出）、investigate（研究）、demonstrate（证明）、evaluate（评估）。开头：This paper proposes a framework for...',
    example: 'This paper proposes a lightweight framework for edge computing.',
    exampleCn: '本文提出了一种用于边缘计算的轻量框架。',
    tips: ['propose 表"提出方案"，比 suggest 正式', 'evaluate vs assess：都表评估，可互换'],
    recommend: { type: 'reading', name: 'arXiv 论文精读', desc: '读论文学学术表达', link: 'https://arxiv.org' }
  },
  {
    id: 'extra-l5-006', type: 'extra', level: 5, category: 'it-jargon',
    content: '数据工程：管道与湖仓',
    meaning: 'pipeline / data lake / warehouse',
    detail: 'data pipeline = 数据管道（ETL 流程）；data lake = 数据湖（存原始数据）；data warehouse = 数据仓库（存结构化分析数据）；ETL = 抽取-转换-加载。',
    example: 'The data pipeline transforms raw logs into a clean warehouse.',
    exampleCn: '数据管道把原始日志转换成干净的仓库数据。',
    tips: ['湖存原始，仓存分析，管道做搬运', 'ETL 与 ELT 顺序不同，架构选择不同'],
    recommend: { type: 'podcast', name: 'Data Engineering 播客', desc: '数据工程实战分享', link: '' }
  },
  {
    id: 'extra-l5-007', type: 'extra', level: 5, category: 'geek-culture',
    content: '极客文化：Stack Overflow',
    meaning: '程序员提问的正确姿势',
    detail: '提问前先搜（已经有人问过）；提问用 MCVE（最小可复现示例）；描述：What I tried + What happened + What I expected；获赞礼貌回复：Thanks, that solved it!',
    example: 'Here is my minimal reproduction case, and the error message...',
    exampleCn: '这是我的最小复现案例和报错信息……',
    tips: ['回答问题也是学习：帮人排查=巩固知识', 'Google 错误信息原文，比问人快'],
    recommend: { type: 'reading', name: 'Stack Overflow', desc: '全球最大技术问答社区', link: 'https://stackoverflow.com' }
  },
  {
    id: 'extra-l5-008', type: 'extra', level: 5, category: 'geek-culture',
    content: '极客文化：GitHub 使用习惯',
    meaning: '开源协作与个人品牌',
    detail: '核心动作：clone（克隆）/ fork（复制）/ pull request（PR，提交合并）/ issue（问题）。写 README、贡献开源项目能显著提升技术简历。',
    example: 'I submitted a pull request to fix the documentation.',
    exampleCn: '我提交了一个修复文档的 PR。',
    tips: ['看别人代码 = 最好的学习资料', '自己的项目记得写 README 和 License'],
    recommend: { type: 'reading', name: 'GitHub', desc: '逛 trending 发现好项目', link: 'https://github.com' }
  },
  {
    id: 'extra-l5-009', type: 'extra', level: 5, category: 'geek-culture',
    content: '极客文化：Hacker News',
    meaning: '科技圈的信息前线',
    detail: 'Hacker News（news.ycombinator.com）是硅谷科技人必刷社区，讨论技术、创业与趋势。每天 30 分钟扫标题，掌握科技圈语感与热点。',
    example: 'The HN thread about AI agents has over 500 comments.',
    exampleCn: 'Hacker News 上关于 AI 智能体的讨论帖有 500 多条评论。',
    tips: ['评论区的深度讨论比标题更有价值', '按 Show HN 标签看新项目'],
    recommend: { type: 'reading', name: 'Hacker News', desc: '科技创业者聚集地', link: 'https://news.ycombinator.com' }
  },
  {
    id: 'extra-l5-010', type: 'extra', level: 5, category: 'tech-writing',
    content: '代码注释与文档语气',
    meaning: '写给人看的注释',
    detail: '注释解释"为什么"而非"是什么"：// retry with backoff because the API rate-limits（重试退避，因为接口限流）。commit message 用祈使句：Fix typo in login page。',
    example: '# Use a cache here to avoid hitting the DB on every request',
    exampleCn: '# 这里用缓存，避免每次请求都打数据库',
    tips: ['好注释=读代码的人不需要问你', 'commit 用动词开头：Add/Fix/Refactor/Remove'],
    recommend: { type: 'reading', name: '代码规范文档', desc: '团队约定注释与命名', link: '' }
  },
  {
    id: 'extra-l5-011', type: 'extra', level: 5, category: 'tech-writing',
    content: '会议英语：stand-up 站会',
    meaning: '敏捷开发每日站会怎么讲',
    detail: '三句话模板：Yesterday I worked on... / Today I\'m going to work on... / I\'m blocked by...（我遇到了阻碍）。blocker 是站会高频词，及时求助不丢人。',
    example: 'I finished the API yesterday. Today I\'ll write tests. I\'m blocked on the database access.',
    exampleCn: '昨天完成了接口。今天写测试。数据库权限还没拿到，是个阻碍。',
    tips: ['站会只说进展与阻碍，不做技术讨论', 'I\'m blocked 是请同事支援的信号'],
    recommend: { type: 'podcast', name: 'The Changelog', desc: '开源与技术文化深度对谈', link: 'https://changelog.com' }
  },
  {
    id: 'extra-l5-012', type: 'extra', level: 5, category: 'it-jargon',
    content: '安全术语：漏洞与攻击',
    meaning: 'vulnerability / breach / DDoS',
    detail: 'vulnerability = 漏洞（如 SQL injection 注入）；data breach = 数据泄露；DDoS = 分布式拒绝服务攻击；patch = 补丁；zero-day = 零日漏洞（未修补）。',
    example: 'The zero-day vulnerability was patched within 24 hours.',
    exampleCn: '这个零日漏洞在 24 小时内得到了修补。',
    tips: ['安全新闻高频：breach 泄露、patch 补丁', 'OWASP Top 10 是入门必读清单'],
    recommend: { type: 'reading', name: 'OWASP', desc: 'Web 安全权威指南', link: 'https://owasp.org' }
  }
]
