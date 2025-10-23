import { useState } from "react";
import type { Route } from "./+types/home";
import Searchbar from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { gameApi } from "~/services/gameapi.service";
import searchContext, { type searchContextType } from "~/contexts/searchContext";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Game Recommender" },
        { name: "description", content: "Simple webapp for getting game recommendations" },
    ];
}
export async function clientLoader() {
    const platforms = await gameApi.getPlatforms();
    const genres = await gameApi.getGenres();

    return {
        platformTags: platforms,
        genreTags: genres
    }
}

export default function Home({loaderData}:Route.ComponentProps) {
    const tagSearchContext: searchContextType = loaderData;
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    

    async function handleSearch(tags: string[]) {
        setIsLoading(true);
        setSearchTags(tags);

        const result = await gameApi.searchByName(tags[0]);
        
        console.log(result);
        setSearchResults(result);
        setIsLoading(false);
    }


    return (
        <div className="home-page">
            <searchContext.Provider value={tagSearchContext}>
                <Searchbar onSearch={handleSearch}/>
                <SearchResults 
                    isLoading={isLoading} 
                    results={searchResults}
                    searchTags={searchTags}
                />
            </searchContext.Provider>
        </div>
    );
}
