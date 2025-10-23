import React from 'react';

export type searchContextType = {
    platformTags: string[],
    genreTags: string[],
} | null

const searchContext = React.createContext<searchContextType>(null);
export default searchContext;