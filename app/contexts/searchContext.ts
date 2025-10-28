import React from 'react';
import type { genreTag, platformTag } from '~/types/tagTypes';

export type searchContextType = {
    platformTags: platformTag[];
    genreTags: genreTag[];
} | null;

const searchContext = React.createContext<searchContextType>(null);
export default searchContext;
