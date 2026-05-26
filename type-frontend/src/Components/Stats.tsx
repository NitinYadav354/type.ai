type StatsProps = {
    status: string
    TimeTaken: number
    wpm: number
    accuracy: number
    
}

const Stats = ({ status, TimeTaken, wpm, accuracy}: StatsProps) => {
    return (
  <div style={{ 
    display: 'flex', 
    gap: '2rem',
    marginTop: '2rem',
    justifyContent: 'flex-start',
    opacity: status === 'completed' ? 1 : 0.4,
    transition: 'opacity 0.3s ease'
  }}>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#646669' }}>time</span>
      <span style={{ fontSize: '1.8rem', color: '#e2b714', fontWeight: 'bold' }}>{TimeTaken}s</span>
    </div>


    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#646669' }}>wpm</span>
      <span style={{ fontSize: '1.8rem', color: '#e2b714', fontWeight: 'bold' }}>{wpm}</span>
    </div>


    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#646669' }}>acc</span>
      <span style={{ fontSize: '1.8rem', color: '#e2b714', fontWeight: 'bold' }}>{Math.round(accuracy)}%</span>
    
    </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#646669' }}>Net WPM</span>
      <span style={{ fontSize: '1.8rem', color: '#e2b714', fontWeight: 'bold' }}>{Math.round(wpm*accuracy/100)}</span>
    </div>
  </div>
)
    
}

export default Stats