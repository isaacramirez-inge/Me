
import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import type { Metrics } from '../assets/metrics/metrics';
import Lottie from 'react-lottie-player';
import botHi from '../assets/anim/bot-hi.json';

interface Props {
    t: any;
    m: Metrics;
}

const SidebarContent: React.FC<Props> = ({ t, m }) => {
    const [viewChat, setViewChat] = useState<boolean>(true);
    
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
        <Chat t={t} m={m} isVisible={viewChat} onCloseChat={onCloseChat}/>
        <div className={`main-bothi cursor-pointer z-500 h-40 w-40 fixed -left-8 top-3/4 transform transition-transform duration-500 ${!viewChat ? 'translate-x-0' : '-translate-x-full'}`}>
            {(() => { return(
            <Lottie
                loop
                animationData={botHi}
                play
                onClick={onOpenChat}
            />
            )})()}
        </div>
    </>
  );
}

export default SidebarContent;
