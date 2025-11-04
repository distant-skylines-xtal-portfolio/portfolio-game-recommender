import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { type JSX } from 'react';

export default function LoadingScreen(): JSX.Element {
    const [displayedText, setDisplayedText] = useState('');

    const fullText = 'Loading game data...';
    const triangleSize = 60;
    const centerX = 0;
    const centerY = 20;
    const radius = 40;

    useEffect(() => {
        let index = 0;
        const nextCharInterval = setInterval(() => {
            setDisplayedText(fullText.substring(0, index + 1));
            index += 1;
            if (index >= fullText.length) {
                clearInterval(nextCharInterval);
            }
        }, 100);

        return () => clearInterval(nextCharInterval);
    }, []);

    const trianglePositions = [
        { x: centerX, y: centerY - radius },
        { x: centerX + radius * 0.866, y: centerY + radius * 0.5 },
        { x: centerX - radius * 0.866, y: centerY + radius * 0.5 },
    ];

    const getTrianglePath = () => {
        const height = triangleSize * 0.866; // height of equilateral triangle
        const halfBase = triangleSize / 2;
        return `M 0,-${height * 0.667} L ${halfBase},${height * 0.333} L -${halfBase},${height * 0.333} Z`;
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="loading-container"
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
            >
                <motion.div
                    className="loading-screen"
                    style={{
                        position: 'relative',
                    }}
                >
                    <svg
                        width="200"
                        height="180"
                        viewBox="-100 -80 200 160"
                        style={{ display: 'block' }}
                    >
                        {trianglePositions.map((pos, index) => (
                            <motion.g
                                key={`loading-triangle-${index}`}
                                style={{
                                    x: pos.x,
                                    y: pos.y,
                                }}
                            >
                                {/* Triangle with stroke animation */}
                                <motion.path
                                    d={getTrianglePath()}
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    style={{
                                        originX: 0.5,
                                        originY: 0.5,
                                    }}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: [0, 1, 1, 0],
                                        opacity: [0, 1, 1, 0],
                                        rotate: [0, 120, 120, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: index * 0.4,
                                        ease: 'easeInOut',
                                    }}
                                ></motion.path>
                            </motion.g>
                        ))}
                    </svg>
                    <motion.p
                        className="loading-text"
                        style={{
                            position: 'absolute',
                            left: 20,
                            top: 160,
                        }}
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                            delay: 0.5,
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        {displayedText}
                    </motion.p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
