import type { MainCardData, Technology } from "./TimelineTypes";
import {ContextTimeline} from "./timeline-context";

export interface ContextTimelineData {
    jobs_history: MainCardData[];
    technologies: Technology[];
}   

export interface ContextTimelineProviderProps {
    children: React.ReactNode;
    value: ContextTimelineData;
}

export const ContextTimelineProvider = ({ children, value }: ContextTimelineProviderProps) => {
    return (
        <ContextTimeline.Provider value={value}>
            {children}
        </ContextTimeline.Provider>
    );
};
