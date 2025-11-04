import type { SearchTagType } from '~/types/tagTypes';
import type { gameResult } from '~/types/resultTypes';
import GameCard from './GameCard';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

type SearchResultsProps = {
    results: gameResult[];
    isLoading: boolean;
    searchTags: SearchTagType[];
};

export function SearchResults({
    results,
    isLoading,
    searchTags,
}: SearchResultsProps) {
    function getLoadingElement() {
        const elements: JSX.Element[] = [];

        for (let i = 0; i < 5; i++) {
            elements.push(
                <motion.div
                    className="card loading-card"
                    key={`loading-card-${i}`}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{}}
                ></motion.div>,
            );
        }
        return elements;
    }

    if (isLoading) {
        return (
            <div className="results-grid">
                <h2>Recommended games</h2>
                {getLoadingElement()}
            </div>
        );
    }

    if (searchTags.length === 0) {
        return <div>Try searching!</div>;
    }

    if (results.length === 0) {
        return (
            <div>
                <p>No Games found matching your tags</p>
            </div>
        );
    }

    return (
        <div className="search-results">
            <h2>Recommended games</h2>
            <div className="results-grid">
                {results.map((game) => (
                    <GameCard gameInfo={game} />
                ))}
            </div>
        </div>
    );
}
