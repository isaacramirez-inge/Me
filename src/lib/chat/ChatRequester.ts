import type { ChatRequest, ChatResponse } from "./ChatRequesterTypes";
const apiUrl = import.meta.env.PUBLIC_API_URL;

export const sendMessage = async (req: ChatRequest): Promise<ChatResponse > => {
    const response = await fetch(`${apiUrl}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as ChatResponse;
}