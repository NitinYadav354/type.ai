import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const generateCustomText = async (prompt: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/coach/practice-text`, { practicePrompt: prompt });
        console.log('Custom text generated:', response.data);
        return response.data.practiceText;
    } catch (error) {
        console.error('Error generating custom text:', error);
        throw error;
    }
};