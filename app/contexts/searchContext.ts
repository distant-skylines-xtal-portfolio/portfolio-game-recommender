import React from 'react';
import type { genreTag, keywordTag, platformTag } from '~/types/tagTypes';

export type searchContextType = {
    platformTags: platformTag[];
    genreTags: genreTag[];
    keywordTags: keywordTag[];
} | null;

const searchContext = React.createContext<searchContextType>(null);
export default searchContext;
