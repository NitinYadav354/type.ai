import TextDisplay from './Components/TextDisplay'
import Stats from './Components/Stats'
import useTypingEngine from './Hooks/useTypingEngine'
import TextHeatMap from './Components/TextHeatMap'
import Auth from './Components/Auth'
import './App.css'
import { useAiCoach } from './Hooks/useAiCoach'
import { AiCoachCard } from './Components/AiCoachCard'
import {TestConfigBar } from './Components/TestConfigBar'
import { optimiseKeystroke } from './Utility/optimseKeystroke'
import { SoundConfig } from './Components/SoundConfig'
import axios from 'axios'
import { useEffect } from 'react'
import { Footer } from './Components/Footer'

function App() {

  const {
    targetText,
    inputText,
    status,
    TimeTaken,
    wpm,
    accuracy,
    keyStrokesRef,
    category, setCategory,
    subCategory, setSubCategory,
    length, setLength,
    uniqueCategories,
    availableSubCategories,
    soundMode, setSoundMode,
    enableErrorSound, setEnableErrorSound,
    isBlindMode, setIsBlindMode,
    resetTest
  } = useTypingEngine()

const coachStateData = useAiCoach();

  useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/ping`)
      .catch(() => {});
    }, []);

  return (
    <div className="app"
     style = {{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '10vh',
    }}>
      <div style = {{
        width: "100%", maxWidth: "900px", padding: "0 20px"
      }}>
      <div style = {{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ color: "#818CF8", margin: 0 }}>Type.AI</h1>
      <Auth />
      </div>
      <TestConfigBar category={category} setCategory={setCategory} subCategory={subCategory} setSubCategory={setSubCategory} length={length} setLength={setLength} uniqueCategories={uniqueCategories} availableSubCategories={availableSubCategories} />

      <div className="typing-layout">
      
      <TextDisplay inputText={inputText} targetText={targetText} isBlindMode={isBlindMode} />
      <SoundConfig isBlindMode={isBlindMode} setIsBlindMode={setIsBlindMode} soundMode={soundMode} setSoundMode={setSoundMode} enableErrorSound={enableErrorSound} setEnableErrorSound={setEnableErrorSound} resetTest={resetTest} />
      </div>
      <Stats status={status} TimeTaken={TimeTaken} wpm={wpm} accuracy={accuracy} />
      {status === 'completed' && <TextHeatMap keyStrokes={keyStrokesRef} text={inputText} />}
    </div>
    {status ==='completed' && <AiCoachCard coachResponse={coachStateData} optimisedKeystroke={optimiseKeystroke(keyStrokesRef)}/>}
    <Footer />
    </div>
  )

}

export default App
