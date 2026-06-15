import TextDisplay from './Components/TextDisplay'
import Stats from './Components/Stats'
import useTypingEngine from './Hooks/useTypingEngine'
import TextHeatMap from './Components/TextHeatMap'
import Auth from './Components/Auth'
import './App.css'
import { useAiCoach } from './Hooks/useAiCoach'
import { AiCoachCard } from './Components/AiCoachCard'
import { optimiseKeystroke } from './Utility/optimseKeystroke'

function App() {

  const {
    targetText,
    inputText,
    status,
    TimeTaken,
    wpm,
    accuracy,
    keyStrokesRef
  } = useTypingEngine()

const coachStateData = useAiCoach();

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
      <TextDisplay inputText={inputText} targetText={targetText} />
      <Stats status={status} TimeTaken={TimeTaken} wpm={wpm} accuracy={accuracy} />
      {status === 'completed' && <TextHeatMap keyStrokes={keyStrokesRef} text={inputText} />}
    </div>
    {status ==='completed' && <AiCoachCard coachResponse={coachStateData} optimisedKeystroke={optimiseKeystroke(keyStrokesRef)}/>}
    </div>
  )

}

export default App
