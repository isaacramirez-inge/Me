import axios from "axios";

const apiBaseUrl = import.meta.env.PUBLIC_API_URL
const apiKeyAuth = import.meta.env.PUBLIC_API_KEY_AUTH

export const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKeyAuth
    },
});
