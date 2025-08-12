import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import './ProjectGrid.css';
import ProjectCard from './ProjectCard';
import type { ProjectGridProps } from './TimelineTypes';

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  // Helper function to set refs for each project item
  const setItemRef = (el: HTMLDivElement | null, projectId: number) => {
    if (el) {
      itemsRef.current[projectId] = el;
    }
  };

  const handleItemClick = (e: React.MouseEvent, projectId: number) => {
    if ((e.target as HTMLElement).closest('.carry-button')) {
      return;
    }

    if (isAnimating) return;
    
    const isCurrentlyExpanded = expandedId === projectId;
    
    if (isCurrentlyExpanded) {
      // Just close the currently expanded item
      setExpandedId(null);
      return;
    }

    // If there's an expanded item, close it first
    if (expandedId !== null) {
      setIsAnimating(true);
      
      // Scroll to the currently expanded item
      const expandedElement = itemsRef.current[expandedId];
      if (expandedElement) {
        expandedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      // Wait for scroll to complete, then expand the new item
      setTimeout(() => {
        setExpandedId(projectId);
        // Reset animation lock after a reasonable time
        setTimeout(() => setIsAnimating(false), 500);
      }, 400);
    } else {
      // No item is expanded, just expand the clicked one
      setExpandedId(projectId);
    }
  };

  return (
    <div className="project-grid-root">
      <LayoutGroup>
        {projects.map((project, idx) => {
          const isExpanded = expandedId === project.project_id;
          return (
            <motion.div
              ref={el => setItemRef(el, project.project_id)}
              className={`project-grid-item${isExpanded ? ' expanded' : ''}${isAnimating ? ' is-animating' : ''}`}
              key={project.project_id || idx}
              layout
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 300,
                mass: 0.5
              }}
              onClick={(e) => handleItemClick(e, project.project_id)}
              style={{
                zIndex: isExpanded ? 2 : 1,
                pointerEvents: isAnimating ? 'none' : 'auto'
              }}
            >
              <motion.div 
                className="project-grid-row"
                layout="position"
              >
                <div className="project-grid-img-container">
                  <motion.img
                    src={project.company_logo_path ? `/src/assets/img/company_clients/${project.company_logo_path}` : '/src/assets/img/company_clients/default.png'}
                    alt={project.company}
                    className="project-grid-img"
                    layout
                    transition={{ 
                      type: 'spring',
                      damping: 26,
                      stiffness: 300
                    }}
                  />
                </div>
                <div className="project-grid-company">
                  {project.company}
                </div>
              </motion.div>
              <motion.div 
                className="project-grid-title"
                layout="position"
              >
                {project.project_name}
              </motion.div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="project-grid-expanded-content"
                    layout
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ 
                      opacity: 1,
                      height: 'auto',
                      transition: { 
                        opacity: { duration: 0.2, delay: 0.1 },
                        height: { 
                          type: 'spring',
                          damping: 26,
                          stiffness: 300,
                          mass: 0.5
                        }
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      height: 0,
                      transition: { 
                        opacity: { duration: 0.15 },
                        height: { 
                          type: 'spring',
                          damping: 30,
                          stiffness: 300,
                          mass: 0.5
                        }
                      }
                    }}
                  >
                    <ProjectCard project={project} onClose={() => setExpandedId(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        );
        })}
      </LayoutGroup>
    </div>
  );
};

export default ProjectGrid;