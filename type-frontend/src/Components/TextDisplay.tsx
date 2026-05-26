type TextDisplayProps = {
    inputText: string
    targetText: string
}

const TextDisplay = ({ inputText, targetText }: TextDisplayProps) => {
    return (
        <div style={{
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#2c2e31',
            borderRadius: '8px',
            border: '1px solid #363636',
            width: '100%'
        }}>
        <div style={{ fontSize: "1.5rem", lineHeight: "1.6", letterSpacing: "1px" }}>
        <p>
            {targetText.split('').map((char, index) => {
            const typedchar = inputText[index]
            let color = '#646669'
            if (typedchar !== undefined) {
                if(typedchar === char) {
                color = '#d1d0c5'
                } else {
                    if (char === ' ') {
                        char = '␣'
                    }
                color = '#ca4754'
                }
            }

            const isCurrentChar = index === inputText.length

            return (
                <span key={index} className= {isCurrentChar ? 'cursor' : ''} style={{ color: color
                }}>
                {char}
                </span>    
            )
            })}
        </p>
        </div>
        </div>
    )

}

export default TextDisplay