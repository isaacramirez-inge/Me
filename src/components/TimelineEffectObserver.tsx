import { useEffect, useRef } from 'react';
import { useConfetti } from '../hooks/useConfetti';

interface TimelineEffectObserverProps {
  type: string;
}

const TimelineEffectObserver: React.FC<TimelineEffectObserverProps> = ({ type }) => {
  const observer = useRef<HTMLDivElement | null>(null);
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    if (observer.current) {
      const observerInstance = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (type === 'logro') {
                triggerConfetti();
              }
            }
          });
        }
      );
      observerInstance.observe(observer.current);
      return () => observerInstance.disconnect();
    }
  }, [type]);

  return (
    <div ref={observer} className="w-0 h-0 trigger -z-10"></div>
  );
};

export default TimelineEffectObserver;
