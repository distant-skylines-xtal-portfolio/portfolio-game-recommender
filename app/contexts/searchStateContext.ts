import React from 'react';
import type { SearchTagType } from '~/types/tagTypes';

// Create a new context for search state
export type SearchStateContextType = {
    searchTags: SearchTagType[];
    currentOffset: number;
    setSearchTags: (tags: SearchTagType[]) => void;
    setCurrentOffset: (offset: number) => void;
} | null;


const searchStateContext = React.createContext<SearchStateContextType>(null);
export default searchStateContext;
