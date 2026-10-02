import TextDisplay from './Components/TextDisplay'
import Stats from './Components/Stats'
import useTypingEngine from './Hooks/useTypingEngine'
import TextHeatMap from './Components/TextHeatMap'
import Auth from './Components/Auth'
import './App.css'
import { useAiCoach } from './Hooks/useAiCoach'
import {TestConfigBar } from './Components/TestConfigBar'
import { optimiseKeystroke } from './Utility/optimseKeystroke'
import { SoundConfig } from './Components/SoundConfig'
import axios from 'axios'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from './Components/Footer'
import { generateCustomText } from './Services/generateCustomText'
import Dashboard from './Components/Dashboard'

const AiCoachCard = lazy(() => import("./Components/AiCoachCard"));

function App() {

  useEffect(() => {
    const timer = setTimeout(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/ping`)
        .catch(() => {});
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


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
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dashboard view toggle state
  const [showDashboard, setShowDashboard] = useState(false);

  const handlePracticeWeaknesses = async (promptText: string) => {
    if (!promptText) return;
    
    setIsGenerating(true);
    try {
      const customText = await generateCustomText(promptText);

      resetTest(customText); 
      // Switch back to typing test automatically if practice text generated
      setShowDashboard(false); 
      
    } catch (error) {
    } finally {
      setIsGenerating(false);
    }
  };

 return (
  <div
    className="app"
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '10vh',
    }}
  >
    <main
      style={{
        width: '100%',
        maxWidth: '900px',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: '#818CF8', margin: 0 }}>Type.AI</h1>
            
            <div className="info-wrapper" tabIndex={0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="info-tooltip">
                <strong>Type.AI</strong> is a minimalist, high-performance typing engine with microscopic keystroke analytics and AI coaching. <br/><br/>
                It analyzes raw keystroke micro-timing to identify specific finger weaknesses, rhythmic inconsistencies, and trouble spots, then generates targeted practice paragraphs to stress-test your weaknesses.
              </div>
            </div>
          </div>
          <p style={{ color: '#646669', fontSize: '0.85rem', margin: '4px 0 0 0', fontWeight: 500 }}>
            Improve Typing Speed with AI Insights
          </p>
        </div>

        <Auth
          showDashboard={showDashboard}
          onToggleDashboard={() => setShowDashboard(!showDashboard)}
        />
      </div>

      {showDashboard ? (
        <Dashboard />
      ) : (
        <>
          <TestConfigBar
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            length={length}
            setLength={setLength}
            uniqueCategories={uniqueCategories}
            availableSubCategories={availableSubCategories}
          />

          <div className="typing-layout">
            <TextDisplay
              inputText={inputText}
              targetText={targetText}
              isBlindMode={isBlindMode}
            />

            <SoundConfig
              isBlindMode={isBlindMode}
              setIsBlindMode={setIsBlindMode}
              soundMode={soundMode}
              setSoundMode={setSoundMode}
              enableErrorSound={enableErrorSound}
              setEnableErrorSound={setEnableErrorSound}
              resetTest={resetTest}
            />
          </div>

          <Stats
            status={status}
            TimeTaken={TimeTaken}
            wpm={wpm}
            accuracy={accuracy}
          />

          {status === 'completed' && (
            <TextHeatMap
              keyStrokes={keyStrokesRef}
              text={inputText}
            />
          )}
        </>
      )}

      {!showDashboard && status === 'completed' && (
        <Suspense fallback={null}>
          <AiCoachCard
            coachResponse={coachStateData}
            optimisedKeystroke={optimiseKeystroke(keyStrokesRef)}
            onGeneratePractice={handlePracticeWeaknesses}
            isGenerating={isGenerating}
          />
        </Suspense>
      )}
    </main>

    <Footer />
  </div>
)
}

export default App
