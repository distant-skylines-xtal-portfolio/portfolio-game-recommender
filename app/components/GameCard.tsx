import type { gameResult } from "~/types/resultTypes";
import {useContext, useEffect, useRef, useState, type JSX} from 'react'
import searchContext from "~/contexts/searchContext";
import { gameApi } from "~/services/gameapi.service";
import {AnimatePresence, motion, rgba } from "framer-motion";
import { coverRateLimiter } from "~/util/RateLimiter";
import type { ref } from "process";

type GameResultProps = {
    gameInfo: gameResult
};

export default function GameCard({gameInfo}:GameResultProps):JSX.Element {
    const tagsContext = useContext(searchContext);
    const cardRef = useRef<HTMLDivElement>(null);

    const [coverError, setCoverError] = useState<string | null>(null);
    const [coverLoading, setCoverLoading] = useState(false);
    const [coverUrl, setCoverUrl] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Have we already made API call to fetch cover, to prevent duplicates
    const hasFetchedRef = useRef(false); 

    // Observer to check if the card element is close enough to the viewport to start loading
    useEffect(() => {
        if (!cardRef.current) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            }, {
                //Load card cover when 100px from viewport
                rootMargin: '100px',
                threshold: 0.1
            }
            )
            
            observer.observe(cardRef.current);

            return () => {
                observer.disconnect();
            }
    }, [])

    // Fetch cover
    useEffect(() => {
        if (!isVisible || hasFetchedRef.current) return;

        async function fetchCover() {
            try {  
                console.log(`Queueing fetch cover with game id!: ${gameInfo.id}`);
                setCoverLoading(true);

                const response = await coverRateLimiter.add(async () => {
                    console.log(`fetching cover with game id!: ${gameInfo.id}`);
                    return await gameApi.getCover(gameInfo.id);
                });

                if (!response.success) {
                    console.log('setting cover error response fail!');
                    setCoverError('Failed to load cover image!');
                    return;
                }

                setCoverUrl(response.imageUrl);
            } catch(error) {
                console.log('setting cover error catch!');
                setCoverError('Failed to load cover image!');
            } finally {
                setCoverLoading(false);
            }
        }
        fetchCover();
    }, [isVisible, gameInfo.id]);

    function getFormattedPlatform(platformId: number):string {
        let platformTag = tagsContext?.platformTags.find(x => x.id === platformId);
        
        if (!platformTag) {
            return "Not found";
        }

        return platformTag.name;
    }

    function getCoverElement() {
        const aspectRatio = 4 / 3;
        const placeholderHeight = 234 * aspectRatio; 

        if (!isVisible) {
            return (
                <div
                    className="game-cover-placeholder"
                    style={{
                        width: '100%',
                        height: `${placeholderHeight}px`,
                        backgroundColor: '#2a2a2a',
                        borderRadius: '4px',
                    }} 
                />
            );
        }

        if (coverLoading) {
            return (
                <motion.div
                    key={`game-cover-loading-${gameInfo.id}`}
                    className="game-cover-loading"
                    style={{
                        width: '100%',
                        height: `${placeholderHeight}px`,
                        borderRadius: '4px',

                    }}
                    initial={{
                        opacity: 0.2,
                    }}  
                    animate={{
                        opacity: 1.0,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                >
                </motion.div>
            )
        }

        if (coverError) {
            return (
                <div 
                    className="game-cover-loading-error"
                    style={{
                        width: '100%',
                        height: `${placeholderHeight}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                    }}
                >
                    <p style={{fontSize: '0.8rem', color: '#666'}}>No cover available</p>
                </div>
            )
        }

        if (!coverUrl || coverUrl === '') {
            return (
                <div 
                    className="game-cover-loading-error"
                    style={{
                        width: '100%',
                        height: `${placeholderHeight}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                    }}
                >
                    <p style={{color: 'white'}}>No cover URL!</p>
                </div>
            )
        }

        return (
            <motion.img
                src={coverUrl}
                alt={`${gameInfo.name} cover`}
                loading='lazy'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onError={() => {
                    console.error(`Failed to load image: ${coverUrl}`);
                    setCoverError('Image load failed');
                }}
            />
        )
    }

    return (
        <div className="game-card" key={`game-card-${gameInfo.id}`} ref={cardRef}>
            <div className="game-card-cover-container">
                {
                    getCoverElement()
                }
            </div>
            <div className="game-card-info-container">
                <h3>{gameInfo.name}</h3>
                <p>{gameInfo.summary === '' ? 'No description.' : gameInfo.summary}</p>
            </div>
            <div className="game-card-stats">
                <div className="game-card-year-label">
                    <p className="body-text">Year: </p>
                    <p className="body-text-bold">{gameInfo.first_release_date_formatted?.toLocaleDateString('en-GB')}</p>
                </div>
                <div className="game-card-platforms">
                    <p className="body-text">Platforms: </p>
                    <div className="game-card-platforms-container">
                        {gameInfo.platforms.map((platform) => (
                            <div className="platform-pill">
                                <p>{getFormattedPlatform(platform)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    )
}