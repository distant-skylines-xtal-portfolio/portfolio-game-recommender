import axios from 'axios';
import type {
    genreTag,
    keywordTag,
    platformTag,
    SearchTagType,
} from '~/types/tagTypes';
import type { GameInfoResult, gameResult, RecommendationResult, ReleaseDate, SimilarGame } from '~/types/resultTypes';

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
    keywords: keywordTag[];
    offset: number;
}

interface RawCover {
    success: boolean;
    imageUrl: string;
    coverInfo: {
        width: number;
        height: number;
        animated: boolean;
    };
}

interface RawKeyword {
    id: number;
    name: string;
    slug: string;
}

interface rawFullGameInfo {
    id: number;
    age_ratings: number[];
    cover: number;
    created_at: number;
    first_release_date: number;
    franchises: number[];
    game_modes: number[];
    genres: number[];
    involved_companies: number[];
    keywords: number[];
    name: string;
    parent_game: number;
    platforms: number[];
    player_perspectives: number[];
    release_dates: number[];
    screenshots: number[];
    similar_games: number[];
    slug: string;
    summary: string;
    tags: number[];
    themes: number[];
    updated_at: number;
    url: string;
    checksum: string;
    collections: number[];
    game_type: number;
}


interface RawReleaseDate {
    id: number;
    date: number;
    game: number;
    human: string;
    m: number;
    platform: number;
    region: number;
    y: number;
}

interface RawSimilarGame {
    id: number;
    name: string;
    cover?: number;
}

// Region mapping for IGDB
const regionMap: { [key: number]: string } = {
    1: 'Europe',
    2: 'North America',
    3: 'Australia',
    4: 'New Zealand',
    5: 'Japan',
    6: 'China',
    7: 'Asia',
    8: 'Worldwide',
    9: 'Korea',
    10: 'Brazil',
};


//Transform functions
function transformGenre(raw: RawGenre): genreTag {
    return {
        type: 'genreTag',
        id: raw.id,
        name: raw.name,
        formattedType: 'Genre',
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
        formattedType: 'Platform',
    };
}

function transformGame(raw: RawGame): gameResult {
    const transformedGame: gameResult = {
        ...raw,
    };

    if (transformedGame.summary === undefined) {
        transformedGame.summary = 'No description.';
    }

    transformedGame.first_release_date_formatted = new Date(
        raw.first_release_date * 1000,
    );

    return transformedGame;
}

function transformKeyword(raw: RawKeyword): keywordTag {
    return {
        type: 'keywordTag',
        id: raw.id,
        name: raw.name,
        formattedType: 'Keyword',
    };
}

function transformFullGameInfo(raw: rawFullGameInfo): GameInfoResult {
    console.log('Raw Game Info:', raw);
    return {
        id: raw.id,
        age_ratings: raw.age_ratings,
        cover: raw.cover,
        created_at: raw.created_at,
        first_release_date: raw.first_release_date,
        franchises: raw.franchises,
        game_modes: raw.game_modes,
        genres: raw.genres,
        involved_companies: raw.involved_companies,
        keywords: raw.keywords,
        name: raw.name,
        parent_game: raw.parent_game,
        platforms: raw.platforms,
        player_perspectives: raw.player_perspectives,
        release_dates: raw.release_dates,
        screenshots: raw.screenshots,
        similar_games: raw.similar_games,
        slug: raw.slug,
        summary: raw.summary,
        tags: raw.tags,
        themes: raw.themes,
        url: raw.url,
        checksum: raw.checksum,
        collections: raw.collections,
        game_type: raw.game_type
    };
}

function transformReleaseDate(raw: RawReleaseDate, platformName: string): ReleaseDate {
    return {
        id: raw.id,
        date: raw.date,
        platformId: raw.platform,
        platformName: platformName,
        region: regionMap[raw.region] || 'Unknown',
        human: raw.human,
    };
}

function transformSimilarGame(raw: RawSimilarGame): SimilarGame {
    return {
        id: raw.id,
        name: raw.name,
        coverId: raw.cover,
    };
}



export const gameApi = {
    getRecommendations: async (filters: SearchTagType[], offset=0) => {
        const sortedFilters: recommendationFilters = {
            genres: [],
            platforms: [],
            keywords: [],
            offset: offset,
        };

        for (const searchTag of filters) {
            if (searchTag.type === 'genreTag') {
                sortedFilters.genres.push(searchTag);
            } else if (searchTag.type === 'platformTag') {
                sortedFilters.platforms.push(searchTag);
            } else if (searchTag.type === 'keywordTag') {
                sortedFilters.keywords.push(searchTag);
            }
        }

        const response = await apiClient.post(
            '/api/games/recommend',
            sortedFilters,
        );
        const result:RecommendationResult = {
            count: response.data.count,
            games: response.data.games.map(transformGame),
            offset: offset,
        }
        return result;
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

    getCover: async (gameId: number) => {
        const body = {
            gameId: gameId,
        };
        const response = await apiClient.post('/api/games/cover', body);
        return response.data as RawCover;
    },

    getKeywords: async () => {
        const response = await apiClient.get('/api/games/keywords');
        return response.data.keywords.map(transformKeyword);
    },

    getFullInfo: async (gameId: number) => {
        const response = await apiClient.get(`/api/games/fullinfo/${gameId}`);
        return transformFullGameInfo(response.data.game[0]);
    },

    getReleaseDates: async (gameId: number): Promise<ReleaseDate[]> => {
        const response = await apiClient.post('/api/games/releasedates', {
            gameId: gameId
        });
        
        // The response should include release date info with platform names
        const releases = response.data.releaseDates || [];
        
        return releases.map((raw: RawReleaseDate & { platformName?: string }) => 
            transformReleaseDate(raw, raw.platformName || 'Unknown Platform')
        );
    },

    getSimilarGames: async (gameIds: number[]): Promise<SimilarGame[]> => {
        const response = await apiClient.post('/api/games/similar', {
            gameIds: gameIds
        });
        
        const games = response.data.games || [];
        return games.map(transformSimilarGame);
    },
};
