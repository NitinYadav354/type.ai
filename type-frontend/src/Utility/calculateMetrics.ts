export function calculateMetrics(keyStrokes: any[], inputText: string) {
    // Calculate Time Taken
    const totalTimeMs = keyStrokes.reduce((sum, event) => sum + (event.time ?? 0), 0)
    const TimeTaken = Math.round(totalTimeMs / 1000)

    // Calculate WPM
    const wordsTyped = inputText.length / 5
    const wpm = TimeTaken > 0 ? Math.round(wordsTyped / (TimeTaken / 60) * 100) / 100 : 0
    console.log('WPM:', wpm)    
    
    // Calculate Accuracy
    let error = 0
    const missedKeysMap: Record<string, number> = {}
    for (const event of keyStrokes) {
        if (event.type === 'character' && !event.isCorrect) {
            error++
            missedKeysMap[event.expectedChar] = (missedKeysMap[event.expectedChar] || 0) + 1
        }         
    }
    const accuracy = Math.max(((inputText.length - error) / inputText.length) * 100, 0)

    //Hesitation Metric
    const intervals = keyStrokes.slice(1).map((event) => event.time ?? 0)
    const averageInterval = intervals.length
        ? intervals.reduce((sum, value) => sum + value, 0) / intervals.length
        : 0
    const hesitationTimeThreshold = averageInterval * 2


    let hesitationTime = 0
    const hesitationMap: Record<string, number> = {};
    for (let i = 1; i < keyStrokes.length; i++) {
        const currentEvent = keyStrokes[i]
        const timeDiff = currentEvent.time ?? 0
        if (timeDiff > hesitationTimeThreshold) {
            hesitationTime += timeDiff - hesitationTimeThreshold

            if (currentEvent.type === 'character') {
                const expected = currentEvent.expectedChar;
                hesitationMap[expected] = (hesitationMap[expected] || 0) + 1;
            }
        }
    }
    const hesitationTimesec = Math.round(hesitationTime / 10)/100 
    console.log('Hesitation Time Threshold (ms):', hesitationTimeThreshold)
    console.log('Hesitation Time (s):', hesitationTimesec)
    console.log('Hesitation Map:', hesitationMap)

    return {
    TimeTaken,
    wpm,
    accuracy,
    hesitationTimesec,
    hesitationMap,
    missedKeysMap
}
}

