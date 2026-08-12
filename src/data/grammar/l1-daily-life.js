/**
 * L1 日常生活（A1-A2）语法库
 * 字段：content 语法点 | meaning 简述 | structure 结构公式 | rule 规则 | example 例句 | exampleCn 翻译
 */
export default [
  {
    id: 'grammar-l1-001', type: 'grammar', level: 1, category: 'basic',
    content: 'be 动词现在时',
    meaning: 'am/is/are 表示"是"',
    structure: '主语 + am/is/are + 表语',
    rule: 'I 用 am，第三人称单数（he/she/it）用 is，其余（you/we/they）用 are。',
    example: 'I am a student. She is my teacher.',
    exampleCn: '我是一名学生。她是我的老师。'
  },
  {
    id: 'grammar-l1-002', type: 'grammar', level: 1, category: 'basic',
    content: '一般现在时',
    meaning: '表示习惯、常态或事实',
    structure: '主语 + 动词原形 / 第三人称单数',
    rule: '第三人称单数主语（he/she/it）动词加 -s/-es，其余用原形；否定用 don’t / doesn’t。',
    example: 'He gets up at seven. They do not live here.',
    exampleCn: '他七点起床。他们不住在这里。'
  },
  {
    id: 'grammar-l1-003', type: 'grammar', level: 1, category: 'basic',
    content: '人称代词与物主代词',
    meaning: 'I/my、you/your 等对应',
    structure: '主格做主语；物主代词 + 名词',
    rule: '主格做主语（I, you, he），物主代词修饰名词（my, your, his）；注意 its 无撇号。',
    example: 'This is my book. It is interesting.',
    exampleCn: '这是我的书。它很有趣。'
  },
  {
    id: 'grammar-l1-004', type: 'grammar', level: 1, category: 'basic',
    content: '可数 / 不可数名词',
    meaning: '名词的类别与单复数',
    structure: '可数：a/an + 单数，复数 + -s；不可数：不加 a/an',
    rule: 'water、rice 等不可数，不能直接加 a/an；apple、book 等可数需处理单复数。',
    example: 'I want an apple and some water.',
    exampleCn: '我想要一个苹果和一些水。'
  },
  {
    id: 'grammar-l1-005', type: 'grammar', level: 1, category: 'basic',
    content: '祈使句',
    meaning: '表达请求、命令或建议',
    structure: '动词原形开头（否定：Don’t + 动词原形）',
    rule: '以动词原形开头表示指令；加 please 更礼貌；否定用 Don’t。',
    example: 'Open the window, please. Don’t be late.',
    exampleCn: '请打开窗户。不要迟到。'
  },
  {
    id: 'grammar-l1-006', type: 'grammar', level: 1, category: 'basic',
    content: 'There be 句型',
    meaning: '表示"某地有某物"',
    structure: 'There is + 单数 / There are + 复数',
    rule: '就近原则：be 动词与最近的名词单复数一致；过去用 There was/were。',
    example: 'There is a book on the desk. There are two cups.',
    exampleCn: '桌上有一本书。有两个杯子。'
  },
  {
    id: 'grammar-l1-007', type: 'grammar', level: 1, category: 'basic',
    content: '一般疑问句',
    meaning: '用 yes/no 回答的问句',
    structure: 'Be/助动词 + 主语 + 其他？',
    rule: 'be 动词或 do/does 提前到句首；回答用 Yes, ... / No, ...。',
    example: 'Are you a teacher? Yes, I am.',
    exampleCn: '你是老师吗？是的，我是。'
  },
  {
    id: 'grammar-l1-008', type: 'grammar', level: 1, category: 'basic',
    content: '特殊疑问句',
    meaning: '用疑问词提问',
    structure: '疑问词(what/where/when/who) + 一般疑问句？',
    rule: 'what 问事物，where 问地点，when 问时间，who 问人；语序为疑问词 + 助动词 + 主语。',
    example: 'What is your name? Where do you live?',
    exampleCn: '你叫什么名字？你住在哪里？'
  },
  {
    id: 'grammar-l1-009', type: 'grammar', level: 1, category: 'tense',
    content: '现在进行时',
    meaning: '表示正在发生的动作',
    structure: '主语 + am/is/are + 动词-ing',
    rule: '动词加 -ing 表示此刻正在进行；常与 now、right now 连用。',
    example: 'She is reading a book now.',
    exampleCn: '她现在正在看书。'
  },
  {
    id: 'grammar-l1-010', type: 'grammar', level: 1, category: 'tense',
    content: '情态动词 can',
    meaning: '表示能力或许可',
    structure: '主语 + can + 动词原形',
    rule: 'can 后接动词原形，不分人称；否定 can’t，疑问 Can + 主语？',
    example: 'I can swim. Can you help me?',
    exampleCn: '我会游泳。你能帮我吗？'
  },
  {
    id: 'grammar-l1-011', type: 'grammar', level: 1, category: 'basic',
    content: '形容词的位置',
    meaning: '修饰名词的形容词',
    structure: '限定词 + 形容词 + 名词',
    rule: '形容词通常放在名词前，如 a big house；表语时放在 be 后。',
    example: 'This is a small red apple.',
    exampleCn: '这是一个小红苹果。'
  },
  {
    id: 'grammar-l1-012', type: 'grammar', level: 1, category: 'basic',
    content: '方位介词',
    meaning: 'in/on/under 等表示位置',
    structure: '名词 + 介词 + 地点',
    rule: 'in 在内部，on 在表面，under 在正下方，near 在附近，between 在两者之间。',
    example: 'The cat is under the table.',
    exampleCn: '猫在桌子下面。'
  }
]
