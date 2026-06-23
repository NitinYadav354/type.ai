type StatsProps = {
    status: string
    TimeTaken: number
    wpm: number
    accuracy: number
    
}

const Stats = ({ status, TimeTaken, wpm, accuracy}: StatsProps) => {
  const displayStatus = status === 'idle' ? '🔴' : '🟢';
    return (
  <div style={{ 
    display: 'flex', 
    gap: '2rem',
    marginTop: '2rem',
    justifyContent: 'center',
    opacity: status === 'completed' ? 1 : 0.4,
    transition: 'opacity 0.3s ease'
  }}>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span className={status=='typing' ? 'typing' : ''} style={{fontSize: '1.5rem', marginTop: '18px', marginRight: '30px'}}>{displayStatus}</span>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Time</span>
      <span style={{ fontSize: '1.8rem', color: '#818CF8', fontWeight: 'bold' }}>{TimeTaken}s</span>
    </div>


    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>WPM</span>
      <span style={{ fontSize: '1.8rem', color: '#818CF8', fontWeight: 'bold' }}>{wpm}</span>
    </div>


    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Accuracy</span>
      <span style={{ fontSize: '1.8rem', color: '#818CF8', fontWeight: 'bold' }}>{Math.round(accuracy)}%</span>
    
    </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Net WPM</span>
      <span style={{ fontSize: '1.8rem', color: '#818CF8', fontWeight: 'bold' }}>{Math.round(wpm*accuracy/100)}</span>
    </div>
  </div>
)
    
}

export default Stats