import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import type { Translation } from '../types/types';

interface CookieConsentProps {
    t: Translation;
    lang: string;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ t, lang }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = getCookie('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        const uuid = crypto.randomUUID();
        setCookie('cookie_consent', 'true', { expires: 365 });
        setCookie('browser_id', uuid, { expires: 365 });
        setCookie('lang', lang, { expires: 365 });
        setIsVisible(false);
    };

    const handlePolicy = () => {
        window.location.href = `policy-privacy`;
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
            <p className="mb-2">{t.cookies.message}</p>
            <div className="flex justify-end gap-2">
                <button onClick={handlePolicy} className="text-sm text-gray-400 hover:text-white">
                    {t.cookies.policy}
                </button>
                <button onClick={handleAccept} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
                    {t.cookies.accept}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
