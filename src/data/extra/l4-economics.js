/**
 * L4 经济金融（B2-C1）其他知识库
 */
export default [
  {
    id: 'extra-l4-001', type: 'extra', level: 4, category: 'economics',
    content: '宏观术语：CPI / PPI / PMI',
    meaning: '三大经济指标',
    detail: 'CPI（居民消费价格指数）衡量通胀；PPI（生产者价格指数）衡量出厂价；PMI（采购经理指数）>50 表示制造业扩张。财经新闻里最高频的三个缩写。',
    example: 'The CPI rose 2.4% year on year, signaling mild inflation.',
    exampleCn: 'CPI 同比上涨 2.4%，显示温和通胀。',
    tips: ['解读逻辑：CPI 涨→通胀→央行可能加息', 'PMI 是经济"晴雨表"，连续 3 个月>50 算扩张'],
    recommend: { type: 'reading', name: 'The Economist', desc: '全球顶级财经周刊，语言精炼地道', link: 'https://www.economist.com' }
  },
  {
    id: 'extra-l4-002', type: 'extra', level: 4, category: 'economics',
    content: '宏观术语：滞胀与衰退',
    meaning: 'stagflation / recession',
    detail: 'stagflation = 滞胀（通胀高 + 增长停滞，最棘手的局面）；recession = 衰退（GDP 连续两季负增长）；depression = 大萧条；recovery = 复苏。',
    example: 'Rising prices with slow growth is a classic sign of stagflation.',
    exampleCn: '物价上涨伴随增长缓慢是典型的滞胀信号。',
    tips: ['衰退顺序：slowdown(放缓) → recession(衰退) → depression(萧条)', 'soft landing 软着陆=避免衰退的减速'],
    recommend: { type: 'podcast', name: 'Planet Money（NPR）', desc: '用生活故事讲透经济学，语速清晰', link: 'https://www.npr.org/podcasts/510289/planet-money' }
  },
  {
    id: 'extra-l4-003', type: 'extra', level: 4, category: 'economics',
    content: '央行工具：加息与量化宽松',
    meaning: 'rate hike / quantitative easing',
    detail: 'rate hike = 加息（央行提高利率抑制通胀）；rate cut = 降息；QE（quantitative easing）= 量化宽松（央行购债放水）；tightening 紧缩 / loosening 宽松。',
    example: 'The central bank announced another rate hike to cool inflation.',
    exampleCn: '央行宣布再次加息以给通胀降温。',
    tips: ['加息→借贷成本升→需求降→通胀降', 'QE 后常接 tapering（缩减购债）'],
    recommend: { type: 'reading', name: 'Financial Times', desc: '权威财经日报，政策解读专业', link: 'https://www.ft.com' }
  },
  {
    id: 'extra-l4-004', type: 'extra', level: 4, category: 'finance',
    content: '财务缩写：ROI / EBITDA / EPS',
    meaning: '公司财报必懂指标',
    detail: 'ROI = 投资回报率（return on investment）；EBITDA = 税息折旧及摊销前利润（衡量核心盈利）；EPS = 每股收益（earnings per share，评估股价关键）。',
    example: 'The project\'s ROI exceeded 20%, and EPS grew 15%.',
    exampleCn: '项目投资回报率超过 20%，每股收益增长 15%。',
    tips: ['ROI 越高项目越值得投', 'EBITDA 高但净利润低，说明折旧/利息重'],
    recommend: { type: 'reading', name: '财报阅读入门', desc: '看懂三张表的框架', link: '' }
  },
  {
    id: 'extra-l4-005', type: 'extra', level: 4, category: 'finance',
    content: '融资缩写：IPO / VC / PE',
    meaning: '资本市场角色',
    detail: 'IPO = 首次公开募股（initial public offering，公司上市）；VC = 风险投资（venture capital，投早期）；PE = 私募股权（private equity，投成熟期）。',
    example: 'The startup went through three VC rounds before its IPO.',
    exampleCn: '这家初创公司在 IPO 前经历了三轮风投。',
    tips: ['VC 高风险高回报，PE 稳健', 'IPO 常用 go public / list 表示'],
    recommend: { type: 'podcast', name: '财经新闻播客', desc: '市场动态磨耳朵', link: '' }
  },
  {
    id: 'extra-l4-006', type: 'extra', level: 4, category: 'finance',
    content: '投资术语：ETF / 股息 / 组合',
    meaning: 'ETF / dividend / portfolio',
    detail: 'ETF（exchange-traded fund）= 交易所交易基金，一篮子资产分散风险；dividend = 股息（公司分红）；portfolio = 投资组合；diversification = 分散投资。',
    example: 'A diversified portfolio of ETFs is a low-cost way to invest.',
    exampleCn: '分散化的 ETF 组合是一种低成本投资方式。',
    tips: ['ETF 既有股票的流动性又有基金的分散性', 'dividend yield 股息率 = 每股股息÷股价'],
    recommend: { type: 'reading', name: 'WSJ 中文精选', desc: '中英对照积累术语', link: 'https://www.wsj.com' }
  },
  {
    id: 'extra-l4-007', type: 'extra', level: 4, category: 'reading',
    content: '精读法：财经新闻三段式',
    meaning: '高效读外刊的方法',
    detail: '第一遍速读抓主谓宾（谁+做了什么+结果）；第二遍精读数字与比较（同比/环比）；第三遍查生词回读。每天一篇坚持三个月，阅读量质变。',
    example: 'Headline → first paragraph (the 5W) → data & quotes → conclusion.',
    exampleCn: '标题 → 首段（五要素）→ 数据与引语 → 结论。',
    tips: ['先读标题+首段判断值不值得精读', '把学到的词放进自己的句子才算掌握'],
    recommend: { type: 'reading', name: 'The Economist Espresso', desc: '每日精华短读，适合碎片时间', link: '' }
  },
  {
    id: 'extra-l4-008', type: 'extra', level: 4, category: 'economics',
    content: '贸易术语：关税与顺差',
    meaning: 'tariff / trade surplus',
    detail: 'tariff = 关税（对进口商品征税）；trade surplus = 贸易顺差（出口>进口）；deficit = 逆差；protectionism = 保护主义；dumping = 倾销。',
    example: 'Higher tariffs could widen trade tensions between the two countries.',
    exampleCn: '更高关税可能加剧两国贸易紧张。',
    tips: ['顺差=surplus，逆差=deficit，一对反义词', 'trade war 贸易战是新闻高频词'],
    recommend: { type: 'podcast', name: 'Planet Money', desc: '把贸易讲成故事，好懂好记', link: 'https://www.npr.org/podcasts/510289/planet-money' }
  },
  {
    id: 'extra-l4-009', type: 'extra', level: 4, category: 'finance',
    content: '财报词汇：资产负债与现金流',
    meaning: 'balance sheet / cash flow',
    detail: 'balance sheet = 资产负债表（资产=负债+权益）；income statement = 利润表；cash flow = 现金流；asset 资产 / liability 负债 / equity 权益。',
    example: 'Strong cash flow is more important than book profits.',
    exampleCn: '强劲的现金流比账面利润更重要。',
    tips: ['三张表：资产负债表、利润表、现金流量表', '现金为王：公司可死于现金流断裂'],
    recommend: { type: 'reading', name: 'Investopedia', desc: '免费金融词典，术语权威', link: 'https://www.investopedia.com' }
  },
  {
    id: 'extra-l4-010', type: 'extra', level: 4, category: 'economics',
    content: '市场结构：垄断与寡头',
    meaning: 'monopoly / oligopoly',
    detail: 'monopoly = 垄断（一家独大）；oligopoly = 寡头（少数几家主导，如电信）；competition = 竞争；market share = 市场份额；antitrust = 反垄断。',
    example: 'The tech giants operate in an oligopoly with high barriers to entry.',
    exampleCn: '科技巨头在高准入门槛的寡头市场中运营。',
    tips: ['寡头市场常见价格默契', 'antitrust 监管是科技股新闻常客'],
    recommend: { type: 'podcast', name: '经济学人播客', desc: '全球议题深度分析', link: '' }
  },
  {
    id: 'extra-l4-011', type: 'extra', level: 4, category: 'reading',
    content: '外刊阅读：高频连接词',
    meaning: 'however/moreover/whereas 用法',
    detail: 'however（然而，转折）、moreover（此外，递进）、whereas（而，对比）、consequently（因此，因果）。掌握这四个词能读懂外刊大部分逻辑关系。',
    example: 'Sales rose in Asia; however, Europe saw a decline.',
    exampleCn: '亚洲销售额上升；然而欧洲出现下滑。',
    tips: ['however 用分号或句号连接，后接逗号', '对比找 whereas/while，因果找 therefore/consequently'],
    recommend: { type: 'reading', name: 'The Economist', desc: '精读时圈出连接词，理解论证骨架', link: 'https://www.economist.com' }
  },
  {
    id: 'extra-l4-012', type: 'extra', level: 4, category: 'economics',
    content: '经济周期：扩张与收缩',
    meaning: 'expansion / contraction',
    detail: '经济四阶段：expansion（扩张）→ peak（顶峰）→ contraction（收缩）→ trough（谷底）。bull market 牛市（涨），bear market 熊市（跌）。',
    example: 'We may be at the peak of the current business cycle.',
    exampleCn: '我们可能正处于当前商业周期的顶峰。',
    tips: ['周期理论用于判断大类资产配置', '顺周期/逆周期：cyclical / counter-cyclical'],
    recommend: { type: 'reading', name: '财经宏观报告', desc: '结合真实数据理解周期', link: '' }
  }
]
