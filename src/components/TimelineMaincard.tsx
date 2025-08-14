import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { MainCardData, JobRole, Project } from '../components/_react/timeline/TimelineTypes';
import TechIconCloud from '../components/_react/timeline/TechIconCloud';
import TimelineProjectNavigator from './TimelineProjectNavigator';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../styles/breakpoints';

type TabName = 'general' | 'projects' | 'resume';

interface MainCardDataProps {
    group: MainCardData;
    dates: string;
    techs: number[];
    index: number; // Add index prop
}
export interface Tab{
    tabname: TabName;
    tabtext: string;
    selected: boolean;
    tab: Project[] | JobRole[] | string;
}
interface RolView{
    selected:boolean;
    role:JobRole;
}

const TimelineMaincard: React.FC<MainCardDataProps> = ({group, dates, techs, index}) => { 
    const cardRef = useRef<HTMLDivElement>(null);
    const [roles, setRoles] = useState<RolView[]>([]);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const isMobile = useMediaQuery({ query: breakpoints.mobile });

    useEffect(() => {
        const newTabs: Tab[] = [];
        const hasResume = !!(group.resume && group.resume.length > 0);

        if (group.job_roles && group.job_roles.length > 0) {
            newTabs.push({ tabname: 'general', tabtext: 'General', selected: !hasResume, tab: group.job_roles });
        }
        if (group.projects && group.projects.length > 0) {
            newTabs.push({ tabname: 'projects', tabtext: 'Proyectos', selected: false, tab: group.projects });
        }
        if (hasResume) {
            newTabs.push({ tabname: 'resume', tabtext: 'Resumen', selected: true, tab: group.resume || "" });
        }
        setTabs(newTabs);

        const have_selected = group.job_roles.some(r => r.show_first);
        setRoles(group.job_roles.map((role, idx) => ({ selected: (have_selected ? role.show_first || false : idx === 0), role: role })));
    }, [group]);

    const CompanyInfo = useMemo(() => (
        <div className="header-company-data flex flex-row w-full h-full items-center">
            <div className="image-company w-[25%] h-full">
                <img className='h-full w-full object-contain object-center' src={`/src/assets/img/company/${group.logo_url}`} alt={group.company} />
            </div>
            <div className="tv-company-info w-[75%] h-full px-4 md:px-10 flex flex-col justify-center">
                <h2 className="tv-company-name font-bold sm:text-lg md:text-xl leading-relaxed">{group.company}</h2>
                <p className="tv-company-desc border-b-2 border-white text-sm md:text-base">{dates}</p>
            </div>
        </div>
    ), [group, dates]);

    const Technologies = useMemo(() => (
        <div className="company-icons-container z-10 relative w-full h-full">
            <div className="company-icons-middle w-full h-full absolute right-0 bottom-0">
                <TechIconCloud technologies={techs} />
            </div>
        </div>
    ), [techs]);

    const TabButtons = useMemo(() => (
        <div className="tab-buttons flex gap-1 md:gap-2 justify-center mt-2 md:mt-0">
            {tabs.map((tab, idx) => (
                <button key={idx}
                    className={`tab-button z-50 ${tab.selected ? 'selected' : ''}`}
                    onClick={() => setTabs(prev => prev.map(t => ({ ...t, selected: t.tabname === tab.tabname })))}
                >
                    <span className="text-sm md:text-base">{tab.tabtext}</span>
                </button>
            ))}
        </div>
    ), [tabs]);

    const TabContent = useMemo(() => {
        const st = tabs.find(tab => tab.selected);
        switch (st?.tabname) {
            case 'general':
                return (
                    <div className="tab-roles flex flex-col leading-relaxed p-2 md:p-4 w-full h-full max-w-full max-h-full overflow-hidden">
                        <div className="role-responsabilities relative flex-1 overflow-auto scrollbar-white">
                            {roles.map((role, i) => (
                                <div key={i} className="role-resp-list-container flex flex-col gap-2 justify-center items-center absolute top-0 left-0 w-full h-full overflow-y-auto p-2 md:p-4" style={{ display: role.selected ? 'flex' : 'none' }}>
                                    <div className="roles-ticky sticky top-0 bg-black/20 backdrop-blur-sm py-2 w-full">
                                        <div className="roles-titles flex justify-center items-center flex-wrap gap-2">
                                            {roles.map((r, idx) => (
                                                <button type="button" key={idx} className={`${r.selected && 'selected'} text-xs md:text-base px-2 py-1 rounded-full shadow transition`} onClick={() => setRoles(prev => prev.map(pr => ({ ...pr, selected: pr.role.job_role_id === r.role.job_role_id })))}>
                                                    <span>{r.role.job_role}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <ul className="mx-auto text-sm md:text-base leading-relaxed text-white/90 font-light whitespace-pre-line list-disc pl-4 space-y-1 mt-2">
                                        {role.role.responsabilities.map((r, ridx) => <li key={ridx}>{r.description}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'projects': return <TimelineProjectNavigator projects={(st.tab as Project[])} />;
            case 'resume': return (
                <div className="tab-resume w-full h-full overflow-y-auto px-2 md:px-6 py-4 flex-wrap scrollbar-white flex justify-center items-center">
                    <p className="max-w-3xl mx-auto text-sm md:text-base leading-relaxed text-white/90 font-light whitespace-pre-line">
                        {(st.tab as string)}
                    </p>
                </div>
            );
            default: return <h1 className='mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-white/90 font-light whitespace-pre-line'>Loading content ...</h1>;
        }
    }, [tabs, roles]);

    return (
        <div ref={cardRef} id="card-content" className="maincard-content transition flex flex-col md:flex-row h-full w-full p-2 md:p-0">
            {isMobile ? (
                <>
                    <div className="flex-shrink-0 h-[20%] w-full">{CompanyInfo}</div>
                    <div className="flex-grow h-[45%] w-full">{Technologies}</div>
                    <div className="flex-shrink-0 h-[5%] w-full">{TabButtons}</div>
                    <div className="flex-grow h-[30%] w-full">{TabContent}</div>
                </>
            ) : (
                <>
                    <div className="header-company-container flex flex-col w-2/5 h-full p-4">
                        <div className="h-[30%]">{CompanyInfo}</div>
                        <div className="h-[70%]">{Technologies}</div>
                    </div>
                    <div className="tab-container w-3/5 h-full flex flex-col p-1 justify-center">
                        <div className="flex-shrink-0">{TabButtons}</div>
                        <div className="flex-grow mt-2">{TabContent}</div>
                    </div>
                </>
            )}
        </div>
    );
}

export default TimelineMaincard;
