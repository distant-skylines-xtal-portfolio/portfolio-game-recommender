import { useState } from "react";
import type { Route } from "./+types/home";
import Searchbar from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { gameApi } from "~/services/gameapi.service";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Game Recommender" },
        { name: "description", content: "Simple webapp for getting game recommendations" },
    ];
}

export async function clientLoader() {

}

export default function Home() {
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSearch(tags: string[]) {
        setIsLoading(true);
        setSearchTags(tags);

        const result = await gameApi.searchByName(tags[0]);
        
        console.log(result);
    }


    return (
        <div className="home-page">
            <p>this is the home page component</p>
            <Searchbar onSearch={handleSearch}/>
            <SearchResults 
                isLoading={isLoading} 
                results={searchResults}
                searchTags={searchTags}
            />
        </div>
    );
}
