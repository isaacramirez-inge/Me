import React, { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import type { Translation } from '../../types/types';
import { api } from '../../lib/axios';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Props {
  t: Translation;
}


const ContactForm: React.FC<Props> = ({t}) => {
    const captcha = useRef<ReCAPTCHA>(null);
    const [emptyCaptcha, setEmptyCaptcha] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const captchaToken = captcha.current?.getValue();
    if (!captchaToken) {
      setEmptyCaptcha(t.contact.empty_captcha);
      return;
    }

    const userId = parseInt(localStorage.getItem('user_id') || '0');
    const userUuid = localStorage.getItem('user_uuid') || crypto.randomUUID();
    const data = { 
      ...formData, 
      intl: t._info.code,
      userId: userId, 
      userUuid: userUuid,
      subject: t.contact.confirmation_subject,
      confirmMessage: {
        greeting: t.contact.confirmation_greeting,
        botIntro: t.contact.confirmation_bot_intro,
        messageReceived: t.contact.confirmation_message_received,
        delivered: t.contact.confirmation_delivered,
        thanks: t.contact.confirmation_thanks,
        footer: t.contact.confirmation_footer
      },
    };
    const headers = { 'x-captcha-token': captchaToken, 'x-captcha-version': '2' };
    await api.post('/contact', data, { headers }).then((response) => {
      const data = response.data;
      setFormData({ name: '', email: '', message: '' });
      setSuccessMessage(t.contact.success_message);
      localStorage.setItem('user_id', data.userId.toString());
      localStorage.setItem('user_uuid', data.userUuid);
    }).catch((error) => {
      console.log(error);
      setErrorMessage(t.contact.error_message);
    });
  };

  useEffect(() => {
    if (emptyCaptcha) {
      setTimeout(() => {
        setEmptyCaptcha('');
      }, 3000);
    }
  }, [emptyCaptcha]);

  const bg = 'bg-gray-900 bg-opacity-50';

  return (
    <>
    {successMessage ? (
      <div id="success-message" className="text-center mt-8">
        <h2 className="text-3xl font-bold text-white/80">{t.contact.success_title}</h2>
        <p className="text-white/80">{t.contact.success_message} </p>
      </div>
    ) : errorMessage ? (
      <div id="error-message" className="text-center mt-8">
        <h2 className="text-3xl font-bold text-red-500">{t.contact.error_message}</h2>
        <p className="text-white/80">{t.contact.error_message} </p>
      </div> 
    ) : (
      
      <form id="contact-form" onSubmit={handleSubmit} className="w-full max-w-md p-8 xs:bg-transparent rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">{t.contact.name_field}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full p-2 ${bg} rounded border border-white/20 focus:outline-none focus:border-white/50`}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">{t.contact.email_field}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full p-2 ${bg} rounded border border-white/20 focus:outline-none focus:border-white/50`}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2">{t.contact.message_field}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className={`w-full p-2 ${bg} rounded border border-white/20 focus:outline-none focus:border-white/50`}
          ></textarea>
        </div>
        <div className="mb-4 flex flex-wrap justify-center">
          {emptyCaptcha && <p className="text-red-500">{emptyCaptcha}</p>}
          <ReCAPTCHA 
            ref={captcha} 
            hl={t._info.code} 
            sitekey="6Lfea6krAAAAAHZwEwR92Yec--iRCQ4TPjfO7tMQ" 
            size="compact" 
            theme="dark" 
            onLoad={() => setEmptyCaptcha('')}
            onExpired={() => setEmptyCaptcha(t.contact.empty_captcha)}
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {t.contact.send_button}
        </button>
      </form>
    )}
    </>
  );
};

export default ContactForm;
