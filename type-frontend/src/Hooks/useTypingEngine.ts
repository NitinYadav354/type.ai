import { useEffect, useRef, useState} from 'react'
import {getOrCreateGuestID} from '../Utility/userGuestID'


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

    const targetText = 'I woke up early in the morning'
    const [inputText, setInputText] = useState('')
    const [status, setStatus] = useState('idle')
    const [TimeTaken, setTimeTaken] = useState(0)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const keyStrokesRef = useRef<keyStrokeData[]>([])

    const calculateMetrics = () => {
        // Calculate Time Taken
        const TimeTaken = (Date.now() - keyStrokesRef.current[0].timeStamp)/1000

        // Calculate WPM
        const wordsTyped = inputText.length / 5
        const wpm = wordsTyped / (TimeTaken/60)
        console.log('WPM:', wpm)    

        // Calculate Accuracy
        let error = 0
        const missedKeysMap: Record<string, number> = {}
        for (const event of keyStrokesRef.current) {
            if (event.type === 'character' && !event.isCorrect) {
                error++
                missedKeysMap[event.expectedChar] = (missedKeysMap[event.expectedChar] || 0) + 1
            }         
        }
        const accuracy = Math.max(((inputText.length - error) / inputText.length) * 100, 0)

        //Hesitation Metric
        const startTime = keyStrokesRef.current[0].timeStamp
        const endTime = keyStrokesRef.current[keyStrokesRef.current.length - 1].timeStamp
        const hesitationTimeThreshold = ((endTime - startTime) / (keyStrokesRef.current.length -1)) * 2


        let hesitationTime = 0
        const hesitationMap: Record<string, number> = {};
        for (let i = 1; i < keyStrokesRef.current.length; i++) {
            const prevEvent = keyStrokesRef.current[i - 1]
            const currentEvent = keyStrokesRef.current[i]
            const timeDiff = currentEvent.timeStamp - prevEvent.timeStamp
            if (timeDiff > hesitationTimeThreshold) {
                hesitationTime += timeDiff - hesitationTimeThreshold

                if (currentEvent.type === 'character') {
                    const expected = currentEvent.expectedChar;
                    hesitationMap[expected] = (hesitationMap[expected] || 0) + 1;
                }
            }
        }
        const hesitationTimesec = Math.round(hesitationTime / 10)/100 
        console.log('Hesitation Time Threshold (ms):', hesitationTimeThreshold)
        console.log('Hesitation Time (s):', hesitationTimesec)
        console.log('Hesitation Map:', hesitationMap)


        // Update States
        setTimeTaken(Math.round(TimeTaken))
        setWpm(Math.round(wpm))
        setAccuracy(Math.round(accuracy))

        //build session payload
        const sessionPayload = {
        userId: getOrCreateGuestID(),
        timestamp: new Date().toISOString(),
        testConfig: {
            language: "english",
            timeLimit: TimeTaken,
        },
        macroscopicMetrics: {
            wpm: Math.round(wpm),
            accuracy: Math.round(accuracy)
        },
        microscopicMetrics: {
            totalHesitationTimeMs: Math.round(hesitationTime),
            problemKeys: hesitationMap,
            missedKeys: missedKeysMap
        }
    };

    console.log("FINAL SESSION PAYLOAD:", sessionPayload);
    }
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
        calculateMetrics()
        for (const event of keyStrokesRef.current) {
            if (event.type === 'character') {
                console.log(event.actualChar, event.timeStamp - keyStrokesRef.current[0].timeStamp)
            }
            else{
                console.log('BS', event.timeStamp - keyStrokesRef.current[0].timeStamp)
            }
        }
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

