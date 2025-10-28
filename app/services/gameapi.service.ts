import axios from 'axios';
import type { genreTag, platformTag, SearchTagType } from '~/types/tagTypes';
import type { gameResult } from '~/types/resultTypes';

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

interface RawGenre {
    id: number;
    name: string;
}

interface RawPlatform {
    id: number;
    name: string;
    abbreviation?: string;
    alternative_name?: string;
    platform_type: number;
}

interface RawGame {
    cover: number;
    first_release_date: number;
    genres: number[];
    id: number;
    languageSupports: number[];
    name: string;
    platforms: number[];
    summary: string;
}

interface recommendationFilters {
    genres: genreTag[];
    platforms: platformTag[];
}

//Transform functions
function transformGenre(raw: RawGenre): genreTag {
    return {
        type: 'genreTag',
        id: raw.id,
        name: raw.name,
    };
}

function transformPlatform(raw: RawPlatform): platformTag {
    return {
        type: 'platformTag',
        id: raw.id,
        name: raw.name,
        abbreviation: raw.abbreviation ?? '',
        alternative_name: raw.alternative_name ?? '',
        platform_type: raw.platform_type,
    };
}

function transformGame(raw: RawGame): gameResult {
    return {
        ...raw,
    };
}

export const gameApi = {
    getRecommendations: async (filters: SearchTagType[]) => {
        const sortedFilters: recommendationFilters = {
            genres: [],
            platforms: [],
        };

        for (const searchTag of filters) {
            if (searchTag.type === 'genreTag') {
                sortedFilters.genres.push(searchTag);
            } else if (searchTag.type === 'platformTag') {
                sortedFilters.platforms.push(searchTag);
            }
        }

        const response = await apiClient.post(
            '/api/games/recommend',
            sortedFilters,
        );
        return response.data.games.map(transformGame);
    },

    getGenres: async () => {
        const response = await apiClient.get('/api/games/genres');
        return response.data.genres.map(transformGenre);
    },

    getPlatforms: async () => {
        const response = await apiClient.get('/api/games/platforms');
        return response.data.platforms.map(transformPlatform);
    },

    searchByName: async (searchText: string) => {
        const searchBody = {
            search: searchText,
        };
        const response = await apiClient.post('/api/games/search', searchBody);
        return response.data.result;
    },
};
