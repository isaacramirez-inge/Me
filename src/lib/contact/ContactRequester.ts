import type { EmailRequest, EmailResponse } from "./ContactRequesterTypes";
import { getCookie } from "../../utils/cookies";
const API_URL = import.meta.env.PUBLIC_API_URL;

export const submitEmailMessage = async (req: EmailRequest): Promise<EmailResponse > => {
    const browserId = getCookie('browser_id');
    const lang = getCookie('lang');
    const body = { ...req, browserId, lang };

    const response = await fetch(`${API_URL}/api/email`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-captcha-response': req.captcha,
            'Autorization': 'Bearer 123'
            
        },
        body: JSON.stringify(body),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as EmailResponse;
}