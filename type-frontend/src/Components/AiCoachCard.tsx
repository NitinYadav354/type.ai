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
      <h3 className='AiCoachCard-title'>TypeAI Coach</h3>
      {!isLoading && !hasFetched && (
        <button onClick={() => triggerAnalysis(optimisedKeystroke)} className='AiCoachCard-button'>
          Ask Coach
        </button>
      )}
      {isLoading && <p>Analyzing...</p>}
      {hasFetched && !isLoading && (
        <div className='AiCoachCard-response'>
          <h1>AI Analysis Report</h1>
          <div className='AiCoachCard-headline'>
            {aiCoachResponse?.headline}
          </div>

          <div className='AiCoachCard-insights'>
          <h3>Some insights for you</h3>
          {aiCoachResponse?.insights.map((insights, index) => (
              <p key={index}>{insights}</p>
            ))}
        </div>

          <div className='AiCoachCard-strengths'>
            <h3>What you're doing well</h3>
            {aiCoachResponse?.strengths.map((strength, index) => (
              <p key={index}>{strength}</p>
            ))}
          </div>

          <div className='AiCoachCard-weaknesses'>
            <h3>here I think you can improve</h3>
            {aiCoachResponse?.weaknesses.map((weakness, index) => (
              <p key={index}>{weakness}</p>
            ))}
        </div>

        <div className='AiCoachCard-focus'>
          <h3>Focus for your next practice</h3>
          {aiCoachResponse?.focus}
        </div>   
    </div>
  )}
      </div>
  )
}