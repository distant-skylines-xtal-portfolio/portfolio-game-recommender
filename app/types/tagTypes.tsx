export interface searchTag {
    type: 'platformTag' | 'genreTag';
}

export interface platformTag extends searchTag {
    type: 'platformTag';
    abbreviation: string;
    alternative_name: string;
    id: number;
    name: string;
    platform_type: number;
}

export interface genreTag extends searchTag {
    type: 'genreTag';
    id: number;
    name: string;
}

export type SearchTagType = platformTag | genreTag;
