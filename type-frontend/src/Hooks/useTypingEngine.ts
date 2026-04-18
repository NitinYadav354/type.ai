import { useEffect, useRef, useState} from 'react'

export default function useTypingEngine() {
    interface typingEvent {
        type : 'character',
        expectedChar : string,
        actualChar : string,
        timeStamp : number,
        isCorrect : boolean
    }

    interface controlEvent {
        type : 'Backspace',
        timeStamp : number
    }

    type keyStrokeData = typingEvent | controlEvent

    const targetText = 'Hello, World! This is a typing test'
    const [inputText, setInputText] = useState('')
    const [status, setStatus] = useState('idle')
    const [TimeTaken, setTimeTaken] = useState(0)
    // const startTimeRef = useRef<number>(0);
    // const finishTimeRef = useRef<number>(0);
    const backspacePressedRef = useRef<number>(0);
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const keyStrokesRef = useRef<keyStrokeData[]>([])

    const metricslogger = () => {
        console.log(keyStrokesRef.current)
        console.log(backspacePressedRef.current)
    }

useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (status === 'completed') return

        if (event.key === ' '){
        event.preventDefault()
        }

        if (event.key === 'Backspace') {
        setInputText((prev) => prev.slice(0, -1))
        backspacePressedRef.current += 1;
        keyStrokesRef.current.push({
            type: 'Backspace',
            timeStamp: Date.now()
        })
        return
        }
        
        if (event.key.length === 1) {
        if(status === 'idle') {
            setStatus('typing')
            // startTimeRef.current = Date.now();
 
        }

        const expectedChar = targetText[inputText.length]
        const timeStamp = Date.now()
        const isCorrect = event.key === expectedChar

        setInputText((prev) => prev + event.key)
        keyStrokesRef.current.push({
            type: 'character',
            expectedChar : expectedChar,
            actualChar: event.key,
            timeStamp : timeStamp,
            isCorrect : isCorrect
        })
    }


    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
    }, [status, inputText]);

    useEffect(() => {
    if (inputText === targetText && inputText.length > 0) {
        setStatus('completed')
        metricslogger()
    }
    }, [inputText, targetText])

    return {
        targetText,
        inputText,
        status,
        TimeTaken,
        wpm,
        accuracy
    }
}

