import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BiSend, BiTrash, BiX } from 'react-icons/bi';
import type { ChatMessage, ChatRequest, ChatResponse } from '../lib/chat/ChatRequesterTypes';
import { sendMessage } from '../lib/chat/ChatRequester';
import RenderJsonLottie from '../components/_react/RenderJsonLottie';
import botAnim from '../assets/anim/bot.json';
import bubbleBot from '../assets/anim/bot-bubble.json';
import type { Metrics } from '../assets/metrics/metrics';
import type { Translation } from '../types/types';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../styles/breakpoints';
import BotBubbleDispatcher from './bot/BotBubbleDispatcher';
import ReCAPTCHA from "react-google-recaptcha";
import hammer from 'hammerjs';
import { api } from '../lib/axios';

const V3_CAPTCHA = import.meta.env.PUBLIC_RECAPTCHA_V3_KEY;
const V2_CAPTCHA = import.meta.env.PUBLIC_RECAPTCHA_V2_KEY;
const BASE_PATH = import.meta.env.PUBLIC_BASE_PATH;

interface ChatProps {
  t: Translation;
  m: Metrics;
  isChatVisible: boolean;
  onCloseChat: () => void;
}

const Chat: React.FC<ChatProps> = ({ onCloseChat, t, isChatVisible }) => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const [chatUsage, setChatUsage] = useState<number>(0);
  const [chatLimit, setChatLimit] = useState<number>(Infinity);
  const [messagesUsage, setMessagesUsage] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(Infinity);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [beforeDisplaySuggestions, setBeforeDisplaySuggestions] = useState<string[]>([]);
  const [fullResponseContent, setFullResponseContent] = useState<string>('');
  const [displayedResponseContent, setDisplayedResponseContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [errorChating, setErrorChating] = useState<any>(null);
  const bubbleBotGuideRef = useRef<HTMLDivElement | null>(null);
  const bubbleBotRef = useRef<HTMLDivElement | null>(null);
  const bubbleBotRef2 = useRef<HTMLDivElement | null>(null);
  const [redrawCounter, setRedrawCounter] = useState<number>(0);
  const [redrawCounter2, setRedrawCounter2] = useState<number>(0);
  const captcha = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [captchaVersion2] = useState<string>('2');
  const [captchaVersion3] = useState<string>('3');
  const [captchaVersion, setCaptchaVersion] = useState<string>(captchaVersion3);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [captcha2Node, setCaptcha2Node] = useState<React.ReactNode | null>(null);
  const [noticed, setNoticed] = useState<boolean>(false);
  const mainchat = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const savedChat = localStorage.getItem('chat_history');
    const savedChatId = localStorage.getItem('chat_id');

    if (savedChat && savedChatId) {
      const chat = JSON.parse(savedChat);
      setChat(chat);
      setMessagesUsage(chat.length);
    }
  }, []);

  useEffect(() => {
    const mainchatDiv = mainchat.current;
    if (mainchatDiv) {
      const mc = new Hammer.Manager(mainchatDiv);
      mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      mc.on('panleft', () => {
        onCloseChat();
      });
      return () => {
        mc.destroy();
      };
    }
  }, [onCloseChat]);

  const onCaptcha2Resolved = () => {
    bubbleBotRef2.current?.classList.add('hidden');
    bubbleBotRef2.current?.classList.remove('flex');
    if (pendingMessage) {
      handleSend(pendingMessage);
    }
  };
  const onCaptcha2Expired = () => {
    bubbleBotRef.current?.classList.add('flex');
    bubbleBotRef.current?.classList.remove('hidden');
  };

  useEffect(() => {
    if (captchaVersion === captchaVersion2) {
      setCaptcha2Node(captchaWidgetV2());
      bubbleBotRef2.current?.classList.add('flex');
      bubbleBotRef2.current?.classList.remove('hidden');
    } else {
      setCaptcha2Node(null);
    }
  }, [captchaVersion]);


  const fetchInitialSuggestions = async (): Promise<string[]> => {
    try {
      /*
        const captchaToken = await captcha?.current?.executeAsync();
        const headers = {
            'x-captcha-token': captchaToken || '',
            'x-captcha-version': '3',
        };
        const userId = parseInt(localStorage.getItem('user_id') || '');
        const response = await api.post('/initial-questions', { intl: t._info.code, userId }, { headers });
        localStorage.setItem('user_id', response.data.userId);
        const questions = response.data.questions as string[];
        saveLastQuestions(questions);
        */
        return []; 
    } catch (error) {
        console.log('Error retrieving initial questions', error);
        return [];
    }
}

  useEffect( () => {
    recoverLastQuestions().then((questions) => {
      if (questions.length > 0) {
        setSuggestions(questions);
      } else {
        fetchInitialSuggestions().then((questions) => {
          //setSuggestions(questions);
        });
      }
    });
  }, []);


  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const RUTA_SONIDO_TECLEO = `/${BASE_PATH}/sounds/key2.mp3`;

  useEffect(() => {
    audioRef.current = new Audio(RUTA_SONIDO_TECLEO);
    audioRef.current.volume = 0.1;
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    if (!fullResponseContent) {
      setDisplayedResponseContent('');
      return;
    }

    const words = fullResponseContent.split(' ').filter(word => word.length > 0);
    let wordIndex = 0;
    setDisplayedResponseContent('');

    const typeNextWord = () => {
      if (wordIndex >= words.length) {
        setSuggestions(beforeDisplaySuggestions);
        setChat(prevChat => {
          const newChat = [...prevChat];
          if (newChat.length > 0 && newChat[newChat.length - 1].role === 'assistant') {
            newChat[newChat.length - 1].content = fullResponseContent;
          }
          return newChat;
        });
        setIsStreaming(false);
        return;
      }

      setDisplayedResponseContent(words.slice(0, wordIndex + 1).join(' '));

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Error al reproducir audio:", e));
      }

      scrollToBottom();
      wordIndex++;

      const typingSpeed = 100;
      timerIdRef.current = setTimeout(typeNextWord, typingSpeed);
    };

    timerIdRef.current = setTimeout(typeNextWord, 0);

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [fullResponseContent]);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chat));
    scrollToBottom();
  }, [chat]);

  const handleSend = async (text: string) => {
    if (!text) return;
    if (chat.length >= messagesLimit || chatUsage >= chatLimit) {
      setRedrawCounter(prev => prev + 1);
      return;
    }
    const token = { value: '' };
    if (captchaVersion === captchaVersion3) {
      const tokenv3 = await captcha?.current?.executeAsync();
      token.value = tokenv3 as string;
    } else if (captchaVersion === captchaVersion2) {
      const tokenv2 = captcha?.current?.getValue();
      token.value = tokenv2 as string;
      setRedrawCounter(prev => prev + 1);
    }
    if (!token.value) { return; };
    setCaptchaToken(token.value);

    const userMessage: ChatMessage = { role: 'user', content: text };
    setChat((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    const intl = t._info.code;
    const userId = parseInt(localStorage.getItem('user_id') || '');
    const chatId = parseInt(localStorage.getItem('chat_id') || '');
    const userUuid = '';
    const chatUuid = '';
    try {
      const chatRq: ChatRequest = { userId, userUuid, chatId, chatUuid, intl, newMessages: [userMessage], noticed: noticed };
      const response: ChatResponse = await sendMessage(chatRq, token.value, captchaVersion);
      if (response.systemMessage?.includes('--done-clear--')) {
        handleClear();
        setLoading(false);
        return;
      } else if (response.systemMessage?.includes('--chat-limit-exceeded--')) {
        setChatUsage(response.chatUsage);
        setMessagesLimit(0);
        setChatLimit(0);
        setLoading(false);
        return;
      } else if (response.systemMessage?.includes('--messages-limit-exceeded--')) {
        setMessagesUsage(response.messagesUsage);
        setMessagesLimit(0);
        setLoading(false);
        return;
      }
      const reply: string = response?.response || '';
      localStorage.setItem('chat_id', response?.chatId.toString() || '');
      localStorage.setItem('user_id', response?.userId.toString() || '');
      localStorage.setItem('user_uuid', response?.userUuid || '');
      localStorage.setItem('chat_uuid', response?.chatUuid || '');
      setNoticed(response?.noticed || false);
      setChatLimit(response.chatLimit);
      setMessagesLimit(response.messagesLimit);
      setChatUsage(response.chatUsage);
      setMessagesUsage(response.messagesUsage);

      setIsStreaming(true);

      const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
      setChat((prev) => [...prev, assistantMessage]);

      setFullResponseContent(reply);

      const newSuggestions: string[] = response.questions;
      setBeforeDisplaySuggestions(newSuggestions);
      saveLastQuestions(newSuggestions);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
      setErrorChating(error);
    }
  };

  const handleClear = async () => {
    setChat([]);
    const newUuid = crypto.randomUUID();
    setNoticed(false);
    setMessagesUsage(0);
    setErrorChating('');
    const initialSuggestions = await fetchInitialSuggestions();
    setSuggestions(initialSuggestions);
    localStorage.removeItem('chat_history');
    localStorage.removeItem('chat_id');
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isChatVisible && (chat.length >= messagesLimit || chatUsage >= chatLimit)) {
      timer = setTimeout(() => {
        bubbleBotRef.current?.classList.add('flex');
        bubbleBotRef.current?.classList.remove('hidden');
        setRedrawCounter(prev => prev + 1);
      }, 1500);
    } else if (!isChatVisible || chat.length < messagesLimit || chatUsage < chatLimit) {
      bubbleBotRef.current?.classList.add('hidden');
      bubbleBotRef.current?.classList.remove('flex');
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isChatVisible, chat.length, chatUsage, messagesUsage]);

  const saveLastQuestions = (questions: string[]) => {
    localStorage.setItem('lastQuestions', JSON.stringify(questions));
    localStorage.setItem('lastQuestions2', JSON.stringify(questions || ['prueba no existe']));
  }
  const recoverLastQuestions = async (): Promise<string[]> => {
    const lastQuestions = localStorage.getItem('lastQuestions');
    if (lastQuestions) {
      try {
        return JSON.parse(lastQuestions) as string[];
      } catch (error) {
        return [];
      }
    }
    return [];
  }

  const captchaWidgetV2 = () => (
    <ReCAPTCHA
      ref={captcha}
      hl={t._info.code}
      sitekey="6Lfea6krAAAAAHZwEwR92Yec--iRCQ4TPjfO7tMQ"
      size="compact"
      theme="dark"
      onChange={onCaptcha2Resolved}
      onExpired={onCaptcha2Expired}
      style={{ height: '100px', width: '200px' }}
    />
  );

  const captchaWidgetV3 = () => (
    <ReCAPTCHA
      ref={captcha}
      hl={t._info.code}
      sitekey="6LfaQacrAAAAAP62RkPWtIj1jWaDBg8aDfjeCv3p"
      size="invisible"
      theme="dark"
      style={isMobile ? { display: 'none' } : {}}
    />
  );

  return (
    <>
      {captchaVersion === captchaVersion3 && captchaWidgetV3()}
      <div
        id="main-chat"
        ref={mainchat}
        className={`fixed inset-0 w-[20%] xs:w-full xs:pt-[15%] h-full flex items-center justify-center pt-[5%] pb-2 transition-transform duration-500 ${isChatVisible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative w-full h-full flex flex-col justify-between rounded-lg shadow-lg p-2">
          <div className="sticky top-0 z-10 bg-black/20 p-0 rounded-md flex items-center justify-between ">
            <div className="flex items-center gap-2 text-white/80 text-md font-bold">
              <span>{t.chat.bot_name}</span>
            </div>
            <div className="flex items-center gap-3 text-2xl">
              <button
                title=""
                onClick={handleClear}
                className="text-white font-bold hover:text-red-300  border-0 transition"
              >
                <BiTrash />
              </button>
              <button
                title=""
                onClick={() => onCloseChat()}
                className="text-white font-bold hover:text-red-300 border-0 transition"
              >
                <BiX />
              </button>
            </div>
          </div>

          <div className="mx-auto text-white/80 text-center flex items-center justify-between">
            <div className={`catbot h-20 ${chat.length === 0 || chat.length >= messagesLimit ? 'hidden' : ''}`}>
              <RenderJsonLottie source={botAnim} height={100} width={100} />
            </div>
            <p className={`font-bold ${chat.length > 0 || chat.length >= messagesLimit ? 'hidden' : ''}`}>{t.chat.i_am_bot_message}</p>
            <p className={`font-bold ${chat.length === 0 || chat.length >= messagesLimit ? 'hidden' : ''}`}>{t.chat.its_a_pleasure}</p>
          </div>

          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity animation-pulse duration-300 pointer-events-none ${chat.length > 0 ? 'hidden' : ''} transition`}>
            <div className="flex items-center p-8 justify-center w-full h-full">
              <RenderJsonLottie source={botAnim} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-white mt-2 mb-2 space-y-2 pr-1">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`rounded px-3 py-2 text-sm max-w-[90%] ${msg.role === 'user'
                    ? 'bg-white/25 border-white/90 text-white/90 self-end ml-auto rounded-full rounded-br-none'
                    : 'text-white/90 border-l-2 self-start rounded-none border-purple-500'
                  }`}
              >
                {msg.role === 'assistant' && index === chat.length - 1 && isStreaming ? displayedResponseContent : msg.content}
                <div ref={messagesEndRef} />
              </div>))
            }
            {loading && <div className="text-white text-xs animate-pulse">...</div>}
            {errorChating && <div className="text-white text-xs animate-pulse">{t.chat.error_chatting}</div>}
          </div>
          {suggestions && (
            <div className="mt-1 mb-2 max-h-[100px] overflow-y-auto scrollbar-white">
              <div className="flex flex-wrap gap-1 justify-center">
                {suggestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="text-xs text-white/90 font-semibold px-2 py-1 rounded-full hover:bg-white/30 transition border border-white/30 animate-fade-in animation-delay"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div id="bot-bubble-ref" ref={bubbleBotGuideRef} className=' h-[1px] bg-white/50 relative w-full xs:w-[80%]'>
            <div ref={bubbleBotRef} className='absolute -top-40 left-full h-20 w-20 z-50 flex flex-col items-center justify-start scale-[1.6]'>
              <BotBubbleDispatcher
                message={chatUsage >= chatLimit ? t.chat.hit_limit_2 : chat.length >= messagesLimit ? t.chat.hit_limit_1 : ''}
                position={isMobile ? 'top-start' : 'top-end'}
                timeout={4}
                mirror='x'
                redraw={redrawCounter}
                node={captcha2Node}
              >
                <RenderJsonLottie source={bubbleBot} />
              </BotBubbleDispatcher>
            </div>
            {captchaVersion === captchaVersion2 &&
              <div ref={bubbleBotRef} className='absolute -top-40 left-full h-20 w-20 z-50 flex flex-col items-center justify-start scale-[1.6]'>
                <BotBubbleDispatcher
                  message={t.chat.captcha_message}
                  position={isMobile ? 'top-start' : 'top-end'}
                  timeout={1}
                  mirror='x'
                  redraw={redrawCounter2}
                  node={captcha2Node}
                >
                  <RenderJsonLottie source={bubbleBot} />
                </BotBubbleDispatcher>
              </div>
            }
          </div>

          <div className="flex items-center gap-2 xs:pb-2">
            <input
              type="text"
              placeholder={t.chat.askme_placeholder}
              className="flex-1 rounded-full px-2 py-1 text-sm text-white/90 bg-transparent border border-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            />
            <button
              onClick={() => handleSend(input)}
              className="text-white hover:scale-110 transition border-0 animate-pulse"
              title="Enviar"
            >
              <BiSend className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;