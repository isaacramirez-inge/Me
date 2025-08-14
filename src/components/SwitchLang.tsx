// src/components/SwitchLang.tsx
import React, { useEffect, useState } from 'react';

interface Lang {
  code: string;
  name: string;
}

interface SwitchLangProps {
  actualCode: string;
  langs: Lang[];
}

const SwitchLang: React.FC<SwitchLangProps> = ({ actualCode, langs }) => {
  const [languages] = useState<Lang[]>(langs);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const newUrl = window.location.href.replace(actualCode, newLang);
    window.location.href = newUrl;
  };

  return (
    <select
      name="lang"
      className="bg-transparent flex justify-end font-bold text-white/80 cursor-pointer" style={{ textShadow: '0 0 10px #9f7aea, 0 0 20px #9f7aea' }}
      value={actualCode}
      onChange={handleChange}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className='text-black bg-transparent'>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default SwitchLang;
