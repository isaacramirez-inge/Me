import React, { useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import type { Translation } from '../../types/types';
import { getCookie } from '../../utils/cookies';

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
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const browserId = getCookie('browser_id');
    const lang = getCookie('lang');
    const data = { ...formData, browserId, lang };
    console.log('Form submitted:', data);
    // Handle form submission logic (e.g., sending data to a backend)
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const bg = 'bg-gray-900 bg-opacity-50';

  return (
    <>
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
          <ReCAPTCHA ref={captcha} sitekey="6Lfea6krAAAAAHZwEwR92Yec--iRCQ4TPjfO7tMQ" size="compact" theme="dark" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {t.contact.send_button}
        </button>
      </form>
        <input type="hidden" />
      <div id="success-message" className="text-center mt-8" style={{ display: 'none' }}>
        <h2 className="text-3xl font-bold text-green-400">{t.contact.success_title}</h2>
        <p>{t.contact.success_message} </p>
      </div> 
    </>
  );
};

export default ContactForm;
