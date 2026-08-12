/**
 * L5 IT科技（C1-C2）语法库
 */
export default [
  {
    id: 'grammar-l5-001', type: 'grammar', level: 5, category: 'clause',
    content: '虚拟语气的混合条件句',
    meaning: '条件与结果时间不一致',
    structure: 'If + 过去完成时, would + 现在式动词',
    rule: '条件指过去、结果指现在：If had done, would do；注意时间错位。',
    example: 'If we had fixed the bug yesterday, the system would work now.',
    exampleCn: '如果我们昨天修了那个 bug，系统现在就能正常运行了。'
  },
  {
    id: 'grammar-l5-002', type: 'grammar', level: 5, category: 'clause',
    content: '名词性从句作宾语（复杂嵌套）',
    meaning: '多级从句嵌套',
    structure: '主句 + that/what 从句（从句内再含从句）',
    rule: '多层嵌套时保持从句连词与语序正确，避免歧义。',
    example: 'The developer found that what he assumed was wrong.',
    exampleCn: '开发者发现他所假设的是错误的。'
  },
  {
    id: 'grammar-l5-003', type: 'grammar', level: 5, category: 'phrase',
    content: '分裂不定式与形式主语',
    meaning: 'it 作形式主语，不定式后置',
    structure: 'It is + 形容词 + to do / that 从句',
    rule: 'it 提前占位，真正主语（不定式/从句）后置；避免累赘结构。',
    example: 'It is essential to test before deploying.',
    exampleCn: '部署前测试是至关重要的。'
  },
  {
    id: 'grammar-l5-004', type: 'grammar', level: 5, category: 'tense',
    content: '将来完成进行时',
    meaning: '将来某时之前一直在进行的动作',
    structure: 'will have been doing',
    rule: '强调动作的持续性与时间截止点，常与 by 引导的时间状语连用。',
    example: 'By next year, we will have been developing this app for five years.',
    exampleCn: '到明年，我们开发这款应用就满五年了。'
  },
  {
    id: 'grammar-l5-005', type: 'grammar', level: 5, category: 'phrase',
    content: '名词性代词的替代（one/that/those）',
    meaning: '避免名词重复的替代词',
    structure: 'one/that/those + 后置修饰',
    rule: '泛指单数用 one，特指单数用 that，复数用 those；正式技术文档常用。',
    example: 'The old API is slower than the new one.',
    exampleCn: '旧接口比新的更慢。'
  },
  {
    id: 'grammar-l5-006', type: 'grammar', level: 5, category: 'clause',
    content: '让步与对比（while/whereas）',
    meaning: '对比两个事物的差异',
    structure: 'While/Whereas + 从句, 主句',
    rule: 'while/whereas 表对比"而、却"，多用于正式报告与论文。',
    example: 'Python is easy to learn, whereas C++ offers more control.',
    exampleCn: 'Python 易学，而 C++ 提供了更多控制。'
  },
  {
    id: 'grammar-l5-007', type: 'grammar', level: 5, category: 'phrase',
    content: '插入语与评注性状语',
    meaning: 'however/therefore/moreover 等',
    structure: '主句, however/therefore + 主句',
    rule: '评注性状语连接句子逻辑，位置灵活（句首/句中/句尾），常用逗号隔开。',
    example: 'The tests passed; however, performance still needs work.',
    exampleCn: '测试通过了；然而，性能仍需改进。'
  },
  {
    id: 'grammar-l5-008', type: 'grammar', level: 5, category: 'passive',
    content: '复杂被动与使役结构',
    meaning: 'get/have + 宾语 + 过去分词',
    structure: 'have/get + 宾语 + 过去分词（使役被动）',
    rule: '表示"让别人做某事"，如 have it fixed；区别于主语的主动被动。',
    example: 'We got the server upgraded over the weekend.',
    exampleCn: '我们周末请人升级了服务器。'
  },
  {
    id: 'grammar-l5-009', type: 'grammar', level: 5, category: 'clause',
    content: '名词性 wh- 从句',
    meaning: 'what/whatever/whoever 引导',
    structure: 'wh- 词 + 从句（作主语/宾语）',
    rule: 'wh- 词自带语义并在从句中充当成分；whatever 强调"无论什么"。',
    example: 'Whatever the reason, the service went down.',
    exampleCn: '无论原因是什么，服务还是宕机了。'
  },
  {
    id: 'grammar-l5-010', type: 'grammar', level: 5, category: 'phrase',
    content: '书面语省略与平行结构',
    meaning: '正式写作的精简与对称',
    structure: '平行成分并列（动词/名词/从句结构一致）',
    rule: '平行结构要求并列成分形式一致；省略需保证语义清晰，避免歧义。',
    example: 'The system should be secure, reliable, and easy to maintain.',
    exampleCn: '系统应当安全、可靠且易于维护。'
  }
]
