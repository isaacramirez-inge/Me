import type { MainCardData, Technology } from '../../components/_react/timeline/TimelineTypes'; 

export type DataName = 'timeline' | 'technologies';

export const buyData = async (what: DataName) => {
    switch (what) {
        case 'timeline':
            const timeline: MainCardData[] = (await import('../../assets/data/timeline.json')).default.jobs_history ;
            return timeline;
        case 'technologies':
            const techs: Technology[] = (await import('../../assets/data/technologies.json')).default;
            return techs;
        default:
            return null;
    }
}
