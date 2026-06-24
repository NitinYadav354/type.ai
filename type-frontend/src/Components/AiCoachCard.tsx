import { useEffect, useState } from 'react'
import  {useAiCoach} from '../Hooks/useAiCoach'
import { optimiseKeystroke } from '../Utility/optimseKeystroke'
import LottiePlayer from './LottiePlayer'


interface AiCoachCardProps {
  coachResponse: ReturnType<typeof useAiCoach>
  optimisedKeystroke: ReturnType<typeof optimiseKeystroke>
  onGeneratePractice?: (promptText: string) => Promise<void>
  isGenerating?: boolean
}


const loadingPhrases = [
  "Reviewing your keystrokes...",
  "Looking at your trouble spots...",
  "Calculating finger speed...",
  "Drafting personalized feedback...",
  "Waking up the typing sensei..."
];


const AiCoachCard = ({ coachResponse, optimisedKeystroke, onGeneratePractice, isGenerating }: AiCoachCardProps) => {
  const { isLoading, aiCoachResponse, triggerAnalysis, hasFetched, resetCoach, error } = coachResponse
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
      if (!isLoading) {
        setPhraseIndex(0);
        return;
      }

      const intervalId = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2500);

      return () => clearInterval(intervalId);
    }, [isLoading]);

  return (
    <div className='AiCoachCard'>
      
      {!isLoading && !hasFetched && !error && (
        <button onClick={() => triggerAnalysis(optimisedKeystroke)} className='AiCoachCard-button'>
          See what your AI Coach thinks
        </button>
      )}

      {isLoading && (
        <div className="ai-coach-loading-container">
        <LottiePlayer style={{ width: 240, height: 240 }} />
          <p key={phraseIndex} className="animated-loading-text">
            {loadingPhrases[phraseIndex]}
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className='AiCoachCard-error'>
          <p className='AiCoachCard-errormessage'>{error}</p>
          <button onClick={() => { resetCoach(); triggerAnalysis(optimisedKeystroke); }} className='AiCoachCard-tryAgainbutton'>
            Try Again
          </button>          
        </div>
      )}

      {!error && hasFetched && !isLoading && (
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
            <h3>Here I think you can improve</h3>
            {aiCoachResponse?.weaknesses.map((weakness, index) => (
              <p key={index}>{weakness}</p>
            ))}
          </div>

          <div className='AiCoachCard-focus'>
            <h3>Focus for your next practice</h3>
            {aiCoachResponse?.focus}
          </div>   

          <div className="AiCoachCard-action-row" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              className="AiCoachCard-button"
              onClick={async () => {await onGeneratePractice?.(aiCoachResponse?.practicePrompt || '');
                resetCoach();
              }}
              disabled={isGenerating}
              style={{
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1
              }}
            >
              {isGenerating ? 'Generating Test...' : 'Practice Weaknesses'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AiCoachCard;