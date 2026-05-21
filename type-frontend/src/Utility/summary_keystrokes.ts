
export type KeystrokeEventType = 'character' | 'Backspace'

export interface CharacterEvent {
  type: 'character'
  expectedChar: string
  actualChar: string
  timeStamp: number
  isCorrect: boolean
}

export interface BackspaceEvent {
  type: 'Backspace'
  timeStamp: number
}

export type KeystrokeEvent = CharacterEvent | BackspaceEvent

export interface BurstSegment {
  start: number       // char index within word
  end: number
  avg_gap_ms: number
}

export interface ErrorChar {
  expected: string
  typed: string
}

export interface CharDetail {
  c: string
  gap_ms: number
  error?: true
  typed?: string
  preceded_by_backspace?: number
  double_correction?: true
}

export interface WordSummary {
  word: string
  length: number
  start_gap_ms: number        // pause before first letter — proxy for reading time
  total_ms: number
  avg_gap_ms: number
  min_gap_ms: number
  max_gap_ms: number
  backspaces: number
  errors: number
  error_chars: ErrorChar[]
  burst_count: number
  bursts: BurstSegment[]
  chars?: CharDetail[]        // only present when word has errors / backspaces / double-corrections
}

export interface SessionMeta {
  total_events: number
  total_chars: number
  duration_ms: number
  wpm: number
  error_rate: number          // percentage
  backspace_rate: number      // percentage
  avg_interval_ms: number
  avg_word_start_gap: number  // key signal: reading pause before typing
  pause_count: number         // gaps > 500ms
  word_count: number
}

export type PatternType =
  | 'read_then_type'
  | 'chunked_typing'
  | 'adjacent_key_errors'
  | 'confidence_loss'
  | 'post_error_slowdown'

export interface Pattern {
  type: PatternType
  description: string
  affected_words?: string[] | Array<{ word: string; bursts: number }>
  errors?: Array<{ word: string; expected: string; typed: string }>
  avg_recovery_ms?: number
}

export interface KeystrokeSummary {
  session: SessionMeta
  words: WordSummary[]
  patterns: Pattern[]
}


interface WordAccumulator {
  word: string
  startGap: number
  chars: CharDetail[]
  backspaces: number
  trailingSpaceGap: number
}


const ADJACENCY: Record<string, string[]> = {
  q: ['w', 'a'],        w: ['q', 'e', 's'],   e: ['w', 'r', 'd'],
  r: ['e', 't', 'f'],   t: ['r', 'y', 'g'],   y: ['t', 'u', 'h'],
  u: ['y', 'i', 'j'],   i: ['u', 'o', 'k'],   o: ['i', 'p', 'l'],
  p: ['o', 'l'],        a: ['q', 's', 'z'],   s: ['a', 'd', 'w', 'x'],
  d: ['s', 'f', 'e', 'c'], f: ['d', 'g', 'r', 'v'], g: ['f', 'h', 't', 'b'],
  h: ['g', 'j', 'y', 'n'], j: ['h', 'k', 'u', 'm'], k: ['j', 'l', 'i'],
  l: ['k', 'o', 'p'],   z: ['a', 'x'],        x: ['z', 's', 'c'],
  c: ['x', 'd', 'v'],   v: ['c', 'f', 'b'],   b: ['v', 'g', 'n'],
  n: ['b', 'h', 'm'],   m: ['n', 'j'],
}

function isAdjacentKey(expected: string, typed: string): boolean {
  return ADJACENCY[expected?.toLowerCase()]?.includes(typed?.toLowerCase()) ?? false
}


const BURST_THRESHOLD_MS = 200

function detectBursts(gaps: number[]): BurstSegment[] {
  const bursts: BurstSegment[] = []
  let burstStart: number | null = null

  for (let i = 0; i < gaps.length; i++) {
    const inBurst = gaps[i] < BURST_THRESHOLD_MS

    if (inBurst && burstStart === null) {
      burstStart = i
    } else if (!inBurst && burstStart !== null) {
      if (i - burstStart >= 2) {
        const slice = gaps.slice(burstStart, i)
        bursts.push({
          start: burstStart,
          end: i - 1,
          avg_gap_ms: Math.round(slice.reduce((a, b) => a + b, 0) / slice.length),
        })
      }
      burstStart = null
    }
  }

  if (burstStart !== null && gaps.length - burstStart >= 2) {
    const slice = gaps.slice(burstStart)
    bursts.push({
      start: burstStart,
      end: gaps.length - 1,
      avg_gap_ms: Math.round(slice.reduce((a, b) => a + b, 0) / slice.length),
    })
  }

  return bursts
}



function detectDoubleCorrection(events: KeystrokeEvent[], idx: number): boolean {
  if (idx < 2) return false
  const e     = events[idx]
  const prev  = events[idx - 1]
  const prev2 = events[idx - 2]
  const next  = events[idx + 1]
  const next2 = events[idx + 2]

  if (e.type !== 'character')          return false
  if (prev?.type  !== 'Backspace')     return false
  if (prev2?.type !== 'character')     return false
  if ((prev2 as CharacterEvent).expectedChar !== e.expectedChar) return false
  if (next?.type  !== 'Backspace')     return false
  if (next2?.type !== 'character')     return false
  if ((next2 as CharacterEvent).expectedChar !== e.expectedChar) return false

  return true
}

// ─── Word finalization ─────────────────────────────────────────────────────

function finalizeWord(acc: WordAccumulator): WordSummary {
  const gaps   = acc.chars.map(c => c.gap_ms)
  const errors = acc.chars.filter(c => c.error)
  const bursts = detectBursts(gaps)
  const hasDetail = errors.length > 0 || acc.backspaces > 0 || acc.chars.some(c => c.double_correction)

  return {
    word:         acc.word,
    length:       acc.word.length,
    start_gap_ms: Math.round(acc.startGap),
    total_ms:     gaps.reduce((a, b) => a + b, 0),
    avg_gap_ms:   gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0,
    min_gap_ms:   gaps.length ? Math.round(Math.min(...gaps)) : 0,
    max_gap_ms:   gaps.length ? Math.round(Math.max(...gaps)) : 0,
    backspaces:   acc.backspaces,
    errors:       errors.length,
    error_chars:  errors.map(e => ({ expected: e.c, typed: e.typed! })),
    burst_count:  bursts.length,
    bursts,
    // Only include chars when there's something interesting to preserve
    ...(hasDetail ? { chars: acc.chars } : {}),
  }
}

// ─── Word segmentation ─────────────────────────────────────────────────────

function segmentIntoWords(events: KeystrokeEvent[]): WordSummary[] {
  const words: WordSummary[] = []
  let current: WordAccumulator | null = null
  let pendingBackspaces = 0

  for (let i = 0; i < events.length; i++) {
    const e    = events[i]
    const prev = events[i - 1] ?? null
    const gap  = prev ? e.timeStamp - prev.timeStamp : 0

    if (e.type === 'Backspace') {
      pendingBackspaces++
      if (current) current.backspaces++
      continue
    }

    // Space = word boundary
    if (e.type === 'character' && e.expectedChar === ' ') {
      if (current) {
        current.trailingSpaceGap = gap
        words.push(finalizeWord(current))
        current = null
      }
      pendingBackspaces = 0
      continue
    }

    // Regular character
    if (e.type === 'character') {
      if (!current) {
        current = {
          word:             '',
          startGap:         gap,
          chars:            [],
          backspaces:       pendingBackspaces,
          trailingSpaceGap: 0,
        }
        pendingBackspaces = 0
      }

      const isDoubleCorrection = detectDoubleCorrection(events, i)

      const charDetail: CharDetail = {
        c:      e.expectedChar,
        gap_ms: Math.round(gap),
        ...(e.isCorrect === false && { error: true as const, typed: e.actualChar }),
        ...(pendingBackspaces > 0 && { preceded_by_backspace: pendingBackspaces }),
        ...(isDoubleCorrection && { double_correction: true as const }),
      }

      current.chars.push(charDetail)
      current.word += e.expectedChar
      pendingBackspaces = 0
    }
  }

  // Flush last word (no trailing space)
  if (current) words.push(finalizeWord(current))

  return words
}

// ─── Session-level metrics ─────────────────────────────────────────────────

function computeSessionMeta(events: KeystrokeEvent[], words: WordSummary[]): SessionMeta {
  const chars      = events.filter((e): e is CharacterEvent => e.type === 'character')
  const backspaces = events.filter(e => e.type === 'Backspace')
  const errors     = chars.filter(e => !e.isCorrect)
  const totalMs    = events[events.length - 1].timeStamp - events[0].timeStamp
  const wpm        = +((chars.length / 5) / (totalMs / 60000)).toFixed(1)

  const intervals    = events.slice(1).map((e, i) => e.timeStamp - events[i].timeStamp)
  const avgInterval  = intervals.length
    ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
    : 0

  const startGaps    = words.map(w => w.start_gap_ms)
  const avgStartGap  = startGaps.length
    ? Math.round(startGaps.reduce((a, b) => a + b, 0) / startGaps.length)
    : 0

  return {
    total_events:       events.length,
    total_chars:        chars.length,
    duration_ms:        totalMs,
    wpm,
    error_rate:         chars.length ? +((errors.length / chars.length) * 100).toFixed(1) : 0,
    backspace_rate:     events.length ? +((backspaces.length / events.length) * 100).toFixed(1) : 0,
    avg_interval_ms:    avgInterval,
    avg_word_start_gap: avgStartGap,
    pause_count:        intervals.filter(g => g > 500).length,
    word_count:         words.length,
  }
}

// ─── Cross-word behavioral pattern detection ───────────────────────────────

function detectPatterns(words: WordSummary[]): Pattern[] {
  const patterns: Pattern[] = []

  // Read-then-type: hesitates before most word starts
  const longStartGaps = words.filter(w => w.start_gap_ms > 400)
  if (words.length > 0 && longStartGaps.length / words.length > 0.5) {
    patterns.push({
      type: 'read_then_type',
      description: 'User pauses significantly before most words — suggests reading ahead before committing to typing.',
      affected_words: longStartGaps.map(w => w.word),
    })
  }

  // Chunked typing: multiple bursts within a single word
  const multiBurstWords = words.filter(w => w.burst_count >= 2)
  if (multiBurstWords.length > 0) {
    patterns.push({
      type: 'chunked_typing',
      description: 'Long words typed in multiple bursts — syllable-by-syllable or morpheme-based motor chunking.',
      affected_words: multiBurstWords.map(w => ({ word: w.word, bursts: w.burst_count })),
    })
  }

  // Adjacent-key errors: lateral finger drift
  const adjacentErrors = words.flatMap(w =>
    w.error_chars
      .filter(e => isAdjacentKey(e.expected, e.typed))
      .map(e => ({ word: w.word, ...e }))
  )
  if (adjacentErrors.length > 0) {
    patterns.push({
      type: 'adjacent_key_errors',
      description: 'Errors are adjacent keys on QWERTY — lateral finger drift rather than random misses.',
      errors: adjacentErrors,
    })
  }

  // Confidence loss: double-correcting a correct character after a nearby error
  const doubleCorrections = words.filter(w =>
    w.chars?.some(c => c.double_correction)
  )
  if (doubleCorrections.length > 0) {
    patterns.push({
      type: 'confidence_loss',
      description: 'User over-corrected already-correct characters after nearby errors — disrupted motor confidence.',
      affected_words: doubleCorrections.map(w => w.word),
    })
  }

  // Post-error slowdown: large gap after backspace+retype
  const recoveryTimes = words.filter(w => w.errors > 0).map(w => w.max_gap_ms)
  if (recoveryTimes.length > 0) {
    const avgRecovery = Math.round(recoveryTimes.reduce((a, b) => a + b, 0) / recoveryTimes.length)
    patterns.push({
      type: 'post_error_slowdown',
      description: `Average max gap in error words is ${avgRecovery}ms — user visually re-reads after mistakes.`,
      avg_recovery_ms: avgRecovery,
    })
  }

  return patterns
}

// ─── Main export ───────────────────────────────────────────────────────────

/**
 * Converts a raw keystroke event array into a compact behavioral transcript
 * optimised for LLM analysis of typing patterns.
 *
 * @param keystrokesRef - Array of raw keystroke events captured during a typing session
 * @returns KeystrokeSummary with session metrics, per-word detail, and detected patterns
 */
export function convertKeystrokes(keystrokesRef: KeystrokeEvent[]): KeystrokeSummary {
  if (keystrokesRef.length === 0) {
    return {
      session: {
        total_events: 0, total_chars: 0, duration_ms: 0, wpm: 0,
        error_rate: 0, backspace_rate: 0, avg_interval_ms: 0,
        avg_word_start_gap: 0, pause_count: 0, word_count: 0,
      },
      words: [],
      patterns: [],
    }
  }

  const words    = segmentIntoWords(keystrokesRef)
  const session  = computeSessionMeta(keystrokesRef, words)
  const patterns = detectPatterns(words)

  return { session, words, patterns }
}

/**
 * Summarize keystrokes and log the summary as JSON.
 * Keystroke hooks can call this with `keyStrokesRef.current`.
 */
export function summarizeKeystrokes(keystrokesRef: KeystrokeEvent[]): KeystrokeSummary {
  const result = convertKeystrokes(keystrokesRef)
  try {
    console.log(JSON.stringify(result, null, 2))
  } catch (err) {
    // Fallback to simple log if circular or other issues
    console.log('Keystroke summary:', result)
  }
  return result
}

export default summarizeKeystrokes