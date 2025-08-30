import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import type { MainCardData, JobRole, Project, Technology } from '../components/_react/timeline/TimelineTypes';
import TechIconCloud from '../components/_react/timeline/TechIconCloud';
import TimelineProjectNavigator from './TimelineProjectNavigator';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../styles/breakpoints';
import TimelineEffectObserver from '../components/TimelineEffectObserver';
import type {Translation} from '../types/types';
type TabName = 'general' | 'projects' | 'resume';

interface MainCardDataProps {
    group: MainCardData;
    dates: string;
    techs: number[];
    index: number;
    techAll: Technology[];
    base_path: string;
    t: Translation;
}

interface GeneralTabProps {
    roles: JobRole[];
}
const GeneralTab = memo(({ roles }: GeneralTabProps) => {
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    useEffect(() => {
        const have_selected = roles.some(r => r.show_first);
        const initialRole = have_selected ? roles.find(r => r.show_first)?.job_role_id : roles[0]?.job_role_id;
        setSelectedRole(initialRole || null);
    }, [roles]);

    if (!selectedRole) return null;
    const currentRole = roles.find(r => r.job_role_id === selectedRole);

    return (
        <div className="tab-roles flex flex-col  justify-center items-center p-2 md:p-4 w-full h-full max-w-full max-h-full overflow-hidden">
            <div className=" bg-black/20 backdrop-blur-sm py-2 w-full z-10">
                <div className="roles-titles flex justify-center items-center flex-wrap gap-2">
                    {roles.map((role, idx) => (
                        <button
                            type="button"
                            key={idx}
                            className={`${selectedRole === role.job_role_id && 'selected'} text-base xs:text-lg leading-relaxed text-white/90 px-2 py-1 rounded-full shadow transition`}
                            onClick={() => setSelectedRole(role.job_role_id)}
                        >
                            <span>{role.job_role}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-auto overflow-auto scrollbar-white">
                {currentRole && (
                    <ul className="mx-auto text-sm md:text-base leading-relaxed text-white/90 font-light whitespace-pre-line list-disc pl-4 space-y-1 mt-2">
                        {currentRole.responsabilities.map((r, ridx) => <li key={ridx}>{r.description}</li>)}
                    </ul>
                )}
            </div>
        </div>
    );
});

interface ProjectsTabProps {
    projects: Project[];
    techAll: Technology[];
    base_path: string;
}
const ProjectsTab = memo(({ projects, techAll, base_path }: ProjectsTabProps) => {
    return <TimelineProjectNavigator base_path={base_path} techAll={techAll} projects={projects} />;
});

interface ResumeTabProps {
    resume: string;
}
const ResumeTab = memo(({ resume }: ResumeTabProps) => {
    return (
        <div className="tab-resume w-full h-full overflow-y-auto px-2 md:px-6 py-4 flex-wrap scrollbar-white flex justify-center items-center">
            <p className="max-w-3xl mx-auto text-sm xs:text-xl md:text-2xl leading-relaxed text-white/90 font-light whitespace-pre-line">
                {resume}
            </p>
        </div>
    );
});

// ---

const TimelineMaincard: React.FC<MainCardDataProps> = ({ group, dates, techs, techAll, index ,t, base_path}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<TabName>('general');
    const isMobile = useMediaQuery({ query: breakpoints.mobile });
    const tabs: { tabname: TabName; tabtext: string }[] = useMemo(() => {
        const newTabs = [];
        const hasResume = !!(group.resume && group.resume.length > 0);
        if (group.job_roles && group.job_roles.length > 0) {
            newTabs.push({ tabname: 'general' as TabName, tabtext: t.home.tabnames.roles });
        }
        if (group.projects && group.projects.length > 0) {
            newTabs.push({ tabname: 'projects' as TabName, tabtext: 'Proyectos' });
        }
        if (hasResume) {
            newTabs.push({ tabname: 'resume' as TabName, tabtext: 'Resumen' });
        }
        return newTabs;
    }, [group]);

    useEffect(() => {
        const hasResume = !!(group.resume && group.resume.length > 0);
        setActiveTab(hasResume ? 'resume' : 'general');
    }, [group]);

    const CompanyInfo = useMemo(() => (
        <div className="header-company-data flex flex-row w-full h-full items-center">
            <div className="image-company w-[25%] h-full">
                <img className='h-full w-full object-contain object-center' src={`/${base_path}/img/company/${group.logo_url}`} alt={group.company} 
                loading="lazy"/>
            </div>
            <div className="tv-company-info w-[75%] h-full px-4 md:px-10 flex flex-col justify-center">
                <h2 className="tv-company-name font-bold sm:text-lg xs:text-xl leading-relaxed">{group.company}</h2>
                <p className="tv-company-desc border-b-2 border-white text-sm md:text-base">{dates}</p>
            </div>
        </div>
    ), [group, dates]);

    const Technologies = useMemo(() => (
        <div className="company-icons-container z-10 relative w-full h-full">
            <div className="company-icons-middle w-full h-full absolute right-0 bottom-0">
                <TechIconCloud base_path={base_path} technologies={techs} techAll={techAll} />
            </div>
        </div>
    ), [techs, techAll]);

    const TabButtons = useMemo(() => (
        tabs.length <= 1 ? null : 
        <div className="tab-buttons flex gap-1 md:gap-2 justify-center mt-2 md:mt-0">
            {tabs.map((tab, idx) => (
                <button
                    key={idx}
                    className={`tab-button rounded-full z-10 ${activeTab === tab.tabname ? 'selected' : ''}`}
                    onClick={() => {
                        if (tabs.length > 1) {
                        setActiveTab(tab.tabname);
                        }
                    }}
                >
                    <span className="text-sm xs:text-l">{tab.tabtext}</span>
                </button>
            ))}
        </div>
    ), [tabs, activeTab]);

    return (
        <div ref={cardRef} id="card-content" className="maincard-content transition flex flex-col md:flex-row h-full w-full p-2 md:p-0">
            <TimelineEffectObserver type={group.type}/> 

            {isMobile ? (
                <>
                    <div className="flex-shrink-0 h-[15%] w-full">{CompanyInfo}</div>
                    
                    <div className="flex-shrink-0">{TabButtons}</div>
                    <div className="flex-grow h-[30%] w-full relative">
                        {/* Renderizar todas las pestañas y usar CSS para mostrarlas/ocultarlas */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'general' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            {group.job_roles && <GeneralTab roles={group.job_roles} />}
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'projects' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            {group.projects && <ProjectsTab base_path={base_path} projects={group.projects} techAll={techAll} />}
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'resume' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            {group.resume && <ResumeTab resume={group.resume} />}
                        </div>
                    </div>
                    {techs.length > 0 && <div className="flex-grow w-full">{Technologies}</div>}
                </>
            ) : (
                <>
                    <div className="header-company-container flex flex-col w-2/5 h-full p-4">
                        <div className="h-[30%]">{CompanyInfo}</div>
                        <div className="flex-shrink-0">{TabButtons}</div>
                        <div className="h-[70%]">{Technologies}</div>
                    </div>
                    <div className="tab-container w-3/5 h-full flex flex-col p-1 justify-center relative">
                        {/* Renderizar todas las pestañas y usar CSS para mostrarlas/ocultarlas */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'general' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            {group.job_roles && <GeneralTab roles={group.job_roles} />}
                        </div>
                        <div className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${activeTab === 'projects' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            {group.projects && <ProjectsTab base_path={base_path} projects={group.projects} techAll={techAll} />}
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'resume' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                            {group.resume && <ResumeTab resume={group.resume} />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TimelineMaincard;