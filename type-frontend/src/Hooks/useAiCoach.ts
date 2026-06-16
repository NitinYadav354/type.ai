import { useState, useCallback } from "react";
import type { OptimisedKeystroke } from "../Utility/optimseKeystroke";
import { fetchAiCoachResponse } from "../Services/AiCoachAPI";

interface AiCoachResponse {
    headline: string
    strengths: string[]
    weaknesses: string[]
    insights: string[]
    focus: string
    practicePrompt: string
}
export const useAiCoach = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [aiCoachResponse, setAiCoachResponse] = useState<AiCoachResponse | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const triggerAnalysis = useCallback(async (optimisedKeystoke: OptimisedKeystroke[]) => {
        if (isLoading || (hasFetched && !error)) return;
        setIsLoading(true);
        setHasFetched(true);
        setError(null);

        try {
            console.log("Triggering AI coach analysis");
            const response: AiCoachResponse = await fetchAiCoachResponse(optimisedKeystoke);
            setAiCoachResponse(response);
            console.log("AI Coach Response:", response);
        } catch (error) {
            console.error("Error fetching AI coach response:", error);
            setError("The AI Coach is currently offline or experiencing heavy traffic. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [hasFetched, isLoading]);

    const resetCoach = useCallback(() => {
        setAiCoachResponse(null);
        setHasFetched(false);
        setIsLoading(false);
        setError(null);
    }, [])
    return { isLoading, aiCoachResponse, triggerAnalysis, hasFetched, resetCoach, error };
};