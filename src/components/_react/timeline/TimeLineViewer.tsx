import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './TimeLineViewer.css';
import TimeLineMenuBar from './TimeLineMenuBar';
import MainCardDetails from './MainCardDetails';
import { ContextTimelineProvider } from './ContextTimeline';
import ResumeList from './ResumeList';
import type { TimelineProps, MainCardData, ViewType } from './TimelineTypes';


export default function TimeLineViewer({ main_cards, technologies }: TimelineProps) {
  const [timeline, setTimeline] = useState<MainCardData[] | null>(null);
  const [expanded, setExpanded] = useState<{ [company: string]: boolean }>({});
  const [error, setError] = useState<string>('');
  const stickyRefs = useRef<{ [company: string]: HTMLDivElement | null }>({});
  const menuBarRef = useRef<HTMLDivElement | null>(null);
  const [menuBarHeight, setMenuBarHeight] = useState(80);
  const [viewType, setViewType] = useState<ViewType>('line');

  
  useEffect(() => {
    try {
      setTimeline(main_cards);
      setError('');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido.';
      setError(`Error al procesar los datos: ${errorMessage}`);
      setTimeline(null);
    }
  }, [main_cards]);
  
  useLayoutEffect(() => {
    if (menuBarRef.current) {
      setMenuBarHeight(menuBarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (menuBarRef.current) setMenuBarHeight(menuBarRef.current.offsetHeight);
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', () => {
        if (menuBarRef.current) setMenuBarHeight(menuBarRef.current.offsetHeight);
      });
    };
  }, [timeline, menuBarHeight]);

  useEffect(() => {
    handleScroll();
  }, [expanded]);


  const handleScroll = () => {
    if (!timeline) return;

    timeline.forEach((group) => {
      const ref = stickyRefs.current[group.company];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (rect.top <= menuBarHeight && rect.bottom > menuBarHeight) {
          ref.classList.add('sticky-active');
        } else {
          ref.classList.remove('sticky-active');
          if (rect.top <= menuBarHeight && rect.bottom < menuBarHeight) {
            ref.classList.add('sticky-active');
          }
        }
      }
    });
  };
  const handleCollapseAll = () => {
    stickyRefs.current = {};
    setExpanded({});
  };


  const contextValue = {
    jobs_history: timeline || [],
    technologies: technologies || []
  };

  return (
    <ContextTimelineProvider value={contextValue}>
      <div id="tv-timeline-root" className="tv-timeline-root">
        {error && <p className="tv-error-message">{error}</p>}
        <div className="tv-timeline-outer">
          <TimeLineMenuBar ref={menuBarRef} onCollapseAll={handleCollapseAll} viewType={viewType} setViewType={setViewType} />
          <div id="tv-timeline-content" className="tv-timeline-content">
            {viewType === 'resume' && <ResumeList onClose={() => setViewType('line')} />}
            {viewType === 'line' && timeline?.sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999)).map((group, idx) => {
              const type = group.type || 'empresa';
              let nodeClass = 'tv-timeline-node-company';
              if (type === 'estudio') nodeClass += ' tv-timeline-node-estudio';
              else if (type == 'empresa') nodeClass += ' tv-timeline-node-empresa';
              else if (type == 'personal') nodeClass += ' tv-timeline-node-personal';
              else if (type == 'logro') nodeClass += ' tv-timeline-node-logro';
              else nodeClass += ' tv-timeline-node-other';

              return (
                  <div key={`${group.company}-${idx}`} className="tv-company-block" >
                    <div className="tv-company-row-flex">
                      {/* Columna de línea/nodo */}
                      <div className="tv-timeline-segment">
                        <div className="tv-timeline-line tv-timeline-line-company" />
                        <div className={nodeClass} />
                      </div>
                      {/* Columna derecha de contenido sticky y proyectos */}
                      <div className="tv-company-main-col" style={{ paddingBottom: '16px' }}>
                        <MainCardDetails menuBarRef={menuBarRef} group={group} expanded={expanded} stickyRefs={stickyRefs.current} />
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
    </ContextTimelineProvider>
  );
}