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

const TextHeatMap = ({keyStrokes, text} : {keyStrokes: KeyStrokeData[], text: string}) => {
    type CharTimeType = {
        char : string;
        time : number;
    };
    const charTime: CharTimeType[] = [];
    let x = 0;
    let prevTimestamp = keyStrokes[0]?.timeStamp || 0;
    for (let i = 0; i < text.length; i++) {
        while (x < keyStrokes.length) {
        const char = text[i]
        if (keyStrokes[x].type === 'character' && keyStrokes[x].actualChar === char){
            const currTimestamp = keyStrokes[x].timeStamp
            const timediff = currTimestamp - prevTimestamp
            charTime.push({
                char: char,
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
    console.log('Character Time Data:', charTime)

    return(
        <div style={{backgroundColor: "white"}}>
        {charTime.map((item, index) => {
            const threshold = ((keyStrokes[keyStrokes.length - 1].timeStamp - keyStrokes[0].timeStamp) / text.length) * 1.5;
            const ratio = Math.min(item.time / threshold, 1);
            const l = (1 - ratio) * 40 + 15; 
            console.log(l)
            return (
                <span key={index} style={{ color: `hsl(120, 100%, ${l}%)` }}>
                {item.char}
                </span>
            );
        })}
        </div>
    )
}


export default TextHeatMap
