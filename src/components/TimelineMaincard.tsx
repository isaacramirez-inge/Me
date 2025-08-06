import React, { useEffect, useState, useRef } from 'react';
import type { MainCardData, JobRole, Project } from '../components/_react/timeline/TimelineTypes';
import TechIconCloud from '../components/_react/timeline/TechIconCloud';
import TimelineProjectNavigator from './TimelineProjectNavigator';

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
    const [hasTechs, setHasTechs] = useState<boolean>(false);
    const [roles, setRoles] = useState<RolView[]>([]);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [showChat, setShowChat] = useState<boolean>(true);
    const borderb = "border-2 border-white";
    useEffect(() => {
        setTabs([]);
        setHasTechs(group.projects.some(p => p.technologies.length > 0));
        const hasResume: boolean = !!(group.resume && group.resume.length > 0);

        if(group.job_roles && group.job_roles.length > 0){
            setTabs(prev => [...prev, {tabname: 'general',tabtext: 'General', selected: !hasResume, tab: group.job_roles}]);
        }
        if(group.projects && group.projects.length > 0){
            setTabs(prev => [...prev, {tabname: 'projects', tabtext: 'Proyectos', selected: false, tab: group.projects}]);
        }
        if(group.resume && group.resume.length > 0){
            setTabs(prev => [...prev, {tabname: 'resume',tabtext: 'Resumen', selected: hasResume, tab: group.resume || ""}]);
        }
        setRoles([]);
        const have_selected = group.job_roles.some(r => r.show_first);
        setRoles(group.job_roles.map((role, idx) => ({selected: (have_selected ? role.show_first || false : idx === 0) , role: role})));
    }, [group]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const event = new CustomEvent('maincard-visible', {
                        detail: { group, index }
                    });
                    window.dispatchEvent(event);
                } else {
                    const event = new CustomEvent('maincard-hidden', {
                        detail: { group, index }
                    });
                    window.dispatchEvent(event);
                }

            },
            {
                root: null, // observing intersections relative to the viewport
                threshold: 0.5 // trigger when 50% of the element is visible
            }
        );

        const currentCardRef = cardRef.current;
        if (currentCardRef) {
            observer.observe(currentCardRef);
        }

        return () => {
            if (currentCardRef) observer.unobserve(currentCardRef);
        };
    }, [group]);

    return (
    <div ref={cardRef} id="card-content" className={`maincard-content ${showChat && 'md:ml-[20%]'}  flex flex-col md:flex-row h-full w-full `}>
        <div className={`header-company-container flex flex-col w-full md:w-2/5 h-1/2 md:h-full `} >

            <div className="header-company-data flex flex-row w-full h-[30%]">
                <div className="image-company w-[25%] h-full">
                    <img className='h-full object-contain object-left-top' src={`/src/assets/img/company/${group.logo_url}`} alt={group.company} />
                </div>
                <div className="line ml-1 mr-1 h-[100dvh] w-[4px] bg-white/50 transform- "></div>
                <div className="tv-company-info w-[75%] h-full px-10">
                    <h2 className="tv-company-name font-bold weights-bold sm:text-s  md:text-xl leading-relaxed">{group.company}</h2>
                    <p className="tv-company-desc border-b-2 border-white">{dates}</p>

                    <div className="tab-buttons flex gap-1 md:gap-2 ">
                        {(() => {
                            return tabs.map((tab, idx) => (
                                <button key={idx} 
                                    className={`tab-button z-50 ${tab.selected ? 'selected' : ''}`}
                                    onClick={() => {
                                        setTabs(prev => prev.map(t => ({...t, selected: t.tabname === tab.tabname})));
                                    }}
                                >
                                    <span className="">{tab.tabtext}</span>
                                </button>
                            ))
                        })()}
                    </div>
                </div>
            </div>
            <div className="company-icons-container z-10 relative w-full h-[70%]">
                <div className="company-icons-middle w-full h-full absolute right-0 bottom-0 ">
                    <TechIconCloud technologies={techs} />
                </div>
            </div>
        </div>
        <div className={`tab-container w-full md:w-3/5 h-1/2 md:h-full flex p-1 flex flex-wrap content-center justify-center`} >
        {(() => {
            const st = tabs.find(tab => tab.selected);

            switch(st?.tabname){
                case 'general':
                    return (
                    <div className="tab-roles flex flex-col leading-relaxed p-4 w-full h-full max-w-[100%] max-h-[100%] overflow-hidden">
                        <div className="role-responsabilities relative flex-1 overflow-auto scrollbar-white mt-4">
                            {roles.map((role, i) =>(
                                <div
                                    key={i}
                                    className={`role-resp-list-container flex flex-col gap-2 justify-center items-center absolute top-0 left-0 w-full h-full overflow-y-auto p-4 `}
                                    style={{display: role.selected ? 'flex' : 'none'}}
                                >
                                    <div className="roles-ticky sticky top-0">
                                        <div className="roles-titles flex justify-around items-center flex flex-wrap gap-2">
                                            {roles.map((role, idx) => (
                                            <button
                                                type="button"
                                                key={idx}
                                                className={`${role.selected && 'selected'} text-sm md:text-base px-2 py-1 rounded-full shadow transition`}
                                                onClick={() => {
                                                    setRoles(prev => prev.map(r => ({...r, selected: r.role.job_role_id === role.role.job_role_id})));
                                                }}
                                            >
                                                <span>{role.role.job_role}</span>
                                            </button>
                                            ))}
                                        </div>
                                    </div>
                                    <ul className="mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-white/90 font-light whitespace-pre-line list-disc pl-4  space-y-1">
                                    {role.role.responsabilities.map((r, ridx) => (
                                        <li key={ridx}>{r.description}</li>
                                    ))}
                                    </ul>
                                </div>
                                )
                            )}
                        </div>
                    </div>
                    )
                case 'projects':
                    return (
                        <TimelineProjectNavigator projects={(st.tab as Project[])} />
                    )
                case 'resume':
                    return (
                        <div className="tab-resume w-full h-[90vh] overflow-y-auto px-6 py-4 flex-wrap scrollbar-white flex flex wrap justify-center items-center">
                            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-white/90 font-light whitespace-pre-line">
                                {(st.tab as string)} 
                            </p>
                        </div>
                    )
                default:
                    return (<h1 className='mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-white/90 font-light whitespace-pre-line'>Loading ...</h1>);
            }

        })()}
           
        </div>     
    </div>)
  }

export default TimelineMaincard;
