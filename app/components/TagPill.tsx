import { TiDelete } from "react-icons/ti";

type TagPillProps = {
    id: string;
    handleClick: () => void;
    ariaLabel: string;
    text: string;
    canDelete: boolean;
}

export default function TagPill({
    id=`tag-pill-${Math.random()}`,
    ariaLabel,
    text,
    canDelete=false,
    handleClick
}: TagPillProps) {
    return (
        <div
            className="search-tag"
            key={id}
            onClick={handleClick}
            data-testid='search-tag'
            role='button'
            aria-label={ariaLabel}
        >
            <p className="tag-text">
                {text}
            </p>
            {canDelete && 
                <div className="search-tag-close-icon">
                    <TiDelete />
                </div>
            }

        </div>
    )
}