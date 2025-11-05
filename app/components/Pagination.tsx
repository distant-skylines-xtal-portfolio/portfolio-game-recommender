import type { JSX } from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNum: number) => void;
};

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    function getPageButtonClassName(pageNum: number): string {
        return pageNum === currentPage
            ? 'page-button-number-selected'
            : 'page-button-number';
    }

    function getPaginationButtonElements(): JSX.Element[] {
        const buttonElements: JSX.Element[] = [];

        // Previous button
        buttonElements.push(
            <button
                key="page-button-prev"
                className="page-button-prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>,
        );

        // Page number buttons
        if (totalPages <= 4) {
            // Show all pages if 4 or fewer
            for (let i = 1; i <= totalPages; i++) {
                buttonElements.push(
                    <button
                        key={`page-button-${i}`}
                        className={getPageButtonClassName(i)}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </button>,
                );
            }
        } else {
            // Show condensed pagination for 5+ pages
            let startingNum = 1;
            let endingNum = 3;

            if (currentPage >= 3 && currentPage < totalPages) {
                startingNum = currentPage - 1;
                endingNum = currentPage + 1;
            }

            // Show page numbers around current page
            for (let i = startingNum; i <= endingNum; i++) {
                buttonElements.push(
                    <button
                        key={`page-button-${i}`}
                        className={getPageButtonClassName(i)}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </button>,
                );
            }

            // Add ellipsis
            buttonElements.push(
                <div key="page-button-divider" className="page-button-divider">
                    <p className="body-text">...</p>
                </div>,
            );

            // Show last page
            buttonElements.push(
                <button
                    key={`page-button-${totalPages}`}
                    className={getPageButtonClassName(totalPages)}
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </button>,
            );
        }

        // Next button
        buttonElements.push(
            <button
                key="page-button-next"
                className="page-button-next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>,
        );

        return buttonElements;
    }

    return (
        <div className="page-button-container">
            {getPaginationButtonElements()}
        </div>
    );
}