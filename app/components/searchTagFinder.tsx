import { useContext, useEffect, useState } from 'react';
import searchContext from '~/contexts/searchContext';
import type { SearchTagType } from '~/types/tagTypes';

type SearchTagFinderProps = {
    searchString: string;
    addTag: (tag: SearchTagType) => void;
    selectedTags: SearchTagType[];
    onTagAdded: () => void;
};

export default function SearchTagFinder({
    searchString,
    addTag,
    selectedTags,
    onTagAdded,
}: SearchTagFinderProps) {
    const tags = useContext(searchContext);
    const [searchResults, setSearchResults] = useState<SearchTagType[]>([]);
    const [selectedResult, setSelectedResult] = useState(0);

    useEffect(() => {
        const searchResults = searchTags();
        setSearchResults(searchResults);
    }, [searchString, tags, selectedTags]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const activeElement = document.activeElement;
            const input = document.getElementById('add-tag-input');

            if (activeElement !== input) {
                return;
            }

            if (e.key === 'Enter' && searchResults.length > 0) {
                e.preventDefault();
                addTag(searchResults[selectedResult]);
                onTagAdded();
                setSelectedResult(0);
            } else if (e.key === 'ArrowDown') {
                setSelectedResult((prev) => {
                    if (prev < searchResults.length - 1) {
                        return (prev += 1);
                    } else {
                        return prev;
                    }
                });
            } else if (e.key === 'ArrowUp') {
                setSelectedResult((prev) => {
                    if (prev > 0) {
                        return (prev -= 1);
                    } else {
                        return prev;
                    }
                });
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchResults, addTag, onTagAdded, selectedResult]);

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
            {searchResults.map((tagResult, index) => {
                return (
                    <div
                        key={`${tagResult.type}-${tagResult.id}`}
                        className={
                            index === selectedResult
                                ? 'tag-result-selected'
                                : 'tag-result'
                        }
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
