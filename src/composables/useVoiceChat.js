/**
 * 语音对话能力封装：浏览器 Web Speech API（ASR）+ speechSynthesis（TTS）
 * 持续录音模式：点按钮开始 → 边说边实时转写（onPartial）→ 再点按钮或静音自动停止 → 发送累积文本
 * 不支持语音时降级为文字输入（由调用方检测 isSpeechSupported）
 * 预留：后续可替换为腾讯云语音（保持同一接口签名即可）
 */

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null

export function isSpeechSupported() {
  return !!SR
}

export function useVoiceChat() {
  let recognition = null
  let listening = false

  /**
   * 开始录音识别（持续模式）
   * @param {Object} opts
   * @param {string} [opts.lang='en-US']
   * @param {(text: string) => void} [opts.onPartial] 累积的实时文本（最终+中间），每次识别回调
   * @param {() => void} [opts.onEnd] 识别结束（用户停止 / 浏览器静音超时）
   * @param {(err: string) => void} [opts.onError]
   */
  function startListening({ lang = 'en-US', onPartial, onEnd, onError } = {}) {
    if (!SR) return false
    recognition = new SR()
    recognition.lang = lang
    recognition.continuous = true       // 持续监听，不一句一停
    recognition.interimResults = true   // 实时返回中间结果（边说边出字）
    recognition.maxAlternatives = 1
    let accumulated = ''                 // 已确认的最终文本（闭包内累积）
    recognition.onresult = (e) => {
      let finalChunk = ''
      let interimChunk = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalChunk += r[0].transcript
        else interimChunk += r[0].transcript
      }
      accumulated += finalChunk
      // 空格衔接，避免词粘连
      const full = (accumulated + (interimChunk ? (accumulated && !accumulated.endsWith(' ') ? ' ' : '') + interimChunk : '')).trim()
      if (onPartial) onPartial(full)
    }
    recognition.onerror = (e) => {
      if (e.error !== 'aborted' && onError) onError(e.error)
    }
    recognition.onend = () => {
      listening = false
      if (onEnd) onEnd()
    }
    try {
      recognition.start()
      listening = true
      return true
    } catch (e) {
      return false
    }
  }

  function stopListening() {
    if (recognition && listening) {
      recognition.stop()  // 触发 onend，浏览器会再吐一次最终结果
      listening = false
    }
  }

  function cancelListening() {
    if (recognition) {
      recognition.abort()  // 不触发 onresult，仅 onend
      listening = false
    }
  }

  /** 文字转语音播报 */
  function speak(text, { lang = 'en-US', rate = 1.0, onend } = {}) {
    if (!('speechSynthesis' in window)) return false
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = rate
    const voices = window.speechSynthesis.getVoices()
    const enVoice = voices.find((v) => v.lang.startsWith('en'))
    if (enVoice) u.voice = enVoice
    if (onend) u.onend = onend
    window.speechSynthesis.speak(u)
    return true
  }

  function stopSpeak() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  return {
    isSupported: !!SR,
    startListening,
    stopListening,
    cancelListening,
    speak,
    stopSpeak
  }
}