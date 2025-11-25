import { useContext, useEffect, useRef, useState } from 'react';
import searchContext from '~/contexts/searchContext';
import type { SearchTagType } from '~/types/tagTypes';

type SearchTagFinderProps = {
    searchString: string;
    selectedTags: SearchTagType[];
    addTag: (tag: SearchTagType) => void;
    onTagAdded: () => void;
};

export default function SearchTagFinder({
    searchString,
    selectedTags,
    addTag,
    onTagAdded,
}: SearchTagFinderProps) {
    const tags = useContext(searchContext);
    const [searchResults, setSearchResults] = useState<SearchTagType[]>([]);
    const [selectedResult, setSelectedResult] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const tagFinderRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const searchResults = searchTags();
        setSearchResults(searchResults);
        setSelectedResult(0);
    }, [searchString, tags, selectedTags]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const input = document.getElementById('add-tag-input');
            const target = e.target as Node;
            if (!input) {
                console.log(`input is null`);
                return;
            }
            console.log(`handleClickOutside: ${target.nodeName}, inputcontainstarget: ${input.contains(target)}`);
            if (
                tagFinderRef.current && 
                !tagFinderRef.current.contains(target) && 
                input && 
                !input.contains(target)
            ) {
                setIsVisible(false);
            }
        }

        function handleInputFocus(e: FocusEvent) {
            const input = document.getElementById('add-tag-input');
            if (e.target === input) {
                setIsVisible(true);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('focusin', handleInputFocus);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('focusin', handleInputFocus);
        };
    }, [])

    useEffect(() => {
        if (!selectedItemRef.current && !tagFinderRef.current) {
            return;
        }

        const container = tagFinderRef.current;
        const item = selectedItemRef.current;

        if (!container || !item) {
            return;
        }

        const containerRect = container?.getBoundingClientRect();
        const itemRect = item?.getBoundingClientRect();

        const isAboveView = itemRect.top < containerRect.top;
        const isBelowView = itemRect.bottom > containerRect.bottom;

        console.log(`isAboveView: ${isAboveView}, isBelow: ${isBelowView}, itemRect.top: ${itemRect.top}, itemRect.bottom: ${itemRect.bottom}, containerRect.top: ${containerRect.top}, containerRect.bottom: ${containerRect.bottom}`);

        if (isAboveView) {
            item.scrollIntoView({block: 'start', behavior: 'smooth'});
        } else if (isBelowView) {
            item.scrollIntoView({block: 'end', behavior: 'smooth'});
        }
    }, [selectedResult])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const activeElement = document.activeElement;
            const input = document.getElementById('add-tag-input');

            if (activeElement !== input) {
                return;
            }

            if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
            }
            
            if (e.key === 'Enter' && searchResults.length > 0) {
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
            } else if (e.key === 'Escape') {
                setIsVisible(false);
                input?.blur();
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
        const searchStringFormatted = searchString.toLowerCase();

        if (tags?.genreTags) {
            searchResults.push(
                ...tags.genreTags.filter((tag) =>
                    tag.name.toLowerCase().includes(searchStringFormatted),
                ),
            );
        }

        if (tags?.platformTags) {
            searchResults.push(
                ...tags.platformTags.filter(
                    (tag) =>
                        tag.name
                            .toLowerCase()
                            .includes(searchStringFormatted) ||
                        tag.alternative_name
                            ?.toLowerCase()
                            .includes(searchStringFormatted) ||
                        tag.abbreviation
                            ?.toLowerCase()
                            .includes(searchStringFormatted),
                ),
            );
        }

        if (tags?.keywordTags) {
            searchResults.push(
                ...tags.keywordTags.filter((tag) =>
                    tag.name.toLowerCase().includes(searchStringFormatted),
                ),
            );
        }

        
        return searchResults;
    }

    if (!isVisible || !tags || !searchString || searchString.length < 3) {
        return <></>;
    }

    return (
        <div
            ref={tagFinderRef}
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

            data-testid="search-tag-finder"
        >
            {searchResults.map((tagResult, index) => {
                    const isSelected = index === selectedResult;
                    return (<div
                        key={`${tagResult.type}-${tagResult.id}`}
                        ref={isSelected ? selectedItemRef : null}
                        className={
                            isSelected
                                ? 'tag-result-selected'
                                : 'tag-result'
                        }
                        onClick={() => {
                            addTag(tagResult);
                        }}
                        role='button'
                        aria-label='search tag button'
                        data-testid={
                            isSelected
                                ? 'tag-result-selected'
                                : 'tag-result'
                        }
                    >
                        <p>{tagResult.formattedType}</p>
                        <p>{tagResult.name}</p>
                    </div>
                );
            })}
        </div>
    );
}
