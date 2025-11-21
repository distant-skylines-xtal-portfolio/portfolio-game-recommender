export interface gameResult {
    cover: number;
    first_release_date: number;
    genres: number[];
    id: number;
    languageSupports: number[];
    name: string;
    platforms: number[];
    summary: string;
    first_release_date_formatted?: Date;
}


export interface RecommendationResult {
    count: number;
    offset: number;
    games: gameResult[];
}

export interface GameInfoResult {
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
    url: string;
    checksum: string;
    collections: number[];
    game_type: number;
}


// Release date information
export interface ReleaseDate {
    id: number;
    date: number;
    platformId: number;
    platformName: string;
    region: string;
    human: string;
}

// Similar game information
export interface SimilarGame {
    id: number;
    name: string;
    coverId?: number;
}