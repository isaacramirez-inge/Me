import React, { useRef, useState, useEffect, useContext } from 'react';
import './ProjectCard.css';
import { BiArrowFromRight } from 'react-icons/bi';
import type { ProjectCardProps, Technology } from './TimelineTypes';
import { ContextTimeline } from './timeline-context';


const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClose }) => {
  const initValueVisible = -150;
  const maxDrag = 400;
  const [dragX, setDragX] = useState(-100);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const context = useContext(ContextTimeline);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
    startX.current = e.clientX;
    lastX.current = dragX;
    document.body.style.userSelect = 'none';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    if (!cardRef.current || !hiddenRef.current) return;
    const delta = e.clientX - startX.current;
    const cardRect = cardRef.current.getBoundingClientRect();
    const hiddenRect = hiddenRef.current.getBoundingClientRect();
    // Limites: no salir del card a la izquierda ni a la derecha
    const minX = cardRect.left - hiddenRect.left - maxDrag; // máximo a la izquierda
    const maxX = initValueVisible; // posición original
    let nextX = lastX.current + delta;
    if (nextX > maxX) nextX = maxX;
    if (nextX < minX) nextX = minX;
    setDragX(nextX);
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  return (
    <div className="project-card" ref={cardRef}
        onMouseLeave={() => setDragX(initValueVisible)}>
      <div 
          className="close-button" 
          onClick={onClose} 
          aria-label="Cerrar"
        >&times;</div>
      <div className="visible-area">
        <div className="project-header">
          {project.company_logo_path && (
            <div className="project-logo">
              <img src={`/src/assets/img/company/card/${project.company_logo_path}`} alt={`${project.company} logo`} />
            </div>
          )}
          <div className="project-title-container">
            <h3 className="project-name">{project.project_name}</h3>
            <p className="company-name">{project.company}</p>
          </div>
        </div>
        {/* Eliminar el renderizado de project.roles porque no existe en la interfaz alineada */}
        <p className="project-description-text">{project.project_description.description}</p>
        <div className="hidden-area2">
          <div className="tech-icons-container">
            {project.technologies.map((techId: number, index: number) => {
              const tech = context?.technologies.find(t => t.id === techId);
              if (!tech) return null;
              const logoPath = `/src/assets/img/icon/techs/${tech.logo_path}${tech.extension}`;
              return (
                <div key={index} className="tech-icon">
                  {tech.logo_path && (
                    <img src={logoPath} alt={`${tech.name} icon`} className="tech-icon-img" />
                  )}
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>
          <p className="implementation-type">{project.implementation_type}</p>
        </div>  
      </div>
      <div
        className="hidden-area"
        ref={hiddenRef}
        style={{ transform: `translateX(${dragX}px)`, transition: dragging ? 'none' : 'transform 0.3s' }}
        onMouseLeave={() => setDragX(initValueVisible)}
      >
        <div 
          className="carry-button" 
          onMouseDown={(e) => {
            e.stopPropagation();
            onMouseDown(e);
          }} 
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ cursor: 'grab' }}
        >
          <BiArrowFromRight />
        </div>
        <ul className="bullet-points">
          {project.project_description.bullet_points.map((point: string, index: number) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectCard;