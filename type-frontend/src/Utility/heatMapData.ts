type TypingEvent = {
    type: 'character',
    expectedChar: string,
    actualChar: string,
    time: number,
    isCorrect: boolean
}

type ControlEvent = {
    type: 'Backspace'
    time: number
}

type KeyStrokeData = TypingEvent | ControlEvent

type CharTimeType = {
    char: string
    time: number
}

export function heatMapData(keyStrokes: KeyStrokeData[], text: string): CharTimeType[] {
    const heatMap: CharTimeType[] = []
    let x = 0;
     for (const char of text) {
        while (x < keyStrokes.length) {
        if (keyStrokes[x].type === 'character' && (keyStrokes[x] as TypingEvent).actualChar === char){
            const timediff =(keyStrokes[x] as TypingEvent).time
            heatMap.push({
                char,
                time: timediff
            })
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