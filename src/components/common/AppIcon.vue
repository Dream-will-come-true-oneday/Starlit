<script setup>
import { computed } from 'vue'
import {
  Activity,
  Archive,
  ArrowRight,
  BarChart3,
  BookOpen,
  Braces,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Database,
  Flame,
  GraduationCap,
  Home,
  Languages,
  Library,
  Mic2,
  MessageSquareText,
  MoreHorizontal,
  Play,
  RotateCcw,
  Save,
  Search,
  Settings2,
  Sparkles,
  Target,
  TimerReset,
  X
} from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
  strokeWidth: { type: [Number, String], default: 1.8 },
  label: { type: String, default: '' }
})

const icons = {
  activity: Activity,
  archive: Archive,
  arrowRight: ArrowRight,
  bars: BarChart3,
  book: BookOpen,
  braces: Braces,
  calendar: CalendarClock,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  help: CircleHelp,
  database: Database,
  flame: Flame,
  graduation: GraduationCap,
  home: Home,
  languages: Languages,
  library: Library,
  mic: Mic2,
  chat: MessageSquareText,
  more: MoreHorizontal,
  play: Play,
  refresh: RotateCcw,
  save: Save,
  search: Search,
  settings: Settings2,
  sparkles: Sparkles,
  target: Target,
  timer: TimerReset,
  close: X
}

const icon = computed(() => icons[props.name] || CircleHelp)
const a11y = computed(() => (
  props.label
    ? { role: 'img', 'aria-label': props.label }
    : { 'aria-hidden': 'true' }
))
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="strokeWidth"
    focusable="false"
    v-bind="a11y"
  />
</template>
