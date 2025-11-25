import { useEffect, useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import SearchTagFinder from './searchTagFinder';
import type { SearchTagType } from '~/types/tagTypes';
import TagPill from './TagPill';
type SearchBarProps = {
    restoredTags: SearchTagType[];
    onSearch: (tags: SearchTagType[], offset:number) => void;
};

export function Searchbar({ restoredTags=[], onSearch }: SearchBarProps) {
    const [tags, setTags] = useState<SearchTagType[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!restoredTags || restoredTags.length === 0) return;

        setTags(restoredTags);
    }, [restoredTags])

    function handleAddTag(tag: SearchTagType) {
        setTags((prev) => [...prev, tag]);
        setInputValue('');
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSearch(tags, 0);
    }

    function handleTagRemove(tag: SearchTagType) {
        setTags((prev) => prev.filter((x) => x !== tag));
    }

    return (
        <div className="search-bar"
            data-testid="search-bar"
        >
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <div
                        className="text-input"
                        style={{ position: 'relative' }}
                    >
                        <input
                            type="text"
                            id="add-tag-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="&nbsp;"
                            data-testid="add-tag-input"
                            role='searchbox'
                            autoComplete='off'
                        />
                        <label
                            htmlFor="add-tag-input"
                            className="text-input-label"
                        >
                            Add tag
                        </label>
                        <span className="focus-bg"></span>
                        <div
                            className="search-result-holder"
                            style={{ position: 'relative' }}
                        >
                            <SearchTagFinder
                                addTag={handleAddTag}
                                searchString={inputValue}
                                selectedTags={tags}
                                onTagAdded={() => setInputValue('')}
                            />
                        </div>
                    </div>

                    <div className="tags-display">
                        <p>Included Tags</p>
                        <div className="tags-container">
                            {tags.map((tag) => (
                                <TagPill
                                    id={`tag-pill-${tag.id}`}
                                    key={`tag-pill-${tag.id}`}
                                    handleClick={() => handleTagRemove(tag)}
                                    ariaLabel="Selected Tag to search with, 
                                    click to remove from search criteria"
                                    text={`${tag.formattedType}: ${tag.name}`}
                                    canDelete={true}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        className="button-text"
                        type="submit"
                        disabled={tags.length === 0}
                        role='button'
                    >
                        Search Games
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Searchbar;
