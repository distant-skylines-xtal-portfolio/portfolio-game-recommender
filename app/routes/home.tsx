import { useState } from 'react';
import type { Route } from './+types/home';
import Searchbar from '~/components/SearchBar';
import { SearchResults } from '~/components/SearchResults';
import { gameApi } from '~/services/gameapi.service';
import searchContext, {
    type searchContextType,
} from '~/contexts/searchContext';
import type { SearchTagType } from '~/types/tagTypes';
import type { gameResult } from '~/types/resultTypes';

export function meta() {
    return [
        { title: 'Game Recommender' },
        {
            name: 'description',
            content: 'Simple webapp for getting game recommendations',
        },
    ];
}
export async function clientLoader() {
    const platforms = await gameApi.getPlatforms();

    const genres = await gameApi.getGenres();

    const keywords = await gameApi.getKeywords();

    return {
        platformTags: platforms,
        genreTags: genres,
        keywordTags: keywords
    };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const tagSearchContext: searchContextType = loaderData;
    const [searchTags, setSearchTags] = useState<SearchTagType[]>([]);
    const [searchResults, setSearchResults] = useState<gameResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSearch(tags: SearchTagType[]) {
        setIsLoading(true);
        setSearchTags(tags);

        const result = await gameApi.getRecommendations(tags);

        setSearchResults(result);
        setIsLoading(false);
    }

    return (
        <div className="home-page">
            <searchContext.Provider value={tagSearchContext}>
                <Searchbar onSearch={handleSearch} />
                <SearchResults
                    isLoading={isLoading}
                    results={searchResults}
                    searchTags={searchTags}
                />
            </searchContext.Provider>
        </div>
    );
}
