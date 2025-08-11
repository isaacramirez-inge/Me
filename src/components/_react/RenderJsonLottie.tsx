import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

export type event =  'complete' | 'loopComplete';

interface RenderProps {
  source: object;
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
  events?: { e: event ,callback: () => void }[];

}

const RenderJsonLottieWeb: React.FC<RenderProps> = ({
  source,
  loop = true,
  autoplay = true,
  width ,
  height,
  events = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear animación
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData: source,
    });

    events.forEach((e) => {
        if (typeof e.callback === "function") {
          animationRef.current?.addEventListener(e.e, () => {
            e.callback();
          });
        } else {
          console.warn(`Callback for event '${e.e}' is not a function`, e.callback);
        }
      });
      

    return () => {
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [source, loop, autoplay]);

  return <div ref={containerRef} style={{ width, height }} />;
};

export default RenderJsonLottieWeb;
