type TypingEvent = {
    type: 'character'
    actualChar: string
    expectedChar: string
    timeStamp: number
    isCorrect: boolean
}

type ControlEvent = {
    type: 'Backspace'
    timeStamp: number
}

type KeyStrokeData = TypingEvent | ControlEvent

export function optimseKeystroke(keyStrokes: KeyStrokeData[]){
    const result = keyStrokes.reduce(
    (acc, curr, index) => {
        acc.actualChars.push(curr.type === 'character' ? curr.actualChar : 'Backspace');
        acc.expectedChars.push(curr.type === 'character' ? (curr as TypingEvent).expectedChar : 'Backspace');
        acc.time_taken.push(
            index === 0 ? 0 : curr.timeStamp - keyStrokes[index - 1].timeStamp
        );

        return acc;
    },
    {
        actualChars: [] as string[],
        expectedChars: [] as string[],
        time_taken: [] as number[]
    }
);
    console.log('New CharTIme data:', result);
    return result;
}

    