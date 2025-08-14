
import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import type { Metrics } from '../assets/metrics/metrics';
import Lottie from 'react-lottie-player';
import botHi from '../assets/anim/bot-hi.json';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../styles/breakpoints';

interface Props {
    t: any;
    m: Metrics;
}

const SidebarContent: React.FC<Props> = ({ t, m }) => {
    const [viewChat, setViewChat] = useState<boolean>(true);
    const isMobile = useMediaQuery({ query: breakpoints.mobile });

    const handleChatStateChange = (isOpen: boolean) => {
        setViewChat(isOpen);
        window.dispatchEvent(new CustomEvent('chat-state-change', { detail: { isOpen, isMobile } }));
    }

    const onCloseChat = () => handleChatStateChange(false);
    const onOpenChat = () => handleChatStateChange(true);

    useEffect(() => {
        // Dispatch initial state on mount
        handleChatStateChange(viewChat);
    }, [isMobile, viewChat]);

    return (
    <>
        <Chat t={t} m={m} isVisible={viewChat} onCloseChat={onCloseChat}/>
        <div className={`main-bothi cursor-pointer z-50 h-40 w-40 fixed -left-8 top-3/4 transform transition-transform duration-500 ${!viewChat ? 'translate-x-0' : '-translate-x-full'}`}>
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
