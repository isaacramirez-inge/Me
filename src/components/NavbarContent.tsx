// src/components/NavbarContent.tsx
import React, { useEffect, useState } from 'react';
import SwitchLang from './SwitchLang';
import type { Metrics } from '../assets/metrics/metrics';
import type { MainCardData } from './_react/timeline/TimelineTypes';
import MenuRender from '../components/navbar/MenuRender';

const basePath = import.meta.env.PUBLIC_BASE_PATH || '';

interface SupLang{
    code: string;
    name: string;
}
interface link {
  show: boolean;
  name: string;
  path: string;
}

interface NavbarContentProps {
  t: any;
  m: Metrics;
  langs: SupLang[];
  links: link[];
}

const NavbarContent: React.FC<NavbarContentProps> = ({ t, m, links, langs }) => {
  const [chatPlaceholder, setChatPlaceholder] = useState<string>('Ask ChatGPT about me...');
  const [inOutControl, setInOutControl] = useState<{in: number | null, out: number | null}>({in: null, out: null});
  const [viewInputarea, setViewInputarea] = useState<boolean>(false);

 useEffect(() => {
    const handleVisible = (event: Event) => {
      const customEvent = event as CustomEvent<{ group: MainCardData, index: number }>;
      setChatPlaceholder(`Ask about my time at ${customEvent?.detail?.group?.company}...`);
      setInOutControl(prev => ({...prev, in: customEvent?.detail?.index}));
    };
    const handleHidden = (event: Event) => {
      const customEvent = event as CustomEvent<{ group: MainCardData, index: number }>;
      setInOutControl(prev => ({...prev, out: customEvent?.detail?.index}));
    };
    const handleSpacer = (event: Event) => {
      const customEvent = event as CustomEvent;
      if( customEvent?.detail){
        setInOutControl({in: null, out: null});
      }
    };
  
    window.addEventListener('maincard-visible', handleVisible);
    window.addEventListener('maincard-hidden', handleHidden);
    window.addEventListener('maincard-spacer-visible', handleSpacer);
    return () => {
      window.removeEventListener('maincard-visible', handleVisible);
      window.removeEventListener('maincard-hidden', handleHidden);
      window.removeEventListener('maincard-spacer-visible', handleSpacer);
    };
  }, []);

  useEffect(() => {
    if((inOutControl.in === null)){
        setViewInputarea(false);
      }
    else{
      setViewInputarea(true);
    }
  }, [inOutControl]);

  
  return (
    <>
      <div className="flex items-center justify-between">
      
        {/* Título o logo */}
        <div className="text-xl font-semibold">{t.navbar.this_is_me}</div>
       
        {/* Botón "Menu" visible solo en mobile */}
        <button
          id="menu-toggle"
          className="md:hidden text-sm border px-3 py-1 rounded"
          onClick={() => {
            const menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.toggle('hidden');
          }}
        >
          Menu
        </button>

        {/* Menú desktop */}
        <div className="hidden md:flex gap-4">
          <MenuRender links={links} base={basePath} lang={t._info.code} prefetch={false} />
          <SwitchLang actualCode={t._info.code} langs={langs} />
        </div>
      </div>

      {/* Menú mobile oculto por defecto */}
      <div id="mobile-menu" className="mt-4 flex-col gap-2 hidden md:hidden">
        <MenuRender links={links} base={basePath} lang={t._info.code} prefetch={false} />
        <SwitchLang actualCode={t._info.code} langs={langs} />
      </div>
    </>
  );
};

export default NavbarContent;
