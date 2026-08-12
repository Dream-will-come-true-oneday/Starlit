/**
 * L1 日常生活（A1-A2）其他知识库
 * 字段：detail 详细讲解 | tips 学习技巧 | recommend 资源推荐（可选）
 */
export default [
  {
    id: 'extra-l1-001', type: 'extra', level: 1, category: 'numbers',
    content: '钟点表达：整点与半点',
    meaning: '用英语报时间的两种方式',
    detail: '整点用 o\'clock（eight o\'clock）；半点用 half past（half past seven = 7:30）；一刻钟用 a quarter past/to（a quarter past six = 6:15）。',
    example: 'It is half past seven in the morning.',
    exampleCn: '现在是早上七点半。',
    tips: ['先说分钟再说小时（past 表示过了，to 表示还差）', '口语中 8:05 也可直接说 eight oh five'],
    recommend: { type: 'video', name: 'English with Lucy - Time', desc: '英国老师手把手教报时间，语速友好', link: 'https://www.youtube.com/@EnglishwithLucy' }
  },
  {
    id: 'extra-l1-002', type: 'extra', level: 1, category: 'numbers',
    content: '日期表达：月日年顺序',
    meaning: '英式/美式日期写法差异',
    detail: '美式：Month Day, Year（August 12, 2026）；英式：Day Month Year（12 August 2026）。口语常说 the twelfth of August。',
    example: 'My birthday is on August 12th.',
    exampleCn: '我的生日是8月12日。',
    tips: ['月份介词用 on（on Monday / on August 12th）', '年份读法按两位一组：2026 读 twenty twenty-six'],
    recommend: { type: 'reading', name: 'BBC Learning English', desc: '免费系统课程，语法与日常表达兼顾', link: 'https://www.bbc.co.uk/learningenglish' }
  },
  {
    id: 'extra-l1-003', type: 'extra', level: 1, category: 'numbers',
    content: '电话号码朗读',
    meaning: '数字逐位报读规则',
    detail: '电话号码按数字逐个读：0 读 oh 或 zero；连续相同数字可读 double（double four = 44）；区号后稍作停顿。',
    example: 'My number is oh-eight-six, one-three-eight, double-five, oh-nine.',
    exampleCn: '我的号码是 086-138-5509。',
    tips: ['三位一组停顿，方便对方记录', '0 在号码中多数读 oh'],
    recommend: { type: 'video', name: 'Peppa Pig（英文版）', desc: '超慢速生活英语，适合磨耳朵建立语感', link: '' }
  },
  {
    id: 'extra-l1-004', type: 'extra', level: 1, category: 'contraction',
    content: '缩略语：I\'m / don\'t / can\'t',
    meaning: '口语中最常用的缩略形式',
    detail: 'I am → I\'m；do not → don\'t；cannot → can\'t；will not → won\'t（特殊）；is not → isn\'t。缩略语只用于口语和随意文体，正式写作避免。',
    example: 'I\'m sorry, I can\'t come tonight.',
    exampleCn: '对不起，我今晚来不了。',
    tips: ['won\'t 是 will not 的不规则缩略，最容易拼错', '缩写撇号位置固定：don\'t 不是 dont'],
    recommend: { type: 'podcast', name: 'BBC 6 Minute English', desc: '每期6分钟聊一个话题，语速适中', link: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' }
  },
  {
    id: 'extra-l1-005', type: 'extra', level: 1, category: 'contraction',
    content: '缩略语：let\'s / it\'s / you\'re',
    meaning: '常用缩略与易混淆点',
    detail: 'let us → let\'s（让我们）；it is → it\'s；you are → you\'re；they are → they\'re。注意 it\'s（它是）与 its（它的）极易混淆：无撇号的 its 是物主代词。',
    example: 'Let\'s go. It\'s getting late.',
    exampleCn: '我们走吧，天要黑了。',
    tips: ['区分 it\'s 和 its：能换成 it is 的就是 it\'s', 'your 与 you\'re 同理：能换成 you are 的就是 you\'re'],
    recommend: { type: 'video', name: 'EnglishClass101', desc: '场景化短视频教学，覆盖生活高频话题', link: '' }
  },
  {
    id: 'extra-l1-006', type: 'extra', level: 1, category: 'politeness',
    content: '礼貌请求：Could you...?',
    meaning: '比 Can you 更礼貌的请求方式',
    detail: 'Could you please...? 比 Can you...? 更委婉，用于陌生人或正式场合；答语常用 Sure / Of course / No problem。',
    example: 'Could you please help me carry this box?',
    exampleCn: '你能帮我搬一下这个箱子吗？',
    tips: ['please 可放句尾，更口语化', '拒绝时说 I\'m afraid I can\'t 比直接 No 礼貌'],
    recommend: { type: 'reading', name: 'English with Lucy', desc: '地道表达系列，教你说得自然', link: 'https://www.youtube.com/@EnglishwithLucy' }
  },
  {
    id: 'extra-l1-007', type: 'extra', level: 1, category: 'politeness',
    content: '感谢与回应',
    meaning: '感谢的多种说法',
    detail: 'Thanks（随便）、Thank you（通用）、Thanks a lot（热情）、I really appreciate it（正式）。回应：You\'re welcome（不客气）、No problem、Anytime。',
    example: 'A: Thanks so much for the ride. B: No problem!',
    exampleCn: 'A：太感谢你载我一程了。B：没问题！',
    tips: ['对长辈/客户用 Thank you 或 I appreciate it', 'My pleasure 是服务业标准回应'],
    recommend: { type: 'reading', name: '日常英语积累', desc: '每次对话后记录自己用到的表达，建立个人语料库', link: '' }
  },
  {
    id: 'extra-l1-008', type: 'extra', level: 1, category: 'politeness',
    content: '道歉与回应',
    meaning: '道歉的程度分级',
    detail: '轻：Oops / My bad；中：I\'m sorry；正式：I apologize / I do apologize。回应：That\'s OK / It happens / No worries（没关系，别担心）。',
    example: 'I\'m sorry I\'m late. — It happens, don\'t worry.',
    exampleCn: '对不起我迟到了。——常有的事，别担心。',
    tips: ['apologize 是动词，apology 是名词', '正式场合多说 I apologize for...'],
    recommend: { type: 'podcast', name: 'BBC 6 Minute English', desc: '训练听力同时积累地道表达', link: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' }
  },
  {
    id: 'extra-l1-009', type: 'extra', level: 1, category: 'daily',
    content: '问路与方向',
    meaning: '问路/指路的实用句型',
    detail: '问：Excuse me, how do I get to...? / Where is the nearest...? 答：Go straight（直走）、Turn left/right（左右转）、It\'s on your left（在你的左边）。',
    example: 'Excuse me, how do I get to the station?',
    exampleCn: '请问去车站怎么走？',
    tips: ['Excuse me 开头礼貌打断', '听不懂可说 Could you say that again, please?'],
    recommend: { type: 'video', name: '日常出行场景', desc: '在影视剧里观察问路片段，模仿语气', link: '' }
  },
  {
    id: 'extra-l1-010', type: 'extra', level: 1, category: 'daily',
    content: '超市购物：价格与结账',
    meaning: '询问价格与结账用语',
    detail: '问价：How much is this? / What\'s the price? 结账：I\'d like to pay by card.（刷卡）/ Could I have a receipt?（要小票）。',
    example: 'How much is this bag of rice?',
    exampleCn: '这袋米多少钱？',
    tips: ['Cash or card? 是收银员常问的', 'bargain 是讨价还价'],
    recommend: { type: 'reading', name: '购物场景清单', desc: '把超市高频词列成清单反复看', link: '' }
  },
  {
    id: 'extra-l1-011', type: 'extra', level: 1, category: 'daily',
    content: '餐厅点餐',
    meaning: '点餐与结账流程',
    detail: '看菜单：Could I see the menu? 点餐：I\'d like... / I\'ll have... 结账：Could we have the bill, please?（请结账）。',
    example: 'I\'d like a coffee and a sandwich, please.',
    exampleCn: '我想要一杯咖啡和一个三明治。',
    tips: ['I\'d like 比 I want 礼貌得多', '买单时做"写账单"手势并说 Check, please 也通用'],
    recommend: { type: 'video', name: '餐厅点餐实拍', desc: '看服务生与顾客的完整对话流程', link: '' }
  },
  {
    id: 'extra-l1-012', type: 'extra', level: 1, category: 'daily',
    content: '天气描述',
    meaning: '谈论天气的高频表达',
    detail: 'It\'s sunny/rainy/cloudy/windy（晴天/雨天/多云/风大）；It\'s raining hard（雨下得大）；What\'s the weather like?（天气怎么样？）。',
    example: 'It\'s sunny but a bit windy today.',
    exampleCn: '今天晴但有风。',
    tips: ['天气话题是英语社交的万能开场白', '注意形容词：rainy 是形容词，rain 是动词/名词'],
    recommend: { type: 'podcast', name: '英语儿歌/天气主题', desc: '轻松输入天气相关词汇', link: '' }
  }
]
