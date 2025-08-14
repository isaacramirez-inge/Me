import React, { useState, useEffect, useRef } from 'react';
import { BiSend, BiTrash, BiX } from 'react-icons/bi';
import { initialModelUsage, type ChatMessage, type ChatRequest, type SuggestedQuestion } from '../lib/chat/ChatRequesterTypes';
import { sendMessage } from '../lib/chat/ChatRequester';
import RenderJsonLottie from '../components/_react/RenderJsonLottie';
import botAnim from '../assets/anim/bot.json'; 
import bubbleBot from '../assets/anim/bot-bubble.json'; 

interface ChatProps {
  t: any;
  m: any;
  isVisible: boolean;
  onCloseChat: () => void;
}

const Chat: React.FC<ChatProps> = ({ onCloseChat , t, isVisible }) => {
  const [chatLimit] = useState<number>(30);
  const [uuid, setUuid] = useState<string>('');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialSuggestions, setInitialSuggestions] = useState<SuggestedQuestion[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>([]);
  const [beforeDisplaySuggestions, setBeforeDisplaySuggestions] = useState<SuggestedQuestion[]>([]);
  const [suggestionsHistory, setSuggestionsHistory] = useState<SuggestedQuestion[]>([]);
  const [fullResponseContent, setFullResponseContent] = useState<string>('');
  const [displayedResponseContent, setDisplayedResponseContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [modelUsage] = useState<any>(initialModelUsage);
  const [errorChating, setErrorChating] = useState<any>(null);
  const bubbleBotGuideRef = useRef<HTMLDivElement | null>(null);
  const bubbleBotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('chat_history');
    const savedUuid = localStorage.getItem('chat_uuid');
    if (savedChat && savedUuid) {
      setChat(JSON.parse(savedChat));
      setUuid(savedUuid);
    } else {
      const newUuid = crypto.randomUUID();
      localStorage.setItem('chat_uuid', newUuid);
      setUuid(newUuid);
    }
  }, []);


  useEffect(() => {
    const fetchInitialSuggestions = async () => {
        const chatRq: ChatRequest = { uuid: uuid, intl: t._info.code, messages: [{role: 'user', content: 'Dame cortas sugerencias para preguntar'}], suggestedQuestions: [], modelUsage: modelUsage };
        try{
          const response = await sendMessage(chatRq);
          const initial = [
            {question: response.q1, taken: false},
            {question: response.q2, taken: false}
          ];
          setInitialSuggestions(initial);
          setSuggestionsHistory(initial);
          setSuggestions(initial);
        }catch(error){
          console.log('Error  retrieving initial questions', error);
        }
    }
    const lastquestions: SuggestedQuestion[] = recoverLastQuestions();
    if(!lastquestions){
      fetchInitialSuggestions();
    }else{
      setInitialSuggestions(lastquestions);
      setSuggestionsHistory(lastquestions);
      setSuggestions(lastquestions);
    }
  },[initialSuggestions]);


  useEffect(() => {
    if (fullResponseContent && displayedResponseContent.length < fullResponseContent.length) {
      const timer = setTimeout(() => {
        const nextWord = fullResponseContent.split(' ')[displayedResponseContent.split(' ').length];
        setDisplayedResponseContent((prev) =>
          prev ? `${prev} ${nextWord}` : nextWord
        );
        scrollToBottom();
        if (displayedResponseContent.split(' ').length === fullResponseContent.split(' ').length - 1) {
          setSuggestions(beforeDisplaySuggestions);
        }
      }, 50); 
      return () => clearTimeout(timer);
    } else if (fullResponseContent && displayedResponseContent.length === fullResponseContent.length) {
        setFullResponseContent(''); 
    }
  }, [fullResponseContent, displayedResponseContent]);


  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chat));
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setChat((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setSuggestions([]); // Clear suggestions after sending a message

    try {
      const suggestionsValidated = suggestionsHistory.map(sq => ({...sq, taken: sq.question === text}));
      const chatRq: ChatRequest = {uuid: uuid, intl: t._info.code, messages: [...chat, userMessage], suggestedQuestions: suggestionsValidated, modelUsage: modelUsage};
      const response = await sendMessage(chatRq);
      const reply: string = response.response || 'Error al obtener respuesta.';
      
      // Store the full response and start displaying it word by word
      setFullResponseContent(reply);
      setDisplayedResponseContent(''); // Start with an empty displayed response

      const newSuggestions: SuggestedQuestion[] = 
      (response.q1 === response.q2) ? 
      [{question: response.q1, taken: false}] : 
      [
        {question: response.q1, taken: false},
        {question: response.q2, taken: false}
      ];
      const assistantMessage: ChatMessage = { role: 'model', content: reply };
      setChat((prev) => [...prev, assistantMessage]);
      setBeforeDisplaySuggestions(newSuggestions);
      setSuggestionsHistory([...suggestionsValidated, ...newSuggestions]);
      saveLastQuestions(newSuggestions);
      setLoading(false);

    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
      setErrorChating(error);
    }
  };

  const handleClear = () => {
    setChat([]);
    setSuggestions([]);
    setInitialSuggestions([]);
    setSuggestionsHistory([]);
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    localStorage.setItem('chat_uuid', newUuid);
    localStorage.removeItem('chat_history');
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isVisible && chat.length >= 5) {
      timer = setTimeout(() => {
        bubbleBotRef.current?.classList.add('flex');
        bubbleBotRef.current?.classList.remove('hidden');
      }, 1500);
    } else if (!isVisible || chat.length < 5) {
      bubbleBotRef.current?.classList.add('hidden');
      bubbleBotRef.current?.classList.remove('flex');
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, chat.length]);
  
  const saveLastQuestions = (questions: SuggestedQuestion[]) => {
    localStorage.setItem('lastQuestions', JSON.stringify(questions));
  }
  const recoverLastQuestions = (): SuggestedQuestion[] => {
    const lastQuestions = localStorage.getItem('lastQuestions');
    if (lastQuestions) {
      return JSON.parse(lastQuestions) as SuggestedQuestion[];
    }
    return [];
  }

  return (
    <div
      id="main-chat"
      className={`fixed inset-0 w-[20%] h-full flex items-center justify-center pt-[5%] pb-2 transition-transform duration-500 ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="relative w-full h-full flex flex-col justify-between rounded-lg shadow-lg p-2">

        {/* Encabezado Sticky */}
        <div className="sticky top-0 z-10 bg-black/20 p-0 rounded-md flex items-center justify-between ">
          <div className="flex items-center gap-2 text-white text-base font-semibold">
            <span>IsaBOT</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              title="Reiniciar el Chat"
              onClick={handleClear}
              className="text-white hover:text-red-300  border-0 transition"
            >
              <BiTrash />
            </button>
            <button
              title="Cerrar"
              onClick={() => onCloseChat()}
              className="text-white hover:text-red-300 border-0 transition"
            >
              <BiX />
            </button>
          </div>
        </div>

        {/* Chat intro */}
        <div className="mx-auto text-sm text-white/90 text-center flex items-center justify-between">
          <div className={`catbot h-20 ${chat.length === 0 || chat.length >= 5 ? 'hidden' : ''}`}>
            <RenderJsonLottie source={botAnim} height={100} width={100}/>
          </div>
          <p>Soy el asistente virtual de Isaac, ¿en qué puedo ayudarte hoy?</p>
          <p className="text-xs mt-1 text-gray-100"></p>
        </div>

        {/* Animación asistente (solo si no hay mensajes aún) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity animation-pulse duration-300 pointer-events-none ${chat.length > 0 ? 'hidden' : ''} transition`}>
          <div className="flex items-center p-8 justify-center w-full h-full">
            <RenderJsonLottie source={botAnim} />
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto scrollbar-white mt-2 mb-2 space-y-2 pr-1">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`rounded px-3 py-2 text-sm max-w-[90%] ${
                msg.role === 'user'
                  ? 'bg-white/25 border-white/90 text-white/90 self-end ml-auto rounded-l-full'
                  : 'text-white/90 border-l-2 self-start rounded-none'
              }`}
            > 
            {/* Display the streamed content for the last assistant message */}
            {msg.role === 'model' && index === chat.length - 1 && fullResponseContent ? (
              displayedResponseContent
            ) : (
              msg.content
            )}
            <div ref={messagesEndRef} />
          </div>))
          }
          {loading && <div className="text-white text-xs animate-pulse">Escribiendo respuesta...</div>}
          {errorChating && <div className="text-white text-xs animate-pulse">Oops, ocurrio un error!</div>}
        </div>

        {/* Sugerencias */}
        {suggestions.length > 0 && (
          <div className="mt-1 mb-2 max-h-[100px] overflow-y-auto scrollbar-white">
            <div className="flex flex-wrap gap-1 justify-center">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  className="text-xs text-white/90 font-semibold px-2 py-1 rounded-full hover:bg-white/30 transition border border-white/30 animate-fade-in animation-delay" 
                  onClick={() => handleSend(q.question)}
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/**Bubble bot */}
        <div id="bot-bubble-ref" ref={bubbleBotGuideRef} className='relative w-full'>
          <div ref={bubbleBotRef} className='absolute -top-40 left-full h-20 w-20 z-50 flex items-center justify-start scale-[1.6]'>
            <RenderJsonLottie source={bubbleBot} />
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text" 
            placeholder="Preguntame algo sobre Isaac..."
            className="flex-1 rounded-full px-2 py-1 text-sm text-white/90 bg-transparent border border-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button
            onClick={() => handleSend(input)}
            className="text-white hover:scale-110 transition border-0"
            title="Enviar"
          >
            <BiSend className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
