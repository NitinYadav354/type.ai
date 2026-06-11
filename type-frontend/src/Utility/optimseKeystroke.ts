type TypingEvent = {
    type: 'character'
    actualChar: string
    expectedChar: string
    time: number
    isCorrect: boolean
}

type ControlEvent = {
    type: 'Backspace'
    time: number
}

type KeyStrokeData = TypingEvent | ControlEvent

export function optimiseKeystroke(events: KeyStrokeData[]) {
  return events.map(e => {
    if (e.type === "Backspace") return { b: e.time }
    if (e.isCorrect)            return { c: e.actualChar, t: e.time }
    return { c: e.actualChar, x: e.expectedChar, t: e.time }
  })
}

    