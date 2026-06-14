import React, { useEffect } from 'react';
type BubblePosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
type BubbleMirror = 'x' | 'y' | 'xy';


export interface BotBubbleDispatcherProps {
    mirror: BubbleMirror;
    redraw: number;
    message:string;
    node: React.ReactNode;
    position: BubblePosition;
    timeout: number;
    children: React.ReactNode;
}

const getPositionClasses = (position: BubblePosition) => {
    switch (position) {
        case 'top-start':
                    return 'top-0 left-0 transform -translate-y-full -translate-x-full rounded-br-none';
        case 'top-end':
                    return 'top-0 right-0 transform -translate-y-full translate-x-full rounded-bl-none ';
        case 'bottom-start':
                    return 'bottom-0 left-0 transform translate-y-full';
        case 'bottom-end':
                    return 'bottom-0 right-0 transform translate-y-full';
        default:
            return '';
    }
};



const BotBubbleDispatcher: React.FC<BotBubbleDispatcherProps> = ({message, node, mirror, timeout, position, redraw, children}) => {
    const [showBubble, setShowBubble] = React.useState(false);
    const positionClasses = getPositionClasses(position);
    const [redrawCount, setRedrawCount] = React.useState(0);
    const [vibrate, setVibrate] = React.useState(false);

    const toggleBubble = () => {
        setShowBubble(!showBubble);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowBubble(true);
        }, timeout * 1000);
    
        return () => clearTimeout(timeoutId);
    }, [timeout]);

    useEffect(() => {
        if (redraw > 0) {
            setRedrawCount(redrawCount + 1);
            if(showBubble){
                setVibrate(true);
                setTimeout(() => {
                    setVibrate(false);
                }, 500);
            }else{
                setShowBubble(true);
            }
        }
    }, [redraw]);

    return (
        <div className='w-full h-full relative flex flex-col justify-center items-center'
                onClick={toggleBubble}>
            {message && showBubble &&  (
                <div className={`absolute h-1/2 w-1/2 ${vibrate ? 'vibrate' : ''}`} >
                   <div className={`absolute raleway2 rounded${node ? '-2xl' : '-full'} ${positionClasses} animate w-full text-xs p-2 bg-purple-600 text-white`} 
                        style={{
                            width: '300%',
                            maxWidth:'500%',
                            fontSize: '10px',  
                            lineHeight: '1.2' 
                        }}
                        onClick={(e) => {return; e.stopPropagation()}}>
                        {message}
                        {node && node}
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default BotBubbleDispatcher;
