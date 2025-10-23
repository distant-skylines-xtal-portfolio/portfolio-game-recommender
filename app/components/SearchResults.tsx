type SearchResultsProps = {
    results: any[];
    isLoading: boolean;
    searchTags: string[];
};

export function SearchResults({results, isLoading, searchTags}: SearchResultsProps) {
    if (isLoading) {
        return (
            <div>
                Searching for games...
            </div>
        );
    }

    if (searchTags.length === 0) {
        return (
            <div>
                Try searching!
            </div>
        )
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
                    <div>{game.name}</div>
                ))}
            </div>
        </div>
    )
}
