type TextDisplayProps = {
    inputText: string
    targetText: string
    isBlindMode: boolean
}

const TextDisplay = ({ inputText, targetText, isBlindMode }: TextDisplayProps) => {
    return (
        <div className="typing-area" style={{
            filter: isBlindMode ? 'blur(8px)' : 'none',
            opacity: isBlindMode ? 0.5 : 1,
            transition: 'all 0.3s ease'
        }}>
        <div style={{ fontSize: "1.5rem", lineHeight: "1.6", letterSpacing: "1px", whiteSpace: "pre-wrap" }}>
        <p>
            {targetText.split('').map((char, index) => {
            const typedchar = inputText[index]
            let color = '#6B7280'
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