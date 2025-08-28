import React, { useEffect, useRef, useState } from 'react';
import img_me_just_living from '../assets/img/me/me-just-living-trbg.png';
import Hammer from 'hammerjs';
import gsap from 'gsap';
import './MainText.css';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../styles/breakpoints';

interface Props {
  t: any;
}

const MainText: React.FC<Props> = ({ t }) => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const [chatVisible, setChatVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descriptions] = useState<string[]>(t.home.welcome.descriptions as string[]);

  const itemRefs = useRef<Array<HTMLDivElement | null >>([]);

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
    <div className='relative  h-full w-full flex gap-1 items-center justify-center'>
      <div id="main-text" className={`w-3/4 h-full text-white z-10 px-[5%] py-[5%] flex justify-center align-center xs:w-full xs:align-end`} >
        <div className="text-left relative flex flex-wrap  "
              style={isMobile ? {alignContent: 'end'} : {alignContent: 'center'}}>
          <h2 className="text-white/80 text-6xl xs:text-2xl w-full black-shadow font-serif font-thin tracking-wider mt-2 font-verdana">
            {t.common.name}
          </h2>
          <p className="text-white/80 text-3xl xs:text-xl w-full  mt-3 black-shadow">
            Developer / Just living
          </p>

          <div className=" w-full slider overflow-hidden">
            <div className="indicators">
              {descriptions.map((_: string, index: number) => (
                <div 
                  className="indicator-item-wrapper" 
                  key={`indicator-${index}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className={`indicator-item ${index === currentIndex ? 'active' : 'bg-transparent'}`} />
                </div>
              ))}
            </div>
            <div 
              className="slider-container h-1/2 xs:text-base flex transition-transform duration-500 ease-in-out" 
              ref={sliderRef}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {descriptions.map((description: string, index: number) => (

                <div
                  key={`slide-${index}`}
                  id={index === descriptions.length - 1 ? 'last' : undefined}
                  className="slider-item min-w-full"
                >
                  <p className="text-white/80 leading-relaxed md:text-xl text-m font-serif font-thin tracking-wider font-verdana black-shadow">
                    {description}
                  </p>
                </div>

              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="main-image" className=" xs:absolute xs:right-0 xs:w-full xs:p-0 justify-end w-1/2 h-full pr-[5%] py-[5%] flex justify-center align-end object-contain">
          <img src={`${img_me_just_living.src}`}  alt="Isaac just living" className=' object-contain'/>
      </div>
    </div>
  );
};

export default MainText;