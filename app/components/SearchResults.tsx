import type { SearchTagType } from '~/types/tagTypes';
import type { gameResult } from '~/types/resultTypes';

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
    if (isLoading) {
        return <div>Searching for games...</div>;
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
                    <div className="game-result">
                        <div className="game-result-cover">{game.cover}</div>
                        <div className="game-result-info-container">
                            <h3>{game.name}</h3>
                            <p>{game.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
