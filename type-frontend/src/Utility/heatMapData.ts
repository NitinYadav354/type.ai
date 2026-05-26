type TypingEvent = {
    type: 'character'
    actualChar: string
    timeStamp: number
    isCorrect: boolean
}

type ControlEvent = {
    type: 'Backspace'
    timeStamp: number
}

type KeyStrokeData = TypingEvent | ControlEvent

type CharTimeType = {
    char: string
    time: number
}

export function heatMapData(keyStrokes: KeyStrokeData[], text: string): CharTimeType[] {
    const heatMap: CharTimeType[] = []
    let x = 0;
    let prevTimestamp = keyStrokes[0]?.timeStamp || 0;
    for (let i = 0; i < text.length; i++) {
        while (x < keyStrokes.length) {
        const char = text[i]
        if (keyStrokes[x].type === 'character' && (keyStrokes[x] as TypingEvent).actualChar === char){
            const currTimestamp = (keyStrokes[x] as TypingEvent).timeStamp
            const timediff = currTimestamp - prevTimestamp
            heatMap.push({
                char,
                time: timediff
            })
            prevTimestamp = currTimestamp
            x++;
            break
        }
        else{
            x++;
        }
    }
    }
    return heatMap

}