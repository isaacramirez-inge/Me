import type { ChatRequest, ChatResponse } from "./ChatRequesterTypes";
import { getCookie } from "../../utils/cookies";
import axios from "axios";

const apiUrl = import.meta.env.PUBLIC_API_URL;
const apiKeyAuth = import.meta.env.PUBLIC_API_KEY_AUTH;

export const sendMessage = async (req: ChatRequest, captchaToken: string, captchaVersion: string): Promise<ChatResponse> => {
    const browserId = getCookie('browser_id');
    const lang = getCookie('lang');
    const headers = { 
        'x-api-key': apiKeyAuth,
        'x-captcha-token': captchaToken,
        'x-captcha-version': captchaVersion,
        'Content-Type': 'application/json'
    };
    const body = { ...req, browserId, lang };
    try{
        const response = await axios.post(`${apiUrl}/message`, body, { headers });
        if (![200, 201].includes(response.status)) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data as ChatResponse;
    }catch(error){
        throw error;
    }
}