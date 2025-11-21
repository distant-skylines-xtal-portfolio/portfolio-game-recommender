import type { SearchTagType } from '~/types/tagTypes';
import type { gameResult, RecommendationResult } from '~/types/resultTypes';
import GameCard from './GameCard';
import { Pagination } from './Pagination';
import { motion } from 'framer-motion';
import { useEffect, useState, type JSX } from 'react';
import { TbCurrentLocationOff } from 'react-icons/tb';

type SearchResultsProps = {
    results: RecommendationResult;
    isLoading: boolean;
    searchTags: SearchTagType[];
    currentOffset: number;
    onSearch: (tags: SearchTagType[], offset: number) => void;
};

export function SearchResults({
    results,
    isLoading,
    searchTags,
    currentOffset,
    onSearch,
}: SearchResultsProps) {
    const RESULTS_PER_PAGE = 50;
    const currentPage = Math.floor(currentOffset / RESULTS_PER_PAGE) + 1;
    const totalPages = Math.ceil(results.count / RESULTS_PER_PAGE);

    const resultsInfo = {
        count: results.count,
        offset: currentOffset,
        displayEnd: currentOffset + Math.min(RESULTS_PER_PAGE, results.count - currentOffset),
    };


    function getLoadingElements(): JSX.Element[] {
        const elements: JSX.Element[] = [];

        for (let i = 0; i < 5; i++) {
            elements.push(
                <motion.div
                    role='loading-placeholder-card'
                    className="card loading-card"
                    key={`loading-card-${i}`}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />,
            );
        }
        return elements;
    }

    function handlePageChange(pageNum: number) {
        if (pageNum < 1 || pageNum > totalPages) {
            return;
        }
        onSearch(searchTags, (pageNum - 1) * RESULTS_PER_PAGE);
    }

    // Show initial state when no search has been performed
    if (searchTags.length === 0) {
        return <div id="not-yet-searched">Try searching!</div>;
    }

    // Show loading state with pagination
    if (isLoading) {
        return (
            <div className="search-results">
                <h2>Recommended games</h2>
                <div className="page-info-container">
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                    {resultsInfo.count > 0 && (
                        <div className="page-info">
                            <p className="body-text">
                                Found {resultsInfo.count} games
                            </p>
                            <p className="body-text">
                                Displaying {resultsInfo.offset} -{' '}
                                {resultsInfo.displayEnd}
                            </p>
                        </div>
                    )}
                </div>
                <div className="results-grid">
                    <div className="search-results">
                        {getLoadingElements()}
                    </div>
                </div>
            </div>
        );
    }

    // Show no results message
    if (results.count === 0) {
        return (
            <div>
                <p>No Games found matching your tags</p>
            </div>
        );
    }

    // Show search results with pagination at top and bottom
    return (
        <div className="search-results"
            data-testid="search-results"
        >
            <h2>Recommended games</h2>

            {/* Top pagination */}
            <div className="page-info-container">
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
                <div className="page-info">
                    <p className="body-text">Found {resultsInfo.count} games</p>
                    <p className="body-text">
                        Displaying {resultsInfo.offset} - {resultsInfo.displayEnd}
                    </p>
                </div>
            </div>

            {/* Results grid */}
            <div className="results-grid">
                {results.games.map((game) => (
                    <GameCard key={game.id} gameInfo={game} />
                ))}
            </div>

            {/* Bottom pagination */}
            {totalPages > 1 && (
                <div className="page-info-container">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}