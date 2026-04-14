import { useEffect, useRef, useState} from 'react'



export default function useTypingEngine() {
    const targetText = 'Hello, World! This is a typing test'
    const [inputText, setInputText] = useState('')
    const [status, setStatus] = useState('idle')
    const [TimeTaken, setTimeTaken] = useState(0)
    const startTimeRef = useRef<number>(0);
    const finishTimeRef = useRef<number>(0);
    const backspacePressedRef = useRef<number>(0);
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [accuracy2, setAccuracy2] = useState(100)
    const missedKeyRef = useRef<Record<string, number>>({})
    const errorRef = useRef<number>(0)

useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (status === 'completed') return

        if (event.key === ' '){
        event.preventDefault()
        }

        if (event.key === 'Backspace') {
        setInputText((prev) => prev.slice(0, -1))
        backspacePressedRef.current += 1;
        return
        }
        
        if (event.key.length === 1) {
        if(status === 'idle') {
            setStatus('typing')
            startTimeRef.current = Date.now();
            console.log(startTimeRef.current)
        }
        setInputText((prev) => prev + event.key)
        const char = targetText[inputText.length]
        if (event.key !== char) {
            const currentCount = missedKeyRef.current[char] || 0
            missedKeyRef.current[char] = currentCount + 1
            console.log(missedKeyRef.current)
        }
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
        finishTimeRef.current = Date.now()
        console.log(finishTimeRef.current)
        console.log(finishTimeRef.current - startTimeRef.current)
        setTimeTaken((finishTimeRef.current - startTimeRef.current) / 1000)
        setWpm(Math.round((inputText.length / 5) / ((finishTimeRef.current - startTimeRef.current) / 60000)) || 0)
        setAccuracy((inputText.length - backspacePressedRef.current)/inputText.length * 100)
        for (const char in missedKeyRef.current) {
        errorRef.current += missedKeyRef.current[char]
        }
        console.log(errorRef.current)
        setAccuracy2((inputText.length - errorRef.current)/inputText.length * 100)
        errorRef.current = 0
        backspacePressedRef.current = 0
    }
    }, [inputText, targetText])

    return {
        targetText,
        inputText,
        status,
        TimeTaken,
        wpm,
        accuracy,
        accuracy2,
    }
}

