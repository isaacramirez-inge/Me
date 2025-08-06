import React, { useEffect, useRef } from 'react';

const TimelineSpacer: React.FC = () => {
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

    return (
    <div ref={spacerRef} className="maincard h-screen text-white flex items-center justify-center"> &nbsp;</div>
    );
}
export default TimelineSpacer;