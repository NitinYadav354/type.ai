import { useState, useCallback } from "react";
import type { OptimisedKeystroke } from "../Utility/optimseKeystroke";
import { fetchAiCoachResponse } from "../Services/AiCoachAPI";

interface AiCoachResponse {
    headline: string
    strengths: string
    weaknesses: string[]
    insights: string[]
    focus: string
    practicePrompt: string
}
export const useAiCoach = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [aiCoachResponse, setAiCoachResponse] = useState<AiCoachResponse | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const triggerAnalysis = useCallback(async (optimisedKeystoke: OptimisedKeystroke[]) => {
        if (hasFetched || isLoading) {
            return;
        }
        setIsLoading(true);
        setHasFetched(true);

        try {
            const response: AiCoachResponse = await fetchAiCoachResponse(optimisedKeystoke);
            setAiCoachResponse(response);
        } catch (error) {
            console.error("Error fetching AI coach response:", error);
        } finally {
            setIsLoading(false);
        }
    }, [hasFetched, isLoading]);

    const resetCoach = useCallback(() => {
        setAiCoachResponse(null);
        setHasFetched(false);
        setIsLoading(false);
    }, [])
    return { isLoading, aiCoachResponse, triggerAnalysis, hasFetched, resetCoach };
};