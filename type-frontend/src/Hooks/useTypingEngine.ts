import { useEffect, useRef, useState, useMemo, useCallback} from 'react'
import { sendTelemetry } from '../Services/TelemeryAPI'
import { calculateMetrics } from '../Utility/calculateMetrics'
import textSamples from '../Assets/InputText.json'
import click1 from '../Assets/sounds/click1.mp3'
import click2 from '../Assets/sounds/click2.mp3'
import error from '../Assets/sounds/error.mp3'

const uniqueCategories = Array.from(new Set(textSamples.map(sample => sample.type)))

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
    const [length, setLength] = useState<string>('short')
    const [targetText, setTargetText] = useState("")
    const [inputText, setInputText] = useState('')
    const [status, setStatus] = useState('idle')
    const [TimeTaken, setTimeTaken] = useState(0)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const keyStrokesRef = useRef<keyStrokeData[]>([])
    const inputTextRef = useRef('')
    const previousTimeRef = useRef<number | null>(null)

    const [soundMode, setSoundMode] = useState<'mute' | 'click1' | 'click2'>('mute');
    const [enableErrorSound, setEnableErrorSound] = useState<boolean>(false);
    const [isBlindMode, setIsBlindMode] = useState<boolean>(false);

    const sound1Ref = useRef(new Audio(click1));
    const sound2Ref = useRef(new Audio(click2));
    const errorSoundRef = useRef(new Audio(error));

    const availableSubCategories = useMemo(() => {
        return category === 'all'
        ? []
        : Array.from(new Set(textSamples.filter(sample => sample.type === category)
        .map(sample => sample.subtype)))
    }, [category])

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

        sendTelemetry(metrics)
    };

    useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const activeTag = document.activeElement?.tagName;
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
        
        const expectedChar = targetText[inputTextRef.current.length]
        const now = Date.now()
        const time = previousTimeRef.current === null ? 0 : now - previousTimeRef.current
        const isCorrect = event.key === expectedChar

        if (soundMode !== 'mute') {
            if (!isCorrect && enableErrorSound) {
                errorSoundRef.current.pause();
                errorSoundRef.current.currentTime = 0;
                errorSoundRef.current.play().catch((error) => {
                console.error("Error playing error sound:", error);
                });
            } else if (soundMode === 'click1') {
                sound1Ref.current.currentTime = 0;
                sound1Ref.current.play().catch((error) => {});

            } else if (soundMode === 'click2') {
                sound2Ref.current.currentTime = 0;
                sound2Ref.current.play().catch((error) => {});
            }
        }

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
    }, [status, targetText, soundMode, enableErrorSound]);

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
        availableSubCategories,
        soundMode,
        setSoundMode,
        enableErrorSound,
        setEnableErrorSound,
        isBlindMode,
        setIsBlindMode
    }
}

