import React from 'react'
import  {useAiCoach} from '../Hooks/useAiCoach'
import { optimiseKeystroke } from '../Utility/optimseKeystroke'

interface AiCoachCardProps {
  coachResponse: ReturnType<typeof useAiCoach>
  optimisedKeystroke: ReturnType<typeof optimiseKeystroke>
}

interface AiCoachResponse {
    headline: string
    strengths: string[]
    weaknesses: string[]
    insights: string[]
    focus: string
    practicePrompt: string
}


export const AiCoachCard = ({ coachResponse, optimisedKeystroke }: AiCoachCardProps) => {
  const { isLoading, aiCoachResponse, triggerAnalysis, hasFetched, resetCoach } = coachResponse
  return (
    <div className='AiCoachCard'>
      {!isLoading && !hasFetched && (
        <button onClick={() => triggerAnalysis(optimisedKeystroke)} className='AiCoachCard-button'>
          Analyze Keystrokes
        </button>
      )}
      {isLoading && <p>Analyzing...</p>}
      {hasFetched && (
        <div className='AiCoachCard-response'>
          <div className='AiCoachCard-headline'>{aiCoachResponse?.headline}</div>
          <div className='AiCoachCard-strengths'>
            {aiCoachResponse?.strengths.map((strength, index) => (
              <p key={index}>{strength}</p>
            ))}
          </div>

          <div className='AiCoachCard-weaknesses'>
            {aiCoachResponse?.weaknesses.map((weakness, index) => (
              <p key={index}>{weakness}</p>
            ))}
        </div>

        <div className='AiCoachCard-insights'>
          {aiCoachResponse?.insights.map((insights, index) => (
              <p key={index}>{insights}</p>
            ))}
        </div>

        <div className='AiCoachCard-focus'>
          {aiCoachResponse?.focus}
        </div>   
    </div>
  )}
      </div>
  )
}