import { heatMapData as buildHeatMapData } from '../Utility/heatMapData'

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
    const heatMapData = buildHeatMapData(keyStrokes, text)
    console.log('Character Time Data:', heatMapData)
    const threshold = text.length > 0
        ? ((keyStrokes[keyStrokes.length - 1].timeStamp - keyStrokes[0].timeStamp) / text.length) * 1.5
        : 0

    return(
        <div style={{backgroundColor: "white"}}>
            
        {heatMapData.map((item, index) => {

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
