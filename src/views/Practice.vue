<template>
  <div class="practice-page">
    <div class="module-header">
      <div>
        <h1 class="page-title">🎙️ 每日对话练习</h1>
        <p class="page-desc">围绕今天学的内容，和 AI 来一段真实对话 · 结束后自动出报告（不保存历史）</p>
      </div>
      <span class="badge" :class="apiReady ? 'badge-lit' : 'badge-missed'">{{ apiReady ? 'AI 已就绪' : '未配置 AI' }}</span>
    </div>

    <!-- 空闲：开始前 -->
    <section v-if="phase === 'idle'" class="card fade-in">
      <div class="card-title"><span>📚 今天的学习内容</span></div>
      <div class="tl-desc">
        <template v-if="todayItems.length">
          单词：{{ todayItems.filter((i) => i.type === 'word').map((i) => i.content).join(' · ') }}<br />
          短语：{{ todayItems.filter((i) => i.type === 'phrase').map((i) => i.content).join(' · ') }}<br />
          语法：{{ todayItems.filter((i) => i.type === 'grammar').map((i) => i.content).join(' · ') }}<br />
          其他：{{ todayItems.filter((i) => i.type === 'extra').map((i) => i.content).join(' · ') }}
        </template>
        <template v-else>（今天还没有新学内容，可以用已学过的知识练习）</template>
      </div>
      <p v-if="dailySentence.en" class="tl-sentence">今日句子：{{ dailySentence.en }}</p>
      <p v-if="!speechOk" class="warn-text">⚠ 当前浏览器不支持语音识别（建议用 Chrome / Edge），将使用文字输入对话。</p>
      <p v-if="!apiReady" class="warn-text">⚠ 后端未配置 DEEPSEEK_API_KEY，请先在 backend/.env 填写后再开始。</p>
      <button class="btn btn-primary" :disabled="!apiReady || loading" @click="startPractice">
        {{ loading ? '生成场景中…' : '🎙️ 开始练习' }}
      </button>
    </section>

    <!-- 场景卡片 -->
    <section v-if="scenario" class="card scenario-card fade-in">
      <div class="card-title"><span>🏠 {{ scenario.title }}</span></div>
      <p class="sc-setting">{{ scenario.setting }}</p>
      <div class="sc-role"><span class="badge">你 vs {{ scenario.role }}</span><span class="badge badge-pending">目标：{{ scenario.goal }}</span></div>
      <div v-if="scenario.tips?.length" class="sc-tips">
        <span v-for="t in scenario.tips" :key="t" class="tip-chip">{{ t }}</span>
      </div>
      <button v-if="phase === 'talking'" class="btn btn-outline btn-sm" @click="endPractice">结束并生成报告 →</button>
    </section>

    <!-- 对话区 -->
    <section v-if="phase === 'talking'" class="chat-area">
      <div class="chat-box">
        <div v-for="(m, i) in history" :key="i" class="msg" :class="m.role === 'user' ? 'msg-user' : 'msg-ai'">
          <div class="msg-bubble">
            {{ m.content }}
            <span v-if="m.role === 'assistant' && speakingIndex === i" class="speak-dot">🔊</span>
          </div>
          <div v-if="m.role === 'assistant'" class="msg-actions">
            <button class="mini-btn" @click="replay(i)">🔊 重听</button>
          </div>
          <div v-if="m.role === 'assistant' && m.hint" class="msg-hint">💡 {{ m.hint }}</div>
        </div>
        <!-- 实时语音转写气泡（录音中显示） -->
        <div v-if="listening" class="msg msg-user">
          <div class="msg-bubble live-bubble">
            {{ liveText || '（等待识别…）' }}
            <span class="live-dot"></span>
          </div>
        </div>
        <div v-if="waiting" class="msg msg-ai">
          <div class="msg-bubble typing">AI 正在思考…</div>
        </div>
      </div>

      <div class="chat-controls">
        <button
          v-if="speechOk"
          class="mic-btn"
          :class="{ active: listening }"
          @click="toggleMic"
          :disabled="waiting || speaking"
        >
          {{ speaking ? '🔊 AI 正在说话…' : listening ? '⏹️ 说完停止' : '🎤 开始说话' }}
        </button>
        <input
          v-model="textInput"
          class="text-input"
          :placeholder="listening ? '正在说话…（识别文字显示在上面）' : '输入你的英文回答…'"
          :disabled="listening || waiting"
          @keyup.enter="sendText"
        />
        <button class="btn btn-primary btn-sm" :disabled="waiting || !textInput.trim()" @click="sendText">发送</button>
      </div>
      <p v-if="listening" class="live-hint">🔴 录音中 · 再次点按钮可手动发送（或静音后自动发送）</p>

      <div class="turn-hint">对话轮次 {{ userTurns }} / {{ MAX_TURNS }} · 说够或不想说了随时「结束并生成报告」</div>
    </section>

    <!-- 报告 -->
    <section v-if="report" class="card report-card fade-in">
      <div class="card-title"><span>📊 你的练习报告</span><span class="badge badge-lit">综合 {{ report.scores?.overall ?? '-' }} 分</span></div>

      <div class="score-grid">
        <div v-for="s in scoreList" :key="s.key" class="score-item">
          <div class="sc-head"><span>{{ s.label }}</span><span class="sc-num">{{ report.scores?.[s.key] ?? '-' }}</span></div>
          <div class="sc-bar"><div class="sc-fill" :style="{ width: (report.scores?.[s.key] || 0) * 10 + '%' }"></div></div>
        </div>
      </div>

      <h3 class="rep-title rep-weak">薄弱点</h3>
      <ul class="rep-list"><li v-for="(w, i) in report.weak_points || []" :key="i">{{ w }}</li></ul>
      <p v-if="!(report.weak_points || []).length" class="rep-empty">暂无明显薄弱点，表现不错！</p>

      <h3 class="rep-title rep-good">做得好的地方</h3>
      <ul class="rep-list"><li v-for="(s, i) in report.strengths || []" :key="i">{{ s }}</li></ul>

      <h3 class="rep-title">今天的目标表达</h3>
      <div class="target-cols">
        <div class="target-col">
          <span class="target-label target-used">✓ 用上了</span>
          <ul class="rep-list"><li v-for="(t, i) in report.used_target_items || []" :key="i">{{ t }}</li></ul>
        </div>
        <div class="target-col">
          <span class="target-label target-missed">○ 没用上</span>
          <ul class="rep-list"><li v-for="(t, i) in report.missed_target_items || []" :key="i">{{ t }}</li></ul>
        </div>
      </div>

      <h3 class="rep-title">改进练习</h3>
      <ul class="rep-list"><li v-for="(im, i) in report.improvements || []" :key="i">{{ im }}</li></ul>

      <h3 class="rep-title">学习建议</h3>
      <ul class="rep-list"><li v-for="(sg, i) in report.suggestions || []" :key="i">{{ sg }}</li></ul>

      <h3 class="rep-title">📖 本次练习解析（怎么提问 / 怎么回复）</h3>
      <p class="rep-analysis">{{ report.analysis || '（暂无解析）' }}</p>

      <h3 class="rep-title">💬 对话改进示范</h3>
      <div v-if="(report.example_exchanges || []).length" class="exchange-list">
        <div v-for="(ex, i) in report.example_exchanges" :key="i" class="exchange-item">
          <div class="ex-row"><span class="ex-tag ex-tag-ai">AI</span>{{ ex.ai }}</div>
          <div class="ex-row"><span class="ex-tag ex-tag-you">你</span>{{ ex.you }}</div>
          <div class="ex-row ex-better">
            <span class="ex-tag ex-tag-good">更好</span>{{ ex.better }}
            <span class="ex-note">{{ ex.note }}</span>
          </div>
        </div>
      </div>
      <p v-else class="rep-empty">（暂无示范，多聊几轮会更全面）</p>

      <div class="report-actions">
        <button class="btn btn-outline btn-sm" @click="copyReport">📋 复制报告</button>
        <button class="btn btn-primary btn-sm" @click="resetAll">再练一次</button>
      </div>
    </section>

    <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { generateScenario, sendTurn, generateReport } from '../api/practice.js'
import { useVoiceChat, isSpeechSupported } from '../composables/useVoiceChat.js'
import { usePlanStore } from '../stores/planStore.js'
import { useProgressStore } from '../stores/progressStore.js'

const MAX_TURNS = 8

const plan = usePlanStore()
const progress = useProgressStore()
const voice = useVoiceChat()

const phase = ref('idle') // idle | talking | report
const loading = ref(false)
const waiting = ref(false)
const scenario = ref(null)
const history = ref([])
const userTurns = ref(0)
const textInput = ref('')
const listening = ref(false)
const liveText = ref('')          // 实时语音识别累积文字
const speaking = ref(false)       // AI 语音播放中（期间锁住录音按钮）
const speakingIndex = ref(-1)
const report = ref(null)
const errorMsg = ref('')
const speechOk = isSpeechSupported()

const apiReady = ref(true)

const todayPlan = computed(() => {
  try {
    return plan.getTodayPlan()
  } catch {
    return null
  }
})

const todayItems = computed(() => {
  const n = todayPlan.value?.newItems
  if (!n) return []
  return [...(n.words || []), ...(n.phrases || []), ...(n.grammar || []), ...(n.extra || [])].map((it) => ({
    type: it.type,
    content: it.content,
    meaning: it.meaning || ''
  }))
})

const dailySentence = computed(() => todayPlan.value?.newItems?.sentence || {})

const scoreList = [
  { key: 'grammar', label: '语法准确度' },
  { key: 'vocabulary', label: '词汇运用' },
  { key: 'fluency', label: '流利度' },
  { key: 'relevance', label: '表达贴题' }
]

const targetItems = computed(() => todayItems.value.map((i) => `${i.content}（${i.meaning}）`))

onMounted(() => {
  // 预加载语音列表（Chrome 需要触发一次）
  if ('speechSynthesis' in window) window.speechSynthesis.getVoices()
})

onBeforeUnmount(() => {
  voice.stopListening()
  voice.stopSpeak()
})

async function startPractice() {
  errorMsg.value = ''
  loading.value = true
  try {
    const items = todayItems.value.map((i) => ({ type: i.type, content: i.content, meaning: i.meaning }))
    const lv = progress.moduleLevel('word')
    const sc = await generateScenario(items, dailySentence.value.en || '', lv)
    scenario.value = sc
    // 开场白 + 首个回复提示（来自 LLM 生成的 respond_hint，否则兜底）
    const openingHint = sc.respond_hint || '试着用今天学的表达自然回应对方。'
    history.value = sc.opening ? [{ role: 'assistant', content: sc.opening, hint: openingHint }] : []
    userTurns.value = 0
    phase.value = 'talking'
    if (sc.opening) speakNow(sc.opening, 0)
  } catch (e) {
    errorMsg.value = e.message || '场景生成失败，请检查后端服务'
    if (String(e.message).includes('未配置')) apiReady.value = false
  } finally {
    loading.value = false
  }
}

function toggleMic() {
  if (listening.value) {
    // 手动停止：触发 stop → onend → 那里统一发送累积文本
    voice.stopListening()
    return
  }
  liveText.value = ''
  listening.value = true
  voice.startListening({
    onPartial: (text) => { liveText.value = text },
    onError: (err) => {
      listening.value = false
      liveText.value = ''
      if (err !== 'no-speech') errorMsg.value = `语音识别出错：${err}，可改用文字输入`
    },
    onEnd: () => {
      // 浏览器静音自动停止或手动 stopListening → 发送累积文本
      listening.value = false
      const text = liveText.value.trim()
      liveText.value = ''
      if (text) sendMessage(text)
    }
  })
}

function sendText() {
  const t = textInput.value.trim()
  if (!t || waiting.value) return
  textInput.value = ''
  sendMessage(t)
}

async function sendMessage(text) {
  if (userTurns.value >= MAX_TURNS) {
    endPractice()
    return
  }
  history.value.push({ role: 'user', content: text })
  userTurns.value += 1
  waiting.value = true
  errorMsg.value = ''
  try {
    // 后端契约：history 传"该用户发言之前"的消息（刚 push 的那条去掉），user_text 单独传当前发言，避免重复
    const res = await sendTurn(scenario.value, history.value.slice(0, -1), text)
    const idx = history.value.length
    history.value.push({ role: 'assistant', content: res.reply, hint: res.hint || '' })
    speakNow(res.reply, idx)
    if (userTurns.value >= MAX_TURNS) {
      // 轮数已满，自动结束
      endPractice()
    }
  } catch (e) {
    errorMsg.value = e.message || 'AI 回复失败'
  } finally {
    waiting.value = false
  }
}

function replay(i) {
  const m = history.value[i]
  if (m && m.role === 'assistant') speakNow(m.content, i)
}

/** 统一播放 AI 语音：播放期间 speaking=true，锁定录音按钮 */
function speakNow(text, idx) {
  speaking.value = true
  speakingIndex.value = idx ?? -1
  const ok = voice.speak(text, {
    onend: () => {
      speaking.value = false
      speakingIndex.value = -1
    }
  })
  if (!ok) {
    speaking.value = false
    speakingIndex.value = -1
  }
}

async function endPractice() {
  if (waiting.value || !scenario.value) return
  waiting.value = true
  errorMsg.value = ''
  try {
    report.value = await generateReport(scenario.value, history.value, targetItems.value)
    phase.value = 'report'
  } catch (e) {
    errorMsg.value = e.message || '报告生成失败'
  } finally {
    waiting.value = false
  }
}

async function copyReport() {
  if (!report.value) return
  const lines = [
    `Starlit 对话练习报告 · 场景：${scenario.value?.title || ''}`,
    `综合评分：${report.value.scores?.overall ?? '-'}`,
    ...scoreList.map((s) => `- ${s.label}：${report.value.scores?.[s.key] ?? '-'}`),
    '',
    '薄弱点：',
    ...(report.value.weak_points || []).map((x) => `- ${x}`),
    '',
    '改进练习：',
    ...(report.value.improvements || []).map((x) => `- ${x}`),
    '',
    '学习建议：',
    ...(report.value.suggestions || []).map((x) => `- ${x}`),
    '',
    '本次练习解析：',
    ...(report.value.analysis ? [report.value.analysis] : []),
    '',
    '对话改进示范：',
    ...(report.value.example_exchanges || []).map((ex) => `- AI：${ex.ai} | 你：${ex.you} | 更好：${ex.better}（${ex.note}）`)
  ]
  try {
    await navigator.clipboard.writeText(lines.join('\n'))
    errorMsg.value = '报告已复制到剪贴板'
  } catch {
    errorMsg.value = '复制失败，请手动选择文本复制'
  }
}

function resetAll() {
  phase.value = 'idle'
  scenario.value = null
  history.value = []
  userTurns.value = 0
  report.value = null
  textInput.value = ''
  liveText.value = ''
  errorMsg.value = ''
  voice.stopSpeak()
}
</script>

<style scoped>
.practice-page { max-width: 760px; }
.module-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.page-title { font-size: 24px; font-weight: 700; }
.page-desc { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.tl-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px; }
.tl-sentence { font-size: 14px; color: var(--accent); margin-bottom: 16px; }
.warn-text { font-size: 13px; color: var(--warn, #f5b759); margin-bottom: 14px; }
.error-text { color: var(--missed); font-size: 13px; margin-top: 12px; }

.scenario-card { margin-bottom: 16px; }
.sc-setting { font-size: 14px; color: var(--text-secondary); margin: 8px 0 10px; line-height: 1.7; }
.sc-role { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.sc-tips { display: flex; flex-wrap: wrap; gap: 6px; }
.tip-chip {
  font-size: 12px; padding: 4px 10px; border-radius: 999px;
  background: var(--bg-soft); border: 1px solid var(--border); color: var(--text-secondary);
}

.chat-area { margin-bottom: 16px; }
.chat-box {
  display: flex; flex-direction: column; gap: 10px;
  background: var(--bg-soft); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px; min-height: 220px; max-height: 420px;
  overflow-y: auto; margin-bottom: 12px;
}
.msg { display: flex; flex-direction: column; max-width: 80%; }
.msg-user { align-self: flex-end; align-items: flex-end; }
.msg-ai { align-self: flex-start; align-items: flex-start; }
.msg-bubble {
  padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.6; word-break: break-word;
}
.msg-user .msg-bubble { background: rgba(91, 140, 255, 0.18); color: #cfe0ff; border: 1px solid rgba(91, 140, 255, 0.35); }
.msg-ai .msg-bubble { background: var(--bg-card); border: 1px solid var(--border); color: var(--text); }
.msg-ai .typing { color: var(--text-muted); }
.speak-dot { font-size: 11px; margin-left: 6px; }
.msg-actions { margin-top: 4px; }
.mini-btn { font-size: 11px; color: var(--text-muted); background: none; border: none; cursor: pointer; }
.mini-btn:hover { color: var(--text); }

.chat-controls { display: flex; gap: 8px; align-items: center; }
.mic-btn {
  padding: 10px 16px; border-radius: 999px; border: 1px solid var(--border);
  background: var(--bg-card); color: var(--text); cursor: pointer; font-size: 13px;
  transition: all 0.2s; flex-shrink: 0;
}
.mic-btn.active { background: rgba(224, 75, 74, 0.25); border-color: var(--missed); color: #f09595; }
.text-input {
  flex: 1; padding: 10px 14px; border-radius: 10px;
  background: var(--bg-soft); border: 1px solid var(--border); color: var(--text); font-size: 14px;
}
.text-input:focus { outline: none; border-color: var(--accent); }
.turn-hint { font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: center; }

.live-hint { font-size: 12px; color: #f09595; margin-top: 8px; text-align: center; }

.live-bubble {
  border-style: dashed !important;
  opacity: 0.9;
  min-width: 60px;
}
.live-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #f09595;
  margin-left: 6px;
  animation: live-pulse 1s infinite;
  vertical-align: middle;
}
@keyframes live-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
@media (prefers-reduced-motion: reduce) {
  .live-dot { animation: none; }
}

.report-card { margin-top: 8px; }
.score-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 14px 0; }
.score-item { }
.sc-head { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
.sc-num { font-weight: 700; color: var(--accent); }
.sc-bar { height: 6px; border-radius: 3px; background: var(--bg-hover); overflow: hidden; }
.sc-fill { height: 100%; background: var(--accent); border-radius: 3px; }

.rep-title { font-size: 14px; font-weight: 600; margin: 16px 0 6px; }
.rep-weak { color: var(--missed); }
.rep-good { color: var(--lit); }
.rep-list { margin: 0; padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.8; }
.rep-empty { font-size: 13px; color: var(--text-muted); }
.msg-hint {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #f5b759;
  background: rgba(245, 183, 89, 0.08);
  border: 1px dashed rgba(245, 183, 89, 0.35);
  border-radius: 8px;
  padding: 6px 10px;
  max-width: 100%;
}
.rep-analysis {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 6px 0 0;
}
.exchange-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}
.exchange-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--bg-soft);
}
.ex-row {
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.ex-row:last-child { margin-bottom: 0; }
.ex-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
.ex-tag-ai { background: rgba(91, 140, 255, 0.15); color: #93b4ff; }
.ex-tag-you { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; }
.ex-tag-good { background: rgba(52, 211, 153, 0.15); color: var(--lit); }
.ex-better { color: var(--lit); }
.ex-note {
  font-size: 12px;
  color: var(--text-muted);
  width: 100%;
  margin-left: 32px;
}
.target-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.target-label { font-size: 12px; font-weight: 600; }
.target-used { color: var(--lit); }
.target-missed { color: var(--text-muted); }
.report-actions { display: flex; gap: 10px; margin-top: 18px; }
</style>
