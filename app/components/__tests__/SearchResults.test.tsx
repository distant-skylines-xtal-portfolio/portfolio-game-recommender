import {render, screen, fireEvent} from "@testing-library/react";
import { SearchResults } from "../SearchResults";
import type { SearchTagType } from "~/types/tagTypes";
import type { RecommendationResult } from "~/types/resultTypes";
import {jest} from '@jest/globals';


const mockResults:RecommendationResult = {
    games: [
        {
            id: 1,
            name:'Test Game 1',
            summary: 'A Test Game 1',
            first_release_date_formatted: new Date('2020-01-01'),
            platforms: [1, 2],
            cover: 0,
            first_release_date: 2020,
            genres: [0],
            languageSupports: [0, 1],
        },
        {
            id: 2,
            name:'Test Game 2', 
            summary: 'A Test Game 2',
            first_release_date_formatted: new Date('2021-01-01'),
            platforms: [3],
            cover: 0,
            first_release_date: 2020,
            genres: [0],
            languageSupports: [0, 1],
        }
    ],
    count: 120,
    offset: 0,
};

const mockSearchTags:SearchTagType[] = [
    { id: 1, name: 'Action', type: 'genreTag', formattedType: 'Genre' },
]


jest.mock('~/components/Pagination', () => ({
    Pagination: ({currentPage, totalPages, onPageChange}: any) => (
        <div data-testid="pagination">
            <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
        </div>
    )
}))

describe('SearchResults Component', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        mockOnSearch.mockClear();
    });

    test('shows initial state when no search tags', () => {
        render(
            <SearchResults
                results={{games: [], count: 0, offset: 0}}
                isLoading={false} 
                searchTags={[]}
                onSearch={mockOnSearch}
            />
        )
        expect(screen.getByText('Try searching!')).toBeInTheDocument();
    });

    test('shows loading state with loading cards', () => {
        render(
            <SearchResults
                results={{games: [], count: 0, offset: 0}}
                isLoading={true} 
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        )
        const loadingCards = screen.getAllByRole('loading-placeholder-card');
        expect(loadingCards).toHaveLength(5);
    })

    test('shows no results message when count is 0', () => {
        render(
            <SearchResults
                results={{games: [], count: 0, offset: 0}}
                isLoading={false} 
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        )

        expect(screen.getByText('No Games found matching your tags')).toBeInTheDocument();
    });

    test('displays game crads when results exist', () => {
        render(
            <SearchResults
                results={mockResults}
                isLoading={false}
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        );

        expect(screen.getByText('A Test Game 1')).toBeInTheDocument();
        expect(screen.getByText('A Test Game 2')).toBeInTheDocument();
    });

    test('calculates and displays total pages correctly', () => {
        render(
            <SearchResults
                results={mockResults}
                isLoading={false}
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        );

        expect(screen.getByText(/Displaying 0 - 50/)).toBeInTheDocument();
    });

    test('displays results info correctly', () => {
        render(
            <SearchResults
                results={mockResults}
                isLoading={false}
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        );

        expect(screen.getByText('Found 120 games')).toBeInTheDocument();
        expect(screen.getByText(/Displaying 0 - 50/)).toBeInTheDocument();
    });

    test('calls onSearch with new offest when page changes', () => {
        render(
            <SearchResults
                results={mockResults}
                isLoading={false}
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        );

        const nextButton = screen.getAllByText('Next')[0];
        fireEvent.click(nextButton);

        expect(mockOnSearch).toHaveBeenCalledWith(mockSearchTags, 50);
    });

    test('resets to page 1 when search tags change', () => {
        const { rerender } = render(
            <SearchResults
                results={mockResults}
                isLoading={false}
                searchTags={mockSearchTags}
                onSearch={mockOnSearch}
            />
        );

        const nextButton = screen.getAllByText('Next')[0];
        fireEvent.click(nextButton);

        const newSearchTags:SearchTagType[] = [
            {id: 2, name: 'RPG', type: 'genreTag', formattedType: 'Genre'}
        ];

        rerender(
            <SearchResults
                results={mockResults}
                isLoading={false}
                searchTags={newSearchTags}
                onSearch={mockOnSearch}
            />
        );

        expect(screen.getByText(/Displaying 0 - 50/)).toBeInTheDocument();
    })

})