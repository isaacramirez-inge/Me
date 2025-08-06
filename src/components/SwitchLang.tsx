// src/components/SwitchLang.tsx
import React, { useEffect, useState } from 'react';

interface Lang {
  code: string;
  name: string;
}

interface SwitchLangProps {
  t: any; // Idealmente deberías tipar `t` si es posible
  langs: Lang[];
}

const SwitchLang: React.FC<SwitchLangProps> = ({ t, langs }) => {
  const [languages] = useState<Lang[]>(langs);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Cambio de idioma:', e.target.value);
    const newLang = e.target.value;
    const urlParts = window.location.href.split('/').slice(0, -1).join('/');
    window.location.href = `${urlParts}/${newLang}`;
  };

  return (
    <select
      name="lang"
      className="lang-select text-white bg-transparent"
      value={t._info.code}
      onChange={handleChange}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className='bg-transparent'>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default SwitchLang;
