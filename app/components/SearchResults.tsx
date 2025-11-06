import type { SearchTagType } from '~/types/tagTypes';
import type { gameResult, RecommendationResult } from '~/types/resultTypes';
import GameCard from './GameCard';
import { Pagination } from './Pagination';
import { motion } from 'framer-motion';
import { useEffect, useState, type JSX } from 'react';

type SearchResultsProps = {
    results: RecommendationResult;
    isLoading: boolean;
    searchTags: SearchTagType[];
    onSearch: (tags: SearchTagType[], offset: number) => void;
};

export function SearchResults({
    results,
    isLoading,
    searchTags,
    onSearch,
}: SearchResultsProps) {
    const [selectedPageNum, setSelectedPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [resultsInfo, setResultsInfo] = useState({
        count: 0,
        offset: 0,
        displayEnd: 0,
    });

    // Reset to page 1 when search tags change
    useEffect(() => {
        setSelectedPageNum(1);
    }, [searchTags]);

    // Update pagination info when results change
    useEffect(() => {
        if (results.count > 0) {
            const pages = Math.ceil(results.count / 50);
            setTotalPages(pages);
            setResultsInfo({
                count: results.count,
                offset: results.offset,
                displayEnd:
                    results.offset + Math.min(50, results.count - results.offset),
            });
        }
    }, [results]);

    function getLoadingElements(): JSX.Element[] {
        const elements: JSX.Element[] = [];

        for (let i = 0; i < 5; i++) {
            elements.push(
                <motion.div
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
        setSelectedPageNum(pageNum);
        onSearch(searchTags, (pageNum - 1) * 50);
    }

    // Show initial state when no search has been performed
    if (searchTags.length === 0) {
        return <div>Try searching!</div>;
    }

    // Show loading state with pagination
    if (isLoading) {
        return (
            <div className="search-results">
                <h2>Recommended games</h2>
                <div className="page-info-container">
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={selectedPageNum}
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
                <div className="results-grid">{getLoadingElements()}</div>
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
        <div className="search-results">
            <h2>Recommended games</h2>

            {/* Top pagination */}
            <div className="page-info-container">
                {totalPages > 1 && (
                    <Pagination
                        currentPage={selectedPageNum}
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
                        currentPage={selectedPageNum}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}