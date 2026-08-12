/**
 * 内容导出脚本：把前端 JS 数据文件导出为单一 JSON
 * 用法：node scripts/export-content.mjs [输出路径]
 * 输出：content-export.json（供后端 migrate_content.py 导入）
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  contentByLevel,
  sentencesByLevel,
  contentStats
} from '../src/data/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(__dirname, '../backend/data/content-export.json')

// 展平为数组，供后端入库
const items = []
for (const level of Object.keys(contentByLevel)) {
  const mod = contentByLevel[level]
  for (const type of ['words', 'phrases', 'grammar', 'extra']) {
    for (const item of mod[type]) {
      items.push({
        item_key: item.id,
        type: item.type,
        level: item.level,
        category: item.category,
        content: item.content,
        meaning: item.meaning,
        phonetic: item.phonetic || '',
        example: item.example || '',
        example_cn: item.exampleCn || '',
        structure: item.structure || '',
        rule: item.rule || '',
        detail: item.detail || '',
        tips: item.tips || [],
        recommend: item.recommend || null
      })
    }
  }
}

const sentences = []
for (const level of Object.keys(sentencesByLevel)) {
  for (const s of sentencesByLevel[level]) {
    sentences.push({ level: Number(level), en: s.en, cn: s.cn })
  }
}

const payload = {
  version: '1.0.0',
  exportedAt: new Date().toISOString(),
  stats: contentStats,
  items,
  sentences
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8')
console.log(`✔ 已导出 ${items.length} 条内容 + ${sentences.length} 条每日句子 → ${outPath}`)
