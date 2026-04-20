import TextDisplay from './Components/TextDisplay'
import Stats from './Components/Stats'
import useTypingEngine from './Hooks/useTypingEngine'


function App() {

  const {
    targetText,
    inputText,
    status,
    TimeTaken,
    wpm,
    accuracy,
  } = useTypingEngine()


  return (
    <div style={{backgroundColor: "#363636", color: "white", height: "100vh", display: "flex", flexDirection: "column"}}>

      <TextDisplay inputText={inputText} targetText={targetText} />
      <Stats status={status} TimeTaken={TimeTaken} wpm={wpm} accuracy={accuracy} />
    </div>
  )

}

export default App
