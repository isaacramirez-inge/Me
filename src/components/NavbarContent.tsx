// src/components/NavbarContent.tsx
import React, { useEffect, useState } from 'react';
import SwitchLang from './SwitchLang'; // O ajusta el path si está en Astro
import Chat from './Chat';
import type { Metrics } from '../assets/metrics/metrics';
import Lottie from 'react-lottie-player';
import type { MainCardData } from './_react/timeline/TimelineTypes';
import botHi from '../assets/anim/bot-hi.json';


interface SupLang{
    code: string;
    name: string;
}

interface NavbarContentProps {
  t: any;
  m: Metrics;
  langs: SupLang[];
}

const NavbarContent: React.FC<NavbarContentProps> = ({ t, m, langs }) => {
  const [chatPlaceholder, setChatPlaceholder] = useState<string>('Ask ChatGPT about me...');
  const [inOutControl, setInOutControl] = useState<{in: number | null, out: number | null}>({in: null, out: null});
  const [viewInputarea, setViewInputarea] = useState<boolean>(false);
  const [viewChat, setViewChat] = useState<boolean>(true);

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

  const onCloseChat = () => {
    setViewChat(false);
    window.dispatchEvent(new CustomEvent('mainchat-visible', { detail: false }));
  }
  const onOpenChat = () => {
    setViewChat(true);
    window.dispatchEvent(new CustomEvent('mainchat-visible', { detail: true }));
  }
  
  return (
    <>
      <div className="flex items-center justify-between">
      {viewChat && <Chat t={t} m={m} onCloseChat={onCloseChat}/>}
      {!viewChat && (
        <div className="main-bothi cursor-pointer h-40 w-40 fixed -left-8 top-3/4 transform  ">
           {(() => { return(
            <Lottie
              loop
              animationData={botHi}
              play
              onClick={onOpenChat}
            />
            )})()}
        </div>
      )}

      
        {/* Título o logo */}
        <div className="text-xl font-semibold">{t.navbar.this_is_me}</div>
        {viewInputarea &&
          <div className="open-chat flex items-center gap-4">
              <div className="wanna"><p>&nbsp;</p></div>
              <input type="text" name="activate-chat" 
              id="activate-chat"
              placeholder={chatPlaceholder}
              className='bg-transparent border border-white rounded px-2 py-1'/>
          </div>
        }
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
          <div className="menu">Home</div>
          <div className="menu">Skills</div>
          <div className="menu">Projects</div>
          <div className="menu">Profile</div>
          <div className="menu">Contact</div>
          <SwitchLang t={t} langs={langs}/>
        </div>
      </div>

      {/* Menú mobile oculto por defecto */}
      <div id="mobile-menu" className="mt-4 flex-col gap-2 hidden md:hidden">
        <div className="menu">Home</div>
        <div className="menu">Skills</div>
        <div className="menu">Projects</div>
        <div className="menu">Profile</div>
        <div className="menu">Contact</div>
        <SwitchLang t={t} langs={langs} />
      </div>
    </>
  );
};

export default NavbarContent;
