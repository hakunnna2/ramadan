
import { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const useCountUp = (end: number, duration: number = 2000): number => {
    const [count, setCount] = useState(0);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const counter = useRef<number>(0);
    // FIX: Changed useRef to have an initial value of null to avoid ambiguity with overloads.
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const animate = () => {
            counter.current++;
            const progress = easeOutExpo(counter.current / totalFrames);
            const currentCount = Math.round(end * progress);
            setCount(currentCount);

            if (counter.current < totalFrames) {
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                setCount(end); // ensure it ends on the exact number
            }
        };

        counter.current = 0;
        // Reset count to 0 when the 'end' value changes to re-trigger the animation
        setCount(0); 
        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current !== null) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end, duration]);

    return count;
};

export default useCountUp;