/**
 * 每日学习计划生成逻辑
 * 四模块新学内容 + 每日句子 + 记忆曲线复盘项
 */
import dayjs from 'dayjs'
import { getItemsCombined, sentencesByLevel, levelOfIndex } from '../data/index.js'
import { getReviewsOnDate } from './useMemoryCurve.js'

/** 每日学习量配置 */
export const DAILY_CONFIG = {
  wordsPerDay: 5,
  phrasesPerDay: 3,
  grammarPerDay: 1,
  extraPerDay: 1
}

/**
 * 生成指定日期的学习计划
 * @param {string} date 日期 YYYY-MM-DD
 * @param {object} contentIndex 内容进度指针 {word, phrase, grammar, extra}
 * @param {array} allProgress 所有学习进度
 */
export function generateDailyPlan(date, contentIndex, allProgress) {
  const today = dayjs().format('YYYY-MM-DD')
  const dayStatus = date < today ? 'past' : date === today ? 'today' : 'future'

  // 1. 四模块新学内容（从跨等级合并列表按内容指针切片，保证连续推进且不会越界）
  const words = sliceByIndex(getItemsCombined('word'), contentIndex.word, DAILY_CONFIG.wordsPerDay)
  const phrases = sliceByIndex(getItemsCombined('phrase'), contentIndex.phrase, DAILY_CONFIG.phrasesPerDay)
  const grammar = sliceByIndex(getItemsCombined('grammar'), contentIndex.grammar, DAILY_CONFIG.grammarPerDay)
  const extra = sliceByIndex(getItemsCombined('extra'), contentIndex.extra, DAILY_CONFIG.extraPerDay)

  // 2. 每日句子（句子等级随当天单词指针位置推导，与分模块难度解耦）
  const sentenceLevel = levelOfIndex('word', Math.max(contentIndex.word, 0))
  const sentenceList = sentencesByLevel[sentenceLevel] || []
  const sentenceIdx = contentIndex.word >= 0 ? contentIndex.word % sentenceList.length : 0
  const sentence = sentenceList[sentenceIdx] || { en: '', cn: '' }

  // 3. 记忆曲线复盘项
  const reviewItems = getReviewsOnDate(allProgress, date)

  // 4. 完成统计
  const newTotal = words.length + phrases.length + grammar.length + extra.length
  const newCompleted = countCompletedNew(date, [...words, ...phrases, ...grammar, ...extra], allProgress)
  const reviewTotal = reviewItems.length
  const reviewCompleted = reviewItems.filter((r) => r.status === 'completed').length

  return {
    date,
    dayStatus,
    newItems: { words, phrases, grammar, extra, sentence },
    reviewItems,
    completion: { newTotal, newCompleted, reviewTotal, reviewCompleted }
  }
}

/** 生成连续 N 天计划（时间线视图） */
export function generatePlanRange(startDate, days, contentIndex, allProgress) {
  const plans = []
  const todayStr = dayjs().format('YYYY-MM-DD')
  for (let i = 0; i < days; i++) {
    const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD')
    // 以「今天」的内容指针为基准，按与今天的日期差平移指针：
    // offset = 0 今天；负数 = 过去（更早学的内容）；正数 = 未来（更晚学的内容）
    const offset = dayjs(date).diff(dayjs(todayStr), 'day')
    const effectiveIndex = {
      word: contentIndex.word + offset * DAILY_CONFIG.wordsPerDay,
      phrase: contentIndex.phrase + offset * DAILY_CONFIG.phrasesPerDay,
      grammar: contentIndex.grammar + offset * DAILY_CONFIG.grammarPerDay,
      extra: contentIndex.extra + offset * DAILY_CONFIG.extraPerDay
    }
    plans.push(generateDailyPlan(date, effectiveIndex, allProgress))
  }
  return plans
}

/** 切片：从内容指针取一段；start 为负（尚未开始学习）返回空 */
function sliceByIndex(list, start, count) {
  if (!list || list.length === 0) return []
  if (start < 0) return []
  return list.slice(start, start + count)
}

/** 统计某天新学内容中已完成（已生成进度记录）的数量 */
function countCompletedNew(date, items, allProgress) {
  if (items.length === 0) return 0
  const dateOfDay = dayjs(date).format('YYYY-MM-DD')
  const progressMap = {}
  allProgress.forEach((p) => {
    progressMap[p.itemId] = p
  })
  return items.filter((item) => {
    const p = progressMap[item.id]
    return p && dayjs(p.learnedDate).format('YYYY-MM-DD') === dateOfDay
  }).length
}
