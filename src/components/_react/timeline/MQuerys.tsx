import type { MediaQueryAllQueryable } from 'react-responsive';

export interface MQuery extends Partial<MediaQueryAllQueryable> {
    query: string;
}

export const mobile: MQuery = { query: "(max-width: 768px)" };
export const desktop: MQuery = { query: "(min-width: 769px)" };
export const tablet: MQuery = { query: "(min-width: 481px) and (max-width: 768px)" };