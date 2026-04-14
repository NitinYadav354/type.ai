type TextDisplayProps = {
    inputText: string
    targetText: string
}

const TextDisplay = ({ inputText, targetText }: TextDisplayProps) => {
    return (
        <div>
        <p>
            {targetText.split('').map((char, index) => {
            const typedchar = inputText[index]
            let color = 'grey'
            if (typedchar !== undefined) {
                if(typedchar === char) {
                color = 'green'
                } else {
                color = 'red'

                }
            }

            return (
                <span key={index} style={{ color: color, 
                borderLeft : index === inputText.length ? '2px solid black' : 'none',
                paddingLeft: '2px',
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