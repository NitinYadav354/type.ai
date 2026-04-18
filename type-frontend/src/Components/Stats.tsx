type StatsProps = {
    status: string
    TimeTaken: number
    wpm: number
    accuracy: number
    accuracy2: number
    
}

const Stats = ({ status, TimeTaken, wpm, accuracy, accuracy2 }: StatsProps) => {
    return (
        <div>
        <p>{status}</p>
        <p>Time Taken: {TimeTaken} seconds</p>
        {status === 'completed' && <p>WPM : {wpm}</p>}
        {status === 'completed' && <p>Accuracy : {Math.round(accuracy)}</p>}
        {status === 'completed' && <p>Accuracy 2 : {Math.round(accuracy2)}</p>}
        {status === 'completed' && <p>Net WPM : {Math.round(wpm * (accuracy2/100))}</p>}
        {status === 'completed' && <p>CPM : {Math.round(wpm * 5)}</p>}
        </div>
    )
    
}

export default Stats