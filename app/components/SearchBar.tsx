import { useState } from "react";
import { TiDelete } from "react-icons/ti";
import SearchTagFinder from "./searchTagFinder";
type SearchBarProps = {
    onSearch: (tags: string[]) => void;
};

export function Searchbar({onSearch}: SearchBarProps) {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    function handleAddTag(inputText:string) {
        setTags(prev => [...prev, inputText]);
    }
    
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSearch(tags);
    }

    function handleTagRemove(tag:string) {
        setTags(prev => prev.filter(x => x !== tag));
    }

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="text-input">
                        <input
                            type="text"
                            id="add-tag-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag(inputValue);
                                    setInputValue("");
                                }
                            }}
                            placeholder="&nbsp;"
                        />
                        <label htmlFor="add-tag-input" 
                        className="text-input-label">Add tag</label>
                        <span className="focus-bg"></span>
                        <SearchTagFinder addTag={handleAddTag} searchString={inputValue}/>
                    </div>
                    
                    <div className="tags-display">
                        <p>Included Tags</p>
                        <div className="tags-container">
                            {tags.map((tag) => (
                                <div className="search-tag" key={tag} onClick={() => {handleTagRemove(tag)}}>
                                    <p className="tag-text">
                                        {tag}
                                    </p>
                                    <div className="search-tag-close-icon">
                                        <TiDelete />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button className="button-text" type="submit" disabled={tags.length === 0}>
                        Search Games
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Searchbar;