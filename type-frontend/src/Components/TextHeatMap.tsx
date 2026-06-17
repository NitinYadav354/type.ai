import { heatMapData as buildHeatMapData } from '../Utility/heatMapData'

type TypingEvent = {
    type: 'character'
    expectedChar: string
    actualChar: string
    time: number
    isCorrect: boolean
}

type ControlEvent = {
    type: 'Backspace'
    time: number
}

type KeyStrokeData = TypingEvent | ControlEvent

const TextHeatMap = ({keyStrokes, text} : {keyStrokes: KeyStrokeData[], text: string}) => {
    if (!keyStrokes || keyStrokes.length < 2 || !text) return null;

    const heatMapData = buildHeatMapData(keyStrokes, text)
    
    const threshold = text.length > 0
        ? (keyStrokes.reduce((sum, event) => sum + (event.time ?? 0), 0) / text.length)
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

            <p className="title" style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '1.25rem' }}>Speed Variance Heatmap</p>
            {heatMapData.map((item, index) => {
                const ratio = ((item.time - threshold) / threshold);                
                const sat = (1- ratio) * 50;               
              
                const displayChar = item.char === ' ' ? '_' : item.char;

                return (
                    <span key={index} style={{ color: `hsl(120, ${sat}%, 65%)` }}>
                        {displayChar}
                    </span>
                );
            })}

            </div>
            <div className="heatmap-legend">
            </div>
            <div className="heatmap-legend-labels">
                <p className="slow">slow</p>
                <p className="fast">fast</p>
            </div>

        </div>
    )
}

export default TextHeatMap