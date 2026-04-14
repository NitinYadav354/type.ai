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
    accuracy2,
  } = useTypingEngine()


  return (
    <div>
      <TextDisplay inputText={inputText} targetText={targetText} />
      <Stats status={status} TimeTaken={TimeTaken} wpm={wpm} accuracy={accuracy} accuracy2={accuracy2} />
    </div>
  )

}

export default App
