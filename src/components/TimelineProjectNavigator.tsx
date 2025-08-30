import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Project, Technology } from './_react/timeline/TimelineTypes';

interface TimelineProjectNavigatorProperties {
  projects: Project[];
  techAll: Technology[];
  base_path: string;
}

const TimelineProjectNavigator: React.FC<TimelineProjectNavigatorProperties> = ({ projects, techAll , base_path}) => {
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // 1. Usa useEffect para resetear el scroll cuando los proyectos cambian o el componente se muestra
  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [projects]); // Dependencia: re-ejecutar cuando los proyectos cambian

  const expandedProject = useMemo(() => {
    return projects.find(p => p.project_id === expandedProjectId) || null;
  }, [expandedProjectId, projects]);

  const sortedProjects = useMemo(() => {
    return projects
      .slice()
      .sort(p => (p.orden ? -1 : 1))
      .sort(p => (p.highlight ? -1 : 1));
  }, [projects]);

  return (
    <div className="tab-projects w-full h-full overflow-hidden ">
      {/* 2. Asigna la referencia al contenedor para controlar el scroll */}
      <motion.div
        ref={listContainerRef}
        className={`transition-all duration-300 w-full h-full overflow-y-auto scrollbar-white ${
          expandedProjectId ? 'opacity-0 pointer-events-none' : 'grid grid-cols-1 gap-4'
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: expandedProjectId ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {sortedProjects.map(project => (
          <motion.div
            layout
            key={project.project_id}
            title={project.project_name}
            onClick={() => setExpandedProjectId(project.project_id)}
            className="project-card2 cursor-pointer flex items-center gap-4 rounded-xl p-3  bg-gray-900 bg-opacity-50  hover:backdrop-blur-sm transition-colors duration-200"
          >
            <div className="logo flex-shrink-0 w-12 h-12 md:w-16 md:h-16">
              <img
                className="w-full h-full object-contain object-left-top"
                src={`/${base_path}/img/company/card/${project.company_logo_path}`}
                alt={project.company}
                loading="lazy"
              />
            </div>
            <div className="project-info overflow-hidden">
              <h2 className="text-xl xs:text-lg leading-snug text-white font-bold break-words line-clamp-2">
                {project.project_name}
              </h2>
              <span className="text-white/70 text-base truncate block">
                {project.company}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3. El componente de detalle se renderiza siempre, pero se oculta con CSS */}
      <motion.div
        className={`absolute inset-0 w-full h-full bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 text-white overflow-y-auto scrollbar-white z-10 transition-opacity duration-300 
          ${expandedProjectId ? 'opacity-100 pointer-events-auto xs:fixed xs:z-50 xs:top-0 xs:left-0' : 'opacity-0 pointer-events-none'} 
        xs:fixed xs:inset-0 xs:w-full xs:h-full xs:bg-gray-900 xs:bg-opacity-50 xs:backdrop-blur-md xs:rounded-2xl xs:p-6 xs:text-white xs:overflow-y-auto xs:scrollbar-white xs:pb-[50%] xs:mt-[50%] xs:rounded-[20px] xs:border-[3px] xs:border-solid xs:border-purple-500 xs:border-x-0`}
        initial={{ opacity: 0 }}
        animate={{ opacity: expandedProjectId ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {expandedProject && (
          <>
            {/* Botón de cierre */}
            <div className='h-[0px] flex justify-end sticky top-0 w-full'>
              <button
                onClick={() => setExpandedProjectId(null)}
                className=" text-white animate-pulse text-xl bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Contenido del proyecto expandido */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="logo w-16 h-16 flex-shrink-0">
                <img
                  className="w-full h-full object-contain"
                  src={`/${base_path}/img/company/card/${expandedProject.company_logo_path}`}
                  alt={expandedProject.company}
                  loading="lazy"
                />
              </div>
              <div className="project-info">
                <h2 className="text-2xl font-bold mb-1">{expandedProject.project_name}</h2>
                <span className="text-white/70 text-sm md:text-base truncate block">{expandedProject.company}</span>
              </div>
            </div>
            <div className="mt-6 mb-4 w-full border-b-2 border-purple-500">
              <h3 className="text-lg font-semibold mb-2">Tecnologías utilizadas</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {expandedProject.technologies.map((techId: number, index: number) => {
                  const tech = techAll.find(t => t.id === techId);
                  if (!tech) return null;
                  const logoPath = `/${base_path}/img/icon/${tech.logo_path}${tech.extension}`;
                  return (
                    <div
                      key={index}
                      className="tech-icon flex flex-col items-center text-xs text-white/80"
                    >
                      <img
                        src={logoPath}
                        alt={`${tech.name} icon`}
                        className="w-8 h-8 object-contain mb-1"
                        loading="lazy"
                      />
                      <span>{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-white/90 mb-3 leading-relaxed whitespace-pre-line">
                {expandedProject.project_description.description}
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-sm pl-4">
                {expandedProject.project_description.bullet_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default TimelineProjectNavigator;