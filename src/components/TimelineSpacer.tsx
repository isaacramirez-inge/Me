import React, { useEffect, useRef } from 'react';
import MainText from './MainText';
import type { Translation } from '../types/types';

interface Props {
    t: Translation
}
const TimelineSpacer: React.FC<Props> = ({t}) => {
    const spacerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const event = new CustomEvent('maincard-spacer-visible', {
                    detail: entry.isIntersecting,
                });
                window.dispatchEvent(event);
                
            },
            {
                root: null,
                threshold: 0.5, // You can adjust the threshold as needed
            }
        );

        const currentSpacerRef = spacerRef.current;
        if (currentSpacerRef) {
            observer.observe(currentSpacerRef);
        }

        return () => {
            if (currentSpacerRef) observer.unobserve(currentSpacerRef);
        };
    }, []);

    useEffect(() => {
        
        const options = {
            threshold: 0.2 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.scrollIntoView({ behavior: 'smooth' });
            }
            });
        }, options);

        document.querySelectorAll('.main-spacer').forEach(card => {
            observer.observe(card);
        });

        return () => { observer.disconnect(); };
    }, []);

    return (
        <div ref={spacerRef} id='main-spacer' className="main-spacer h-screen text-white flex items-center justify-center">
            <MainText  t={t} />
        </div>
    );
}
export default TimelineSpacer;