import React from "react"

type TextDisplayProps = {
    inputText: string
    targetText: string
}

const TextDisplay = ({ inputText, targetText }: TextDisplayProps) => {
    return (
        <div style={{ fontSize: "1.5rem", lineHeight: "1.6", letterSpacing: "1px" }}>
        <p>
            {targetText.split('').map((char, index) => {
            const typedchar = inputText[index]
            let color = 'grey'
            if (typedchar !== undefined) {
                if(typedchar === char) {
                color = 'green'
                } else {
                    if (char === ' ') {
                        char = '␣'
                    }
                color = 'red'
                }
            }

            const isCurrentChar = index === inputText.length

            return (
                <span key={index} className= {isCurrentChar ? "cursor" : ""} style={{ color: color, transition: 'color 0.3s'
                }}>
                {char}
                </span>    
            )
            })}
        </p>
        </div>
    )

}

export default TextDisplay