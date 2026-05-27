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
    let sum = 0;
    let sumSat = 0;
    if (!keyStrokes || keyStrokes.length < 2 || !text) return null;

    const heatMapData = buildHeatMapData(keyStrokes, text)
    console.log('Character Time Data:', heatMapData)
    
    const threshold = text.length > 0
        ? ((keyStrokes[keyStrokes.length - 1].timeStamp - keyStrokes[0].timeStamp) / text.length)
        : 0

    return(
        <div style={{
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#2c2e31',
            borderRadius: '8px',
            border: '1px solid #363636',
            width: '100%'
        }}>
            <div style={{
                fontSize: '1.5rem',
                lineHeight: '1.6',
                letterSpacing: '1px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
            }}>

                
            {heatMapData.map((item, index) => {
                const ratio = ((item.time - threshold) / threshold);
                //sum of ratios
                sum += ratio;
                
                const sat = (1- ratio) * 50;
                sumSat += sat;
                console.log("RATIO: ", ratio, "sat:", sat, "char", item.char, "time:", item.time)
                console.log("SUM:", sum, "SUMSAT:", sumSat)
                
                const displayChar = item.char === ' ' ? '_' : item.char;

                return (
                    <span key={index} style={{ color: `hsl(120, ${sat}%, 65%)` }}>
                        {displayChar}
                    </span>
                );
            })}
            
            </div>
        </div>
    )
}

export default TextHeatMap