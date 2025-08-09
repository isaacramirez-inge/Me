import React, { useState, useEffect, useRef } from 'react';
import { BiSend, BiBot, BiTrash, BiX } from 'react-icons/bi';
import Lottie from 'react-lottie-player';
import botAnim from '../assets/anim/bot.json'; 
const apiUrl = import.meta.env.PUBLIC_API_URL;

interface ChatProps {
  t: any;
  m: any;
  onCloseChat: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
interface ChatRequest {
  intl: string;
  messages: ChatMessage[];
  suggestedQuestions: SuggestedQuestion[];
  provider?: string;
}
interface SuggestedQuestion{
  question: string;
  taken: boolean;
}

const initialSuggestions: SuggestedQuestion[] = [
  { question: '¿Tiene experiencia en React?', taken: false},
  { question: '¿Ha trabajado en proyectos en la nube?', taken: false},
  { question: '¿Puede liderar un equipo técnico?', taken: false},
];

const Chat: React.FC<ChatProps> = ({ onCloseChat }) => {
  const [uuid, setUuid] = useState<string>('');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>(initialSuggestions);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let sessionId = localStorage.getItem('chat_uuid');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('chat_uuid', sessionId);
    }
    setUuid(sessionId);

    const savedChat = localStorage.getItem('chat_history');
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

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
      const chatRq: ChatRequest = {intl: 'es-es', messages: chat, suggestedQuestions: suggestions};
      const response = await fetch(`${apiUrl}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatRq),
      });
      
      const data = await response.json();
      const reply = data.response || 'Error al obtener respuesta.';
      const assistantMessage: ChatMessage = { role: 'model', content: reply };
      setChat((prev) => [...prev, assistantMessage]);
      setSuggestions(initialSuggestions);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setChat([]);
    localStorage.removeItem('chat_history');
  };

  return (
    <div
      id="main-chat"
      className={` ${expanded ? 'fixed inset-0 w-full z-50' : 'fixed inset-0 w-[20%]'} h-full flex items-center justify-center pt-[5%] pb-2`}
    >
      <div className="relative w-full h-full flex flex-col justify-between rounded-lg shadow-lg p-2">

        {/* Encabezado Sticky */}
        <div className="sticky top-0 z-10 bg-black/20 p-2 rounded-md flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white text-base font-semibold">
            <BiBot className="text-2xl" />
            <span>Asistente de habilidades</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              title="Limpiar"
              onClick={handleClear}
              className="text-white hover:text-red-300 transition"
            >
              <BiTrash />
            </button>
            <button
              title="Cerrar"
              onClick={() => onCloseChat()}
              className="text-white hover:text-red-300 transition"
            >
              <BiX />
            </button>
          </div>
        </div>

        {/* Chat intro */}
        <div className="mx-auto text-sm text-white/90 text-center">
          <p>Pregunta a IsaBOT si Isaac tiene las habilidades que buscas</p>
          <p className="text-xs mt-1 text-gray-100">Ingresa el puesto para el cual buscas</p>
        </div>

        {/* Animación asistente (solo si no hay mensajes aún) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${chat.length > 0 ? 'hidden' : ''} transition`}>
          <div className="flex items-center p-8 justify-center w-full h-full">
            {(()=>{ return(
              <Lottie animationData={botAnim} loop play />
            )})()}
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto scrollbar-white mt-2 mb-2 space-y-2 pr-1">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`rounded px-3 py-2 text-sm max-w-[90%] ${
                msg.role === 'user'
                  ? 'bg-white/25 border-white/90 text-white/90 self-start ml-auto rounded-full'
                  : 'text-white/90 border-l-2 self-start'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-white text-xs animate-pulse">Escribiendo respuesta...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias */}
        {suggestions.length > 0 && (
          <div className="mt-1 mb-2 max-h-[100px] overflow-y-auto scrollbar-white">
            <div className="flex flex-wrap gap-1 justify-center">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  className="text-xs text-white/90 font-semibold px-2 py-1 rounded-full hover:scale-105 transition border border-white/30"
                  onClick={() => handleSend(q.question)}
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe tu pregunta..."
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
