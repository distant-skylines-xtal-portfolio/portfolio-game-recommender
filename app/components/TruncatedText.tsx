import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

type TruncatedTextProps = {
    text: string;
    maxLines?: number;
    className?: string;
};

export function TruncatedText({
    text,
    maxLines = 0,
    className = 'body-text',
}: TruncatedTextProps): JSX.Element {
    const textElementRef = useRef<HTMLParagraphElement>(null);
    const [displayedText, setDisplayedText] = useState(text);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        if (!textElementRef.current) return;

        const element = textElementRef.current;
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const maxHeight = lineHeight * maxLines;


        if (element.scrollHeight > maxHeight) {
            setIsTruncated(true);

            let left = 0;
            let right = text.length;
            let bestFit = text;

            //Binary search to find best fit for text in available space
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const testText = text.slice(0, mid) + '...';
                element.textContent = testText;

                if (element.scrollHeight <= maxHeight) {
                    bestFit = testText;
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            setDisplayedText(bestFit);
        } else {
            setIsTruncated(false);
            setDisplayedText(text);
        }
    }, [text, maxLines]);

    return (
        <p
            ref={textElementRef}
            className={className}
            title={isTruncated ? text : undefined} //Full text on hover
        >
            {displayedText}
        </p>
    );
}
