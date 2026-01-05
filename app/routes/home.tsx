import { useContext, useEffect, useState } from 'react';
import Searchbar from '~/components/SearchBar';
import { SearchResults } from '~/components/SearchResults';
import { gameApi } from '~/services/gameapi.service';
import searchContext from '~/contexts/searchContext';
import type { SearchTagType } from '~/types/tagTypes';
import type { RecommendationResult } from '~/types/resultTypes';
import { AnimatePresence, motion } from 'framer-motion';
import searchStateContext from '~/contexts/searchStateContext';

export function meta() {
    return [
        { title: 'Game Recommender' },
        {
            name: 'description',
            content: 'Simple webapp for getting game recommendations',
        },
    ];
}

export default function Home() {
    const tagContext = useContext(searchContext);
    const currentSearchStateContext = useContext(searchStateContext);
    
    const [searchResults, setSearchResults] = useState<RecommendationResult>({
        count: 0, 
        games: [], 
        offset: 0
    });
    const [isSearching, setIsSearching] = useState(false);

    if (!tagContext) {
        return (
            <div className="error-message">
                Failed to load game data. Please refresh the page.
            </div>
        );
    }

    if (!currentSearchStateContext) {
        return null;
    }

    

    // Perform search when tags or offset change
    useEffect(() => {
        if (currentSearchStateContext.searchTags.length === 0) {
            setSearchResults({ count: 0, games: [], offset: 0 });
            return;
        }

        if (currentSearchStateContext === null) return;

        async function performSearch() {
            setIsSearching(true);
            try {
                if (currentSearchStateContext === null) return;
                const result = await gameApi.getRecommendations(currentSearchStateContext.searchTags, currentSearchStateContext.currentOffset);
                setSearchResults(result);
            } catch(error) {
                console.error('Search failed: ', error);
            } finally {
                setIsSearching(false);
            }
        }

        performSearch();
    }, [currentSearchStateContext.searchTags, currentSearchStateContext.setCurrentOffset]);

    async function handleSearch(tags: SearchTagType[], offset: number = 0) {
        if (!currentSearchStateContext) return;

        if (tags.length === 0) {
            currentSearchStateContext.setSearchTags([]);
            currentSearchStateContext.setCurrentOffset(0);
            return;
        }

        currentSearchStateContext.setSearchTags(tags);
        currentSearchStateContext.setCurrentOffset(offset);
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="home-page"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="home-page"
            >
                <Searchbar 
                    restoredTags={currentSearchStateContext.searchTags}
                    onSearch={handleSearch} 
                />
                <SearchResults
                    isLoading={isSearching}
                    results={searchResults}
                    searchTags={currentSearchStateContext.searchTags}
                    onSearch={handleSearch}
                    currentOffset={currentSearchStateContext.currentOffset}
                />
            </motion.div>
        </AnimatePresence>
    );
}