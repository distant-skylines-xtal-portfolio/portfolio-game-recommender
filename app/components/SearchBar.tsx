import { useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import SearchTagFinder from './searchTagFinder';
import type { SearchTagType } from '~/types/tagTypes';
type SearchBarProps = {
    onSearch: (tags: SearchTagType[]) => void;
};

export function Searchbar({ onSearch }: SearchBarProps) {
    const [tags, setTags] = useState<SearchTagType[]>([]);
    const [inputValue, setInputValue] = useState('');

    function handleAddTag(tag: SearchTagType) {
        setTags((prev) => [...prev, tag]);
        setInputValue('');
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSearch(tags);
    }

    function handleTagRemove(tag: SearchTagType) {
        setTags((prev) => prev.filter((x) => x !== tag));
    }

    return (
        <div className="search-bar">
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setInputValue('');
                                }
                            }}
                            placeholder="&nbsp;"
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
                            />
                        </div>
                    </div>

                    <div className="tags-display">
                        <p>Included Tags</p>
                        <div className="tags-container">
                            {tags.map((tag) => (
                                <div
                                    className="search-tag"
                                    key={tag.id}
                                    onClick={() => {
                                        handleTagRemove(tag);
                                    }}
                                >
                                    <p className="tag-text">
                                        {`${tag.type}: ${tag.name}`}
                                    </p>
                                    <div className="search-tag-close-icon">
                                        <TiDelete />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="button-text"
                        type="submit"
                        disabled={tags.length === 0}
                    >
                        Search Games
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Searchbar;
