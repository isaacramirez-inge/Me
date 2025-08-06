import { forwardRef } from 'react';
import './TimeLineMenuBar.css';
import type { TimeLineMenuBarProps } from './TimelineTypes';


const TimeLineMenuBar = forwardRef<HTMLDivElement, TimeLineMenuBarProps>(({ onCollapseAll, viewType, setViewType }, ref) => {

  return (
    <>
      <div className="timeline-menu-bar" ref={ref}>
        <div className="timeline-menu-title">Mi Trayectoria</div>
        <div className="timeline-menu-actions">
          <button 
            className="timeline-menu-btn" 
            onClick={() => {
              if(viewType === 'resume') {
                setViewType?.('line');
              } else {
                setViewType?.('resume');
              }
            }}
            aria-label="Ver resumen profesional"
          >
            {viewType === 'resume' ? 'Ver linea de tiempo' : 'Ver resumen profesional'}
          </button>
          <button 
            className="timeline-menu-btn" 
            onClick={onCollapseAll}
            aria-label="Colapsar todo"
          >
            Colapsar todo
          </button>
        </div>
      </div>
    </>
  );
});

export default TimeLineMenuBar; 