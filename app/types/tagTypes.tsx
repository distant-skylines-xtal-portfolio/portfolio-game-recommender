export interface searchTag {
    type: 'platformTag' | 'genreTag' | 'keywordTag';
}

export interface platformTag extends searchTag {
    type: 'platformTag';
    formattedType: 'Platform';
    abbreviation: string;
    alternative_name: string;
    id: number;
    name: string;
    platform_type: number;
}

export interface genreTag extends searchTag {
    type: 'genreTag';
    formattedType: 'Genre';
    id: number;
    name: string;
}

export interface keywordTag extends searchTag {
    type: 'keywordTag';
    formattedType: 'Keyword';
    id: number;
    name: string;
}

export type SearchTagType = platformTag | genreTag | keywordTag;
