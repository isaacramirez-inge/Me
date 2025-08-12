import React, { useEffect, useRef, useState } from 'react';
import img_me_just_living from '../assets/img/me/me-just-living-trbg.png';
import Hammer from 'hammerjs';
import gsap from 'gsap';
import './MainText.css';
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Props {
  t: any;
}

const MainText: React.FC<Props> = ({ t }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descriptions] = useState<string[]>(t.home.welcome.descriptions as string[]);

  useEffect(() => {
    const handleChatVisibility = (event: CustomEvent) => {
      setChatVisible(event?.detail);
    };
    window.addEventListener('mainchat-visible', handleChatVisibility as EventListener);

    return () => {
      window.removeEventListener('mainchat-visible', handleChatVisibility as EventListener);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger); 
    gsap.to("#main-text", {
      x: "-200%",
      opacity: 0,
      scale: 0.5,
      display: 'none',
      ease: "linear",
      scrollTrigger: {
        trigger: "#main-text",
        start: "top top",
        end: "bottom top", 
        onLeave: () => { 
          const mainTextElement = document.getElementById('main-text');
          if (mainTextElement) {
            mainTextElement.style.display = 'none';
          }
        }, 
        scrub: true, 
      },
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to("#main-image", {
      x: "200%",
      opacity: 0,
      scale: 0.5,
      display: 'none',
      ease: "linear",
      scrollTrigger: {
        trigger: "#main-image",
        start: "top top",
        end: "bottom top",
        onLeave: () => { 
          const mainTextElement = document.getElementById('main-image');
          if (mainTextElement) {
            mainTextElement.style.display = 'none';
          }
        }, 
        scrub: true,
      },
    });
  }, []);



  useEffect(() => {
    if (sliderRef.current) {
      const hammer = new Hammer(sliderRef.current);

      hammer.on('swipeleft', () => {
        if (currentIndex < descriptions.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        }
      });

      hammer.on('swiperight', () => {
        if (currentIndex > 0) {
          setCurrentIndex(prevIndex => prevIndex - 1);
        }
      });
      return () => hammer.destroy();
    }
  }, [currentIndex, descriptions.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % descriptions.length);
    }, 20 * 1000); // 20 segundos

    return () => clearInterval(timer);
  }, [descriptions.length]);

  return (
    <>
    <div id="main-image" className="fixed top-0 right-0 pt-[5%] pr-[5%] h-full object-contain object-right-bottom">
        <img src={`${img_me_just_living.src}`}  alt="Isaac just living" />
    </div>
    <div id="main-text" className={`fixed inset-0 flex md:items-center px-[5%] py-[10%] ${
        chatVisible ? 'ml-[20%]' : 'ml-0'
      } text-white z-10 items-end`}
    >
      <div className="text-left relative left-container">
        <h2 className="text-6xl black-shadow font-serif font-thin tracking-wider mt-2 font-verdana">
          Isaac Sarceño
        </h2>
        <p className="text-3xl font-serif font-thin tracking-wider mt-3 font-verdana black-shadow">
          Developer / Just living
        </p>

        <div className="slider h-60 overflow-hidden">
          <div className="indicators">
            {descriptions.map((_: string, index: number) => (
              <div 
                className="indicator-item-wrapper" 
                key={`indicator-${index}`}
                onClick={() => setCurrentIndex(index)} // Agregamos el evento de clic para actualizar el estado
              >
                {/* Se elimina la lógica del indicador activo y se actualiza con el estado */}
                <div className={`indicator-item ${index === currentIndex ? 'active' : ''}`} />
              </div>
            ))}
          </div>
          <div 
            className="slider-container h-[200px] flex transition-transform duration-500 ease-in-out" 
            ref={sliderRef}
            // Agregamos el estilo para mover el slider
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {descriptions.map((description: string, index: number) => (
              <div
                key={`slide-${index}`}
                id={index === descriptions.length - 1 ? 'last' : undefined}
                className="slider-item min-w-full"
              >
                <p className="md:text-xl text-m font-serif font-thin tracking-wider font-verdana black-shadow">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MainText;