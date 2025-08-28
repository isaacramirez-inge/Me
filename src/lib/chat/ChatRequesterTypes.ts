
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
}
export interface ChatRequest {
    userId: number;
    userUuid: string;
    chatId: number | null;
    chatUuid: string;
    intl: string;
    newMessages: ChatMessage[];
    noticed: boolean;
}
export interface ChatResponse {
    userUuid: string;
    userId: number;
    chatUuid: string; 
    chatId: number; 
    response: string;
    questions: string[];
    useCaptchaVersion: string;
    noticed: boolean;
    chatLimit: number;
    messagesLimit: number;
    chatUsage: number;
    messagesUsage: number;
    systemMessage?: string;
}
