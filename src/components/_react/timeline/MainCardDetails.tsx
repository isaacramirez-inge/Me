import React, { useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import ProjectGrid from './ProjectGrid';
import type { MainCardDetailsProps } from './TimelineTypes';
import './MainCardDetails.css';
import TechIconCloud from './TechIconCloud';



const MainCardDetails: React.FC<MainCardDetailsProps> = ({group, expanded, stickyRefs, menuBarRef}) => {                            
    const numProjects = group.projects.length;
    const [expandedProjects, setExpandedProjects] = useState<{ [company: string]: boolean }>({});
    const [expandedDetails, setExpandedDetails] = useState<{ [company: string]: boolean }>({});
    const [hasTechs, setHasTechs] = useState<{ [company: string]: boolean }>({});
    
    // Context is available for future use

    const handleToggleProjects = (company: string) => {
        setExpandedProjects(prev => ({ ...prev, [company]: !prev[company] }));
      };
    
      const handleShowDetails = (company: string) => {
        if (expandedDetails[company]) {
          setExpandedProjects(p => ({ ...p, [company]: false }));
          setTimeout(() => setExpandedDetails(d => ({ ...d, [company]: false })), 200);
        } else {
          setExpandedDetails(d => ({ ...d, [company]: true }));
        }       
      };
      useEffect(() => {
          setHasTechs(c => ({ ...c, [group.company]: group.projects.some(p => p.technologies.length > 0) }));
      }, [group]);

    return (
    <>
    <div
        className={`tv-company-header${expanded[group.company] ? ' expanded' : ''}`}
        ref={el => { stickyRefs[group.company] = el; }}
        style={{top: '-18px'}}
    >
        <div className="tv-company-items-container">
        <img src={`/src/assets/img/company/${group.logo_url}`} alt={group.company} className="tv-company-logo" />
        <div className="tv-company-info">
            <h2 className="tv-company-name">{group.company}</h2>
        </div>
        {/* Botón para expandir/colapsar detalles */}
        { 
        (
            group.job_roles?.length > 0 
            && (group.job_roles[0].responsabilities.length > 0 
                || group.job_roles.length > 1)
        ) 
            &&
            <button
            className="tv-show-details-btn"
            onClick={e => {
                e.stopPropagation();
                handleShowDetails(group.company);
            }}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: '#1976d2', fontWeight: 600, fontSize: '0.97rem', cursor: 'pointer', padding: '0.2rem 0.7rem', marginLeft: '0.7rem', position: 'relative' }}
            >
            {expandedDetails[group.company] ? 'Ocultar detalles' : 'Mostrar detalles'}
            <BiChevronDown style={{ marginLeft: 4, fontSize: 20, transform: expandedDetails[group.company] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
        }
        </div>
        {/* Barra de proyectos sticky, solo si detalles expandidos y hay proyectos */}
        {expandedDetails[group.company] && numProjects > 0 && (
        <div className="tv-projects-bar" style={{margin: '4px 0'}}>
            <button
            className="tv-show-details-btn"
            onClick={() => handleToggleProjects(group.company)}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: '#1976d2', fontWeight: 600, fontSize: '0.97rem', cursor: 'pointer', padding: '0.2rem 0.7rem', marginLeft: '0.7rem', position: 'relative' }}
            >
            {expandedProjects[group.company] ? 'Ocultar proyectos' : `Ver proyectos (${numProjects})`}
            <BiChevronDown style={{ marginLeft: 4, fontSize: 20, transform: expandedProjects[group.company] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
        </div>
        )}
    </div>
    <div
        className={`tv-company-roles-tech-row${expandedDetails[group.company] ? ' expanded' : ''}`}
        style={{ maxHeight: expandedDetails[group.company] ? 800 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
    >
        {/* Botón para expandir/colapsar proyectos */}
        <div className="tv-roles-box">
            <div className="tv-company-roles-info"
            style={{width: hasTechs[group.company] ? '70%' : '100%'}}>
                {(() => {
                    if (group.job_roles && group.job_roles.length > 0) {
                        return group.job_roles.map((role, idx) => (
                        <div key={role.job_role_id || idx} className="tv-company-role-block" 
                            style={{marginBottom: role.responsabilities && role.responsabilities.length > 0 ? '1rem' : '0.25rem',
                                paddingBottom: role.responsabilities && role.responsabilities.length > 0 ? '0.5rem' : '0'
                            }}>
                            <div className="tv-company-role-title">{role.job_role}</div>
                            {role.responsabilities && role.responsabilities.length > 0 && (
                            <ul className="tv-company-role-responsabilities">
                                {role.responsabilities.map((r, ridx) => (
                                <li key={ridx}>{r.description}</li>
                                ))}
                            </ul>
                            )}
                        </div>
                        ));
                    } else {
                        return <p className="tv-company-desc">{group.description}</p>;
                    }
                })()}
            </div>
            {hasTechs[group.company] && (
                <div className="tv-company-techs-icons">
                    <TechIconCloud technologies={group.projects.flatMap(p => p.technologies)} />
                </div>
            )}
        </div>
    </div>
    {/* Proyectos: solo si barra expandida */}
    {expandedProjects[group.company] && expandedDetails[group.company] && 
    <ProjectGrid projects={group.projects} />}
                    
    </>)
  }

export default MainCardDetails;
