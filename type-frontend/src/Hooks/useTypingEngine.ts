import { useEffect, useRef, useState, useMemo, useCallback} from 'react'
import { sendTelemetry } from '../Services/TelemeryAPI'
import { calculateMetrics } from '../Utility/calculateMetrics'
import clickSound from '../Assets/typeSound.mp3'
import textSamples from '../Assets/InputText.json'
import {optimiseKeystroke} from '../Utility/optimseKeystroke'

const playsound = () => {
    const audio = new Audio(clickSound)
    audio.play().catch((error) => {
        console.error("Error playing sound:", error)
    })
}

const uniqueCategories = Array.from(new Set(textSamples.map(sample => sample.type)))
console.log("Unique Categories:", uniqueCategories)


interface typingEvent {
    type : 'character',
    expectedChar : string,
    actualChar : string,
    time : number,
    isCorrect : boolean
}

interface controlEvent {
    type : 'Backspace',
    time : number
}

type keyStrokeData = typingEvent | controlEvent

export default function useTypingEngine() {

    const [category, setCategory] = useState<string>('natural_language')
    const [subCategory, setSubCategory] = useState<string>('all')
    const [length, setLength] = useState<string>('medium')
    const [targetText, setTargetText] = useState("")
    const [inputText, setInputText] = useState('')
    const [status, setStatus] = useState('idle')
    const [TimeTaken, setTimeTaken] = useState(0)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const keyStrokesRef = useRef<keyStrokeData[]>([])
    const inputTextRef = useRef('')
    const previousTimeRef = useRef<number | null>(null)

    const availableSubCategories = useMemo(() => {
        return category === 'all'
        ? []
        : Array.from(new Set(textSamples.filter(sample => sample.type === category)
        .map(sample => sample.subtype)))
    }, [category])

    console.log("Available Subcategories:", availableSubCategories)

    const generateNewText = useCallback(() => {
    let validTexts = textSamples;

    if (category !== 'all') {
        validTexts = validTexts.filter(item => item.type === category);
    }
    if (subCategory !== 'all') {
        validTexts = validTexts.filter(item => item.subtype === subCategory);
    }
    if (length !== 'all') {
        validTexts = validTexts.filter(item => item.length === length);
    }

    if (validTexts.length === 0) {
        validTexts = textSamples;
    }

  const randomIndex = Math.floor(Math.random() * validTexts.length);
  setTargetText(validTexts[randomIndex].text);

}, [category, subCategory, length]);

    useEffect(() => {
  generateNewText();
  setInputText('');
  setStatus('idle');
    keyStrokesRef.current = [];
    setTimeTaken(0);
    setWpm(0);
    setAccuracy(100);
    previousTimeRef.current = null;
    inputTextRef.current = '';
    
}, [generateNewText]);

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
            const optimisedKeystrokes = optimiseKeystroke(keyStrokesRef.current)
            console.log("Optimized Keystrokes:", optimisedKeystrokes)
        } catch (err) {
            console.error('Failed to summarize keystrokes', err)
        }
    };
    useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const activeTag = document.activeElement?.tagName;
        console.log('Key Pressed:', event.key, 'Active Element:', activeTag)
        if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'BUTTON'){
            if (event.key.length === 1 || event.key === ' ' || event.key === 'Backspace') {
                (document.activeElement as HTMLElement).blur();
                event.preventDefault();
            }
            else{
                return;
            }
        }
        if (status === 'completed') return

        if (event.key === ' '){
        event.preventDefault()
        }

        if (event.key === 'Backspace') {
        const now = Date.now()
        const time = previousTimeRef.current === null ? 0 : now - previousTimeRef.current
        setInputText((prev) => {
            const next = prev.slice(0, -1)
            inputTextRef.current = next
            return next
        })
        keyStrokesRef.current.push({
            type: 'Backspace',
            time : time
        })
        previousTimeRef.current = now
        return
        }
        
        if (event.key.length === 1) {
            if(status === 'idle') {
                setStatus('typing')

            }
        playsound()
        
        const expectedChar = targetText[inputTextRef.current.length]
        const now = Date.now()
        const time = previousTimeRef.current === null ? 0 : now - previousTimeRef.current
        const isCorrect = event.key === expectedChar

        setInputText((prev) => {
            const next = prev + event.key
            inputTextRef.current = next
            return next
        })
        keyStrokesRef.current.push({
            type: 'character',
            expectedChar : expectedChar,
            actualChar: event.key,
            time : time,
            isCorrect : isCorrect
        })
        previousTimeRef.current = now
        }

        if (event.key === 'Enter') {
            event.preventDefault()
            const expectedChar = targetText[inputTextRef.current.length]
            const now = Date.now()
            const time = previousTimeRef.current === null ? 0 : now - previousTimeRef.current
            const isCorrect = '\n' === expectedChar
            setInputText((prev) => {
                const next = prev + '\n'
                inputTextRef.current = next
                return next
            })
            keyStrokesRef.current.push({
                type: 'character',
                expectedChar : expectedChar,
                actualChar: '\n',
                time : time,
                isCorrect : isCorrect
            }) 
            previousTimeRef.current = now

        }
        if (event.key === 'Tab') {
            event.preventDefault()
            const expectedChar = targetText[inputTextRef.current.length]
            const now = Date.now()
            const time = previousTimeRef.current === null ? 0 : now - previousTimeRef.current
            const isCorrect = '\t' === expectedChar
            setInputText((prev) => {
                const next = prev + '\t'
                inputTextRef.current = next
                return next
            }
            )
            keyStrokesRef.current.push({
                type: 'character',
                expectedChar : expectedChar,
                actualChar: '\t',
                time : time,
                isCorrect : isCorrect
            })
            previousTimeRef.current = now
        }


    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
    }, [status, targetText]);

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
        keyStrokesRef: keyStrokesRef.current,
        category,
        setCategory,
        subCategory,
        setSubCategory,
        length,
        setLength,
        uniqueCategories: Array.from(uniqueCategories),
        availableSubCategories
    }
}

