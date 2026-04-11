import { useEffect, useState, type Key } from 'react'


function App() {
  const targetText = 'Hello, World! This is a typing test.'
  const [inputText, setInputText] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (status === 'completed') return

      if (event.key === ' '){
        event.preventDefault()
      }

      if (event.key === 'Backspace') {
        setInputText((prev) => prev.slice(0, -1))
        return
      }
      
      if (event.key.length === 1) {
        if(status === 'idle') {
          setStatus('typing')
        }
        setInputText((prev) => prev + event.key)
      }


    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status]);

  useEffect(() => {
    if (inputText === targetText && inputText.length > 0) {
      setStatus('completed')
    }
  }, [inputText, targetText])


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
      <p>{status}</p>
    </div>
  )

}

export default App
