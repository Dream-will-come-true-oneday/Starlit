import dayjs from 'dayjs'

/**
 * 日期工具：统一封装 dayjs，业务层不直接依赖具体库
 */

/** 当前日期字符串 YYYY-MM-DD */
export function today() {
  return dayjs().format('YYYY-MM-DD')
}

/** 日期格式化 */
export function formatDate(date, fmt = 'YYYY-MM-DD') {
  return dayjs(date).format(fmt)
}

/** 日期偏移 */
export function addDays(date, days) {
  return dayjs(date).add(days, 'day').format('YYYY-MM-DD')
}

/** 中文周几 */
export function weekdayCn(date) {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[dayjs(date).day()]
}

/** 相对今天的天数差（date - today），用于时间线定位 */
export function diffFromToday(date) {
  return dayjs(date).diff(dayjs(), 'day')
}

/** 相对某基准日期的天数差 */
export function diffDays(from, to) {
  return dayjs(to).diff(dayjs(from), 'day')
}

/** 人性化显示：今天/明天/昨天/具体日期 */
export function humanizeDate(date) {
  const d = diffFromToday(date)
  if (d === 0) return '今天'
  if (d === 1) return '明天'
  if (d === -1) return '昨天'
  return formatDate(date, 'M月D日')
}

export default dayjs
