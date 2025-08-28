import type { ChatRequest, ChatResponse } from "./ChatRequesterTypes";
import { getCookie } from "../../utils/cookies";
const apiUrl = import.meta.env.PUBLIC_API_URL;

export const sendMessage = async (req: ChatRequest): Promise<ChatResponse > => {
    const browserId = getCookie('browser_id');
    const lang = getCookie('lang');
    const body = { ...req, browserId, lang };

    const response = await fetch(`${apiUrl}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as ChatResponse;
}