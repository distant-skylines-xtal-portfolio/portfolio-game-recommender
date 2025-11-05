import { useEffect, useState } from 'react';
import Searchbar from '~/components/SearchBar';
import { SearchResults } from '~/components/SearchResults';
import { gameApi } from '~/services/gameapi.service';
import searchContext, {
    type searchContextType,
} from '~/contexts/searchContext';
import type { SearchTagType } from '~/types/tagTypes';
import type { RecommendationResult } from '~/types/resultTypes';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from '~/components/LoadingScreen';

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
    const [searchTags, setSearchTags] = useState<SearchTagType[]>([]);
    const [searchResults, setSearchResults] = useState<RecommendationResult>({count: 0, games: [], offset: 0});
    const [isSearching, setIsSearching] = useState(false);
    const [tagContext, setTagContext] = useState<searchContextType | null>(
        null,
    );
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        async function loadInitialData() {
            try {
                const [platforms, genres, keywords] = await Promise.all([
                    gameApi.getPlatforms(),
                    gameApi.getGenres(),
                    gameApi.getKeywords(),
                ]);

                setTagContext({
                    platformTags: platforms,
                    genreTags: genres,
                    keywordTags: keywords,
                });
            } catch (error) {
                console.error('Failed to load tags:', error);
                // Set empty context so app still works
                setTagContext({
                    platformTags: [],
                    genreTags: [],
                    keywordTags: [],
                });
            } finally {
                setIsInitialLoading(false);
            }
        }

        loadInitialData();
    }, []);

    async function handleSearch(tags: SearchTagType[], offset=0) {
        setIsSearching(true);
        setSearchTags(tags);

        console.log(`handling search: ${offset}`)

        const result = await gameApi.getRecommendations(tags, offset);

        setSearchResults(result);
        setIsSearching(false);
    }

    if (isInitialLoading) {
        return (
            <AnimatePresence mode="wait">
                <LoadingScreen />
            </AnimatePresence>
        );
    }

    if (!tagContext) {
        return (
            <div className="error-message">
                Failed to load game data. Please refresh the page.
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="home-page"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <searchContext.Provider value={tagContext}>
                    <Searchbar onSearch={handleSearch} />
                    <SearchResults
                        isLoading={isSearching}
                        results={searchResults}
                        searchTags={searchTags}
                        onSearch={handleSearch}
                    />
                </searchContext.Provider>
            </motion.div>
        </AnimatePresence>
    );
}
