import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../styles/animatedHeader.css';
import type { JSX } from 'react';


type FloatingShape = {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    shape: 'circle' | 'square' | 'triangle';
};

export function AnimatedHeader(): JSX.Element {
    const shouldReduceMotion = useReducedMotion();
    const [shapes, setShapes] = useState<FloatingShape[]>([]);


    useEffect(() => {

        // Don't animate if user prefers reduced motion
        if (shouldReduceMotion) return;

        // Generate fewer shapes for mobile
        const isMobile = window.innerWidth < 768;
        const shapeCount = isMobile ? 3 : 5;

        const generatedShapes: FloatingShape[] = Array.from(
            { length: shapeCount },
            (_, i) => ({
                id: i,
                x: Math.random() * 100, // Random x position (%)
                y: Math.random() * 100, // Random y position (%)
                size: isMobile ? 30 + Math.random() * 40 : 40 + Math.random() * 60,
                duration: 15 + Math.random() * 10, // 15-25 seconds
                delay: i * 2, // Stagger the animations
                shape: ['circle', 'square', 'triangle'][
                    Math.floor(Math.random() * 3)
                ] as 'circle' | 'square' | 'triangle',
            }),
        );

        setShapes(generatedShapes);
    }, [shouldReduceMotion]);

    function getShapePath(shape: 'circle' | 'square' | 'triangle', size: number): JSX.Element {
        switch (shape) {
            case 'circle':
                return (
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2}
                        fill="currentColor"
                    />
                );
            case 'square':
                return (
                    <rect
                        width={size}
                        height={size}
                        fill="currentColor"
                    />
                );
            case 'triangle':
                const points = `${size / 2},0 ${size},${size} 0,${size}`;
                return <polygon points={points} fill="currentColor" />;
        }
    }

    return (
        <header className="animated-header">
            
            {/* Animated gradient background */}
            <motion.div
                className="gradient-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className='igdb-subtitle'>
                    Powered by IGDB
                </div>
            </motion.div>

            {/* Floating shapes */}
            {!shouldReduceMotion && shapes.length > 0 && (
                <div className="shapes-container">
                    {shapes.map((shape) => (
                        <motion.div
                            key={shape.id}
                            className="floating-shape"
                            style={{
                                left: `${shape.x}%`,
                                top: `${shape.y}%`,
                                width: shape.size,
                                height: shape.size,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                                scale: [1, 1.2, 1],
                                rotate: [0, 360],
                                y: [-20, 20, -20],
                            }}
                            transition={{
                                duration: shape.duration,
                                delay: shape.delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <svg
                                width={shape.size}
                                height={shape.size}
                                viewBox={`0 0 ${shape.size} ${shape.size}`}
                            >
                                {getShapePath(shape.shape, shape.size)}
                            </svg>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Header content */}
            <motion.div
                className="header-content"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Game Recommendations
                </motion.h1>
                <motion.p
                    className="header-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Discover your next favorite game
                </motion.p>
                
            </motion.div>
            
        </header>
    );
}

export default AnimatedHeader;