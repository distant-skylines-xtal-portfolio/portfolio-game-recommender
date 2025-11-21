import { AnimatePresence } from 'framer-motion';
import { useEffect, useState, type JSX } from 'react';
import { useLocation } from 'react-router';
import AnimatedHeader from '~/components/AnimatedHeader';
import AnimatedOutlet from '~/components/AnimatedOutlet';
import LoadingScreen from '~/components/LoadingScreen';
import type { searchContextType } from '~/contexts/searchContext';
import searchContext from '~/contexts/searchContext';
import { gameApi } from '~/services/gameapi.service';
import type { SearchTagType } from '~/types/tagTypes';
import { SearchUrlBuilder } from '~/util/SearchURLBuilder';
import searchStateContext from '~/contexts/searchStateContext';
import type { SearchStateContextType } from '~/contexts/searchStateContext';

type SearchState = {
    tags: SearchTagType[];
    offset: number;
}

export function HeaderLayout(): JSX.Element {
    const location = useLocation();
    const [tagContext, setTagContext] = useState<searchContextType>(null);
    const [searchState, setSearchState] = useState<SearchState>({
        tags: [],
        offset: 0
    }); 
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

    // Restore search state from URL on mount
    useEffect(() => {
        if (!tagContext) return;

        const searchpath = SearchUrlBuilder.getSearchPathFromLocation(location.pathname);
        
        if (searchpath) {
            const {tags, offset} = SearchUrlBuilder.parseSearchPath(searchpath, tagContext);
            if (tags.length > 0) {
                setSearchState(prevContext => ({
                    tags,
                    offset
                }));
            }
        }
    }, [tagContext]); // Only run once when tags load

    // Sync URL with search state changes
    useEffect(() => {
        const isSearchRoute = location.pathname === '/' || location.pathname.startsWith('/search');
        if (!isSearchRoute) return;

        const newUrl = searchState.tags.length > 0
            ? SearchUrlBuilder.buildSearchUrl(searchState.tags, searchState.offset)
            : '/';
            
        if (location.pathname !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [searchState, location.pathname]);

    function setSearchTags(tags: SearchTagType[]) {
        setSearchState(prev => ({
            ...prev,
            tags
        }))
    }

    function setCurrentOffset(offset: number) {
        setSearchState(prev => ({
            ...prev,
            offset
        }))
    }
    
    const searchStateValue: SearchStateContextType = {
        searchTags: searchState.tags,
        currentOffset: searchState.offset,
        setSearchTags,
        setCurrentOffset,
    };
    if (isInitialLoading) {
        return (
            <AnimatePresence mode="wait">
                <LoadingScreen />
            </AnimatePresence>
        );
    }

    return (
        <searchContext.Provider value={tagContext}>
            <searchStateContext.Provider value={searchStateValue}>
                <div className="app-container">
                    <AnimatedHeader />
                    <main>
                        <AnimatedOutlet />
                    </main>
                </div>
            </searchStateContext.Provider>
        </searchContext.Provider>
    );
}

export default HeaderLayout;