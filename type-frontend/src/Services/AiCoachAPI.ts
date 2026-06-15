import axios from "axios";
import type { OptimisedKeystroke } from "../Utility/optimseKeystroke";

const API_BASE_URL = import.meta.env.VITE_API_URL;
export const fetchAiCoachResponse = async (optimisedKeystrokes: OptimisedKeystroke[]) => {
    const response = await axios.post(`${API_BASE_URL}/api/coach`, { keystrokes: optimisedKeystrokes });
    console.log("API is called");
    return response.data;
}