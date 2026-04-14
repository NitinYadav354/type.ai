import { useEffect, useRef, useState, type Key } from 'react'


function App() {
  const targetText = 'Hello, World! This is a typing test.'
  const [inputText, setInputText] = useState('')
  const [status, setStatus] = useState('idle')
  const [TimeTaken, setTimeTaken] = useState(0)
  const startTimeRef = useRef<number>(0);
  const finishTimeRef = useRef<number>(0);
  const [wpm, setWpm] = useState(0)

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
          startTimeRef.current = Date.now();
          console.log(startTimeRef.current)
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
      finishTimeRef.current = Date.now()
      console.log(finishTimeRef.current)
      console.log(finishTimeRef.current - startTimeRef.current)
      setTimeTaken((finishTimeRef.current - startTimeRef.current) / 1000)
      setWpm(Math.round((inputText.length / 5) / ((finishTimeRef.current - startTimeRef.current) / 60000)) || 0)

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
      <p>Time Taken: {TimeTaken} seconds</p>
      {status === 'completed' && <p>WPM : {wpm}</p>}
    </div>
  )

}

export default App
