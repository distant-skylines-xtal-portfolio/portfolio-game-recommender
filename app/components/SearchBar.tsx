import { useState } from "react";

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

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag(inputValue);
                            }
                        }}
                        placeholder="Add tags"
                    />
                    
                    <div className="tags-display">
                        {tags.map((tag) => (
                            <span key={tag} className="search-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <button type="submit" disabled={tags.length === 0}>
                        Search Games
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Searchbar;