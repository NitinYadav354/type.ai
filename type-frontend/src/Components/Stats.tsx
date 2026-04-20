type StatsProps = {
    status: string
    TimeTaken: number
    wpm: number
    accuracy: number
    
}

const Stats = ({ status, TimeTaken, wpm, accuracy}: StatsProps) => {
    return (
        <div>
        <p>{status}</p>
        <p>Time Taken: {TimeTaken} seconds</p>
        {status === 'completed' && <p>WPM : {wpm}</p>}
        {status === 'completed' && <p>Accuracy : {Math.round(accuracy)}</p>}
        {status === 'completed' && <p>Net WPM : {Math.round(wpm * (accuracy/100))}</p>}
        {status === 'completed' && <p>CPM : {Math.round(wpm * 5)}</p>}
        </div>
    )
    
}

export default Stats