import React, { useContext, useEffect } from 'react';
import './ResumeList.css';
import { ContextTimeline } from './timeline-context';
import type { MainCardData, Experience, JobRole, ResumeModalProps } from './TimelineTypes';


const ResumeList: React.FC<ResumeModalProps> = ({ onClose }) => {
  const { jobs_history } = useContext(ContextTimeline); 

  function formatDateOrActuality(dateStr?: string | null): string {
    if (!dateStr || dateStr === "1900-01-01") return "Actualidad";
    return new Date(dateStr).toLocaleDateString("es-ES", { 
      month: 'short', 
      year: 'numeric',
      timeZone: 'UTC' 
    });
  }

  const experience_summary: Experience[] = jobs_history
    .filter((job: MainCardData) => job.resume?.length ?? 0 > 0)
    .map((job: MainCardData) => (
    {
      company: job.company,
      logo: job.logo_url,
      roles: job.job_roles.map((role: JobRole) => role.job_role),
      summary: job.resume,
      order: job.orden,
      projects: job.projects.filter((project) => project.highlight).map((project) => ({
        name: project.project_name,
        company: project.company,
        logo: project.company_logo_path,
        order: project.orden,
      })),
      from_date: (() => {
        const minDateStr = job.job_roles.reduce((min: string, current: JobRole) => {
          if (!current.start_date) return min;
          return current.start_date < min ? current.start_date : min;
        }, "9999-12-31");
        console.log(job.company + " min " + minDateStr);
        return formatDateOrActuality(minDateStr);
      })(),
      to_date: (() => {
        const maxDateStr = job.job_roles.reduce((max: string, current: JobRole) => {
          if (!current.end_date) return max;
          return current.end_date > max ? current.end_date : max;
        }, "1900-01-01");
        console.log(job.company + " max " + maxDateStr);
        return formatDateOrActuality(maxDateStr);
      })()
    }
  ));

  useEffect(() => {
    if (!jobs_history) {
      onClose();
    }
  }, [jobs_history, onClose]);


  return (
    <>
        {experience_summary.map((experience, index) => (
        <div key={index} className="experience-section">
            <div className="experience-header">
            <div className="company-info">
                <div className="bloc1"> 
                <img 
                    src={`/src/assets/img/company/${experience.logo}`} 
                    alt={`${experience.company} logo`} 
                    className="company-logo"
                    onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <div>
                    <h2>{experience.company}</h2>
                    <p className="date-range">
                    {experience.from_date} - {experience.to_date}
                    </p>
                    <div className="roles">
                    {experience.roles.map((role, i) => (
                        <span key={i} className="role-tag">{role}</span>
                    ))}
                    </div>
                </div>
                </div>
                
                <div className="experience-summary">
                <p>{experience.summary}</p>
                </div>
            </div>
            
            </div>
            
            
            {experience.projects && experience.projects.length > 0 && (
            <div className="projects-section">
                <h3>Proyectos Destacados</h3>
                <div className="projects-grid-resume">
                {experience.projects.map((project, pIndex) => (
                    <div key={pIndex} className="project-card-resume">
                    <div className="project-header-resume">
                        <img 
                        src={`src/assets/img/company_clients/${project.logo}`} 
                        alt={`${project.company} logo`}
                        className="project-logo-resume"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        />
                        <div style={{ width: '100%' }}>
                        <h4>{project.name}</h4>
                        <p className="project-company">{project.company}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
            
        </div>
        ))}
    </>
  );
};

export default ResumeList;
