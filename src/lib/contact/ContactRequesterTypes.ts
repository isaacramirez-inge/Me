export interface EmailRequest {
    intl: string;
  name: string;
  email: string;
  message: string;
  captcha: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}