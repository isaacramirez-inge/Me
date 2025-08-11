
type QuoteState = 'free' | 'full' | 'unknown';
type Provider = 'gemini' | 'openai' | 'meta' | 'deepseek' | 'antropic' | 'qwen' | 'xai';
type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro';
type OpenAiModel = 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-5' | 'gpt-4';
type MetaModel = 'Llama-4-Maverick-17B-128E-Instruct-FP8' | 'Llama-3.3-70B-Instruct';
type DeepSeekModel = 'r1'; 
type AntropicModel = 'claude';
type QwenModel = 'qwen-7b-chat' | 'qwen-7b-turbo';
type XaiModel = 'grok-4';
// Combined type for all model names
export type ModelName = GeminiModel | OpenAiModel | MetaModel | DeepSeekModel | AntropicModel | QwenModel | XaiModel;

export interface ModelState {
    name: ModelName; // Use the combined ModelName type
    quote: QuoteState;
    code: number;
}
export interface ModelUsage {
    provider: Provider;
    models: ModelState[];
}

export const initialModelUsage: ModelUsage[] = [
    {provider: 'gemini', models: [
        { name: 'gemini-2.5-flash' as GeminiModel, quote: 'free', code: 1 },
        { name: 'gemini-2.5-pro' as GeminiModel, quote: 'free', code: 2 }
    ]},
    {provider: 'openai', models: [
        { name: 'gpt-5-mini' as OpenAiModel, quote: 'free', code: 1 },
        { name: 'gpt-5-nano' as OpenAiModel, quote: 'free', code: 2 },
        { name: 'gpt-5' as OpenAiModel, quote: 'free', code: 3 },
        { name: 'gpt-4' as OpenAiModel, quote: 'free', code: 4 }
    ]}
]

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
export interface SuggestedQuestion{
    question: string;
    taken: boolean;
}
export interface ChatRequest {
    uuid: string;
    intl: string;
    modelUsage: Record<Provider, ModelState[]> ,
    messages: ChatMessage[];
    suggestedQuestions: SuggestedQuestion[];
}
export interface ChatResponse {
    uuid: string;
    response: string;
    q1: string;
    q2: string;
    modelUsage: Record<Provider, ModelState[]>;
}
