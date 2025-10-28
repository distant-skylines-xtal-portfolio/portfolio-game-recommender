import { useContext, useEffect, useState } from 'react';
import searchContext from '~/contexts/searchContext';
import type { SearchTagType } from '~/types/tagTypes';

type SearchTagFinderProps = {
    searchString: string;
    addTag: (tag: SearchTagType) => void;
};

export default function SearchTagFinder({
    searchString,
    addTag,
}: SearchTagFinderProps) {
    const tags = useContext(searchContext);
    const [searchResults, setSearchResults] = useState<SearchTagType[]>([]);

    useEffect(() => {
        const searchResults = searchTags();
        setSearchResults(searchResults);
    }, [searchString, tags]);

    function searchTags(): SearchTagType[] {
        if (!tags || !searchString || searchString.length < 3) {
            return [];
        }

        const searchResults: SearchTagType[] = [];

        if (tags?.genreTags) {
            searchResults.push(
                ...tags.genreTags.filter((tag) =>
                    tag.name.toLowerCase().includes(searchString.toLowerCase()),
                ),
            );
        }

        if (tags?.platformTags) {
            searchResults.push(
                ...tags.platformTags.filter(
                    (tag) =>
                        tag.name
                            .toLowerCase()
                            .includes(searchString.toLowerCase()) ||
                        tag.alternative_name
                            ?.toLowerCase()
                            .includes(searchString.toLowerCase()) ||
                        tag.abbreviation
                            ?.toLowerCase()
                            .includes(searchString.toLowerCase()),
                ),
            );
        }

        return searchResults;
    }

    if (!tags || !searchString || searchString.length < 3) {
        return <></>;
    }

    return (
        <div
            className="tag-finder"
            style={{
                position: 'absolute',
                zIndex: 25,
                left: 0,
                right: 0,
                maxHeight: '30rem',
                display: 'inline',
                width: '100%',
                height: 'max-content',
            }}
        >
            {searchResults.map((tagResult) => {
                return (
                    <div
                        key={`${tagResult.type}-${tagResult.id}`}
                        className="tag-result"
                        onClick={() => {
                            addTag(tagResult);
                        }}
                    >
                        <p>
                            {tagResult.type === 'platformTag'
                                ? 'Platform'
                                : 'Genre'}
                        </p>
                        <p>{tagResult.name}</p>
                    </div>
                );
            })}
        </div>
    );
}
