import { useEffect, useRef, useState} from 'react'
import { sendTelemetry } from '../Services/TelemeryAPI'
import { calculateMetrics } from '../Utility/calculateMetrics'
import clickSound from '../Assets/typeSound.mp3'
import summarizeKeystrokes from '../Utility/summary_keystrokes'

const playsound = () => {
    const audio = new Audio(clickSound)
    audio.play().catch((error) => {
        console.error("Error playing sound:", error)
    })
}


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

export default function useTypingEngine() {

    const targetText = 'I woke up early in the morning'
    const [inputText, setInputText] = useState('')
    const [status, setStatus] = useState('idle')
    const [TimeTaken, setTimeTaken] = useState(0)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const keyStrokesRef = useRef<keyStrokeData[]>([])

    const FinishTest = async () => {
        const metrics = calculateMetrics(keyStrokesRef.current, inputText)
        const {TimeTaken, wpm, accuracy} = metrics
        // Update States
        setTimeTaken(Math.round(TimeTaken))
        setWpm(Math.round(wpm))
        setAccuracy(Math.round(accuracy))

        const buildTelemetryPayload = sendTelemetry(metrics)
        console.log("keystrokes:", keyStrokesRef.current)
        console.log("Telemetry Payload:", buildTelemetryPayload)
        try {
            const summary = summarizeKeystrokes(keyStrokesRef.current)
            console.log('Keystroke Summary:', summary)
        } catch (err) {
            console.error('Failed to summarize keystrokes', err)
        }
    };
useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (status === 'completed') return

        if (event.key === ' '){
        event.preventDefault()
        }

        if (event.key === 'Backspace') {
        setInputText((prev) => prev.slice(0, -1))
        keyStrokesRef.current.push({
            type: 'Backspace',
            timeStamp: Date.now()
        })
        return
        }
        
        if (event.key.length === 1) {
        if(status === 'idle') {
            setStatus('typing')
 
        }
        playsound()
        
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
        FinishTest()
    }
    }, [inputText, targetText])

    return {
        targetText,
        inputText,
        status,
        TimeTaken,
        wpm,
        accuracy,
        keyStrokesRef: keyStrokesRef.current
    }
}

