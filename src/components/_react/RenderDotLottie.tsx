import { useEffect, useRef } from 'react';
import { DotLottie, type EventType } from '@lottiefiles/dotlottie-web';

interface RenderProps {
  source: string; // Ruta o URL del archivo .lottie
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
  events?: {e: event, callback: () => void}[];
}
export type event = EventType;

const RenderDotLottie: React.FC<RenderProps> = ({
  source,
  loop = true,
  autoplay = true,
  width,
  height,
  events =[]
}) => {
  const containerRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<DotLottie | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear instancia de DotLottie
    playerRef.current = new DotLottie({
      canvas: containerRef.current,
      src: source,
      loop,
      autoplay,
    });


    events.forEach((e) => {
      playerRef.current?.addEventListener(e.e, e.callback);
    });

    return () => {
      events.forEach((e) => {
        playerRef.current?.removeEventListener(e.e, e.callback);
      });
      playerRef.current?.destroy();
    };
  }, [source, loop, autoplay]);

  return <canvas ref={containerRef} width={width} height={height} />;
};

export default RenderDotLottie;
