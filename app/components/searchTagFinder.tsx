import { useContext } from "react";
import searchContext from "~/contexts/searchContext"

type SearchTagFinderProps = {
    searchString: string;
    addTag: (inputText:string) => void;
}

export default function SearchTagFinder({searchString, addTag}: SearchTagFinderProps) {
    const tags = useContext(searchContext);

    return (
        <></>
    )
}

