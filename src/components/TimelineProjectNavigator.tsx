import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from './_react/timeline/TimelineTypes';
import technologies from '../assets/data/technologies.json';

interface TimelineProjectNavigatorProperties {
  projects: Project[];
}

const TimelineProjectNavigator: React.FC<TimelineProjectNavigatorProperties> = ({ projects }) => {
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const expandedProject = projects.find(p => p.project_id === expandedProjectId) || null;

  return (
    <div className="tab-projects w-full h-[90vh] relative overflow-hidden p-4">
      {/* Grid of cards */}
      <div
        className={`transition-all duration-300 w-full h-full overflow-y-auto scrollbar-white
          ${expandedProjectId ? 'hidden' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'}`}
      >
        {projects
          .sort(p => p.orden ? -1 : 1)
          .sort(p => p.highlight ? -1 : 1)
          .map((project) => (
            <motion.div
              layout
              key={project.project_id}
              title={project.project_name}
              onClick={() => setExpandedProjectId(project.project_id)}
              className="project-card2 cursor-pointer flex items-center gap-4 rounded-xl p-3 bg-white/10 backdrop-blur-xs hover:bg-white/20 transition-colors duration-200"
            >
              <div className="logo flex-shrink-0 w-12 h-12 md:w-16 md:h-16">
                <img
                  className="w-full h-full object-contain object-left-top"
                  src={`/src/assets/img/company/card/${project.company_logo_path}`}
                  alt={project.company}
                />
              </div>
              <div className="project-info overflow-hidden">
                <h2 className="text-base sm:text-lg md:text-xl leading-snug text-white font-light break-words line-clamp-2">
                  {project.project_name}
                </h2>
                <span className="text-white/70 text-xs md:text-sm truncate block">
                  {project.company}
                </span>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Expanded project */}
      <AnimatePresence>
        {expandedProject && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white overflow-y-auto z-10"
          >
            {/* Close button */}
            <button
              onClick={() => setExpandedProjectId(null)}
              className="absolute top-4 left-4 text-white text-xl bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="logo w-16 h-16 flex-shrink-0">
                <img
                  className="w-full h-full object-contain"
                  src={`/src/assets/img/company/card/${expandedProject.company_logo_path}`}
                  alt={expandedProject.company}
                />
              </div>
              <div className="project-info">
                <h2 className="text-2xl font-bold mb-1">{expandedProject.project_name}</h2>
                <span className="text-white/70 text-sm">{expandedProject.company}</span>
              </div>
            </div>

            {/* Description */}
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

            {/* Technologies */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Tecnologías utilizadas</h3>
              <div className="flex flex-wrap gap-4">
                {expandedProject.technologies.map((techId: number, index: number) => {
                  const tech = technologies.find(t => t.id === techId);
                  if (!tech) return null;
                  const logoPath = `/src/assets/img/icon/${tech.logo_path}${tech.extension}`;
                  return (
                    <div
                      key={index}
                      className="tech-icon flex flex-col items-center text-xs text-white/80"
                    >
                      <img
                        src={logoPath}
                        alt={`${tech.name} icon`}
                        className="w-8 h-8 object-contain mb-1"
                      />
                      <span>{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelineProjectNavigator;

{
    /**
     * {tab-projects w-full h-[90vh] overflow-y-auto scrollbar-white p-4 grid ${
                          projects.length <= 4
                            ? 'place-content-center'
                            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
                        } gap-4}
     */
}
