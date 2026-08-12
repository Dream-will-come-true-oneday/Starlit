/**
 * 内容数据汇总入口
 * 统一加载四模块 L1-L5 内容 + 每日句子库
 */

import wordsL1 from './words/l1-daily-life.js'
import wordsL2 from './words/l2-social.js'
import wordsL3 from './words/l3-workplace.js'
import wordsL4 from './words/l4-economics.js'
import wordsL5 from './words/l5-it.js'

import phrasesL1 from './phrases/l1-daily-life.js'
import phrasesL2 from './phrases/l2-social.js'
import phrasesL3 from './phrases/l3-workplace.js'
import phrasesL4 from './phrases/l4-economics.js'
import phrasesL5 from './phrases/l5-it.js'

import grammarL1 from './grammar/l1-daily-life.js'
import grammarL2 from './grammar/l2-social.js'
import grammarL3 from './grammar/l3-workplace.js'
import grammarL4 from './grammar/l4-economics.js'
import grammarL5 from './grammar/l5-it.js'

import extraL1 from './extra/l1-practical.js'
import extraL2 from './extra/l2-social.js'
import extraL3 from './extra/l3-workplace.js'
import extraL4 from './extra/l4-economics.js'
import extraL5 from './extra/l5-it.js'

import sentencesL1 from './sentences/l1-sentences.js'
import sentencesL2 from './sentences/l2-sentences.js'
import sentencesL3 from './sentences/l3-sentences.js'
import sentencesL4 from './sentences/l4-sentences.js'
import sentencesL5 from './sentences/l5-sentences.js'

/** 全部内容库（按等级索引） */
export const contentByLevel = {
  1: { words: wordsL1, phrases: phrasesL1, grammar: grammarL1, extra: extraL1 },
  2: { words: wordsL2, phrases: phrasesL2, grammar: grammarL2, extra: extraL2 },
  3: { words: wordsL3, phrases: phrasesL3, grammar: grammarL3, extra: extraL3 },
  4: { words: wordsL4, phrases: phrasesL4, grammar: grammarL4, extra: extraL4 },
  5: { words: wordsL5, phrases: phrasesL5, grammar: grammarL5, extra: extraL5 }
}

/** 每日句子库（按等级索引） */
export const sentencesByLevel = {
  1: sentencesL1,
  2: sentencesL2,
  3: sentencesL3,
  4: sentencesL4,
  5: sentencesL5
}

/** 按 id 索引全部内容（快速查找用） */
const allItems = []
Object.values(contentByLevel).forEach((mod) => {
  Object.values(mod).forEach((list) => allItems.push(...list))
})
export const itemIndex = {}
allItems.forEach((item) => {
  itemIndex[item.id] = item
})

/** 各模块总数统计 */
export const contentStats = {
  words: allItems.filter((i) => i.type === 'word').length,
  phrases: allItems.filter((i) => i.type === 'phrase').length,
  grammar: allItems.filter((i) => i.type === 'grammar').length,
  extra: allItems.filter((i) => i.type === 'extra').length,
  total: allItems.length
}

/** 按类型+等级取内容（type 用单数形式 word/phrase/grammar/extra，自动映射到数据键） */
const TYPE_KEY_MAP = { word: 'words', phrase: 'phrases', grammar: 'grammar', extra: 'extra' }
export function getItemsByType(type, level) {
  const mod = contentByLevel[level]
  if (!mod) return []
  const key = TYPE_KEY_MAP[type] || type
  return mod[key] || []
}

/** 按 id 取内容 */
export function getItemById(id) {
  return itemIndex[id]
}

/** 按类型取「全部等级合并」内容（L1→L5 连续流，供学习计划连续推进使用） */
export function getItemsCombined(type) {
  const key = TYPE_KEY_MAP[type] || type
  return [1, 2, 3, 4, 5].flatMap((lv) => contentByLevel[lv]?.[key] || [])
}

/** 每等级内容数量（与内容库一致） */
export const LEVEL_SIZES = {
  word: [50, 50, 40, 40, 40],
  phrase: [30, 30, 25, 25, 25],
  grammar: [12, 12, 10, 10, 10],
  extra: [12, 12, 12, 12, 12]
}

/** 某等级在合并列表中的起始下标（L1 → 0） */
export function levelStartIndex(type, level) {
  const sizes = LEVEL_SIZES[type] || []
  if (level <= 1) return 0
  return sizes.slice(0, level - 1).reduce((a, b) => a + b, 0)
}

/** 合并列表中的下标属于哪个等级 */
export function levelOfIndex(type, index) {
  const sizes = LEVEL_SIZES[type] || []
  let acc = 0
  for (let lv = 1; lv <= sizes.length; lv++) {
    acc += sizes[lv - 1]
    if (index < acc) return lv
  }
  return sizes.length
}

export default allItems
