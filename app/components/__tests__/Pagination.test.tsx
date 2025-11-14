import {render, screen, fireEvent} from '@testing-library/react';
import { Pagination } from '../Pagination';
import {jest} from '@jest/globals';

describe ('Pagination Component', () => {
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
        mockOnPageChange.mockClear();
    });

    describe('Button Generation', () => {
        test('shows all page buttons when totalPages <= 4', () => {
            render(
                <Pagination 
                    currentPage={1} 
                    totalPages={4} 
                    onPageChange={mockOnPageChange} 
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('4')).toBeInTheDocument();
            expect(screen.queryByText('...')).not.toBeInTheDocument();
        });

        test('shows limited buttons with ellipses when totalPages > 4', () => {
            render(
                <Pagination
                    currentPage={1}
                    totalPages={10}
                    onPageChange={mockOnPageChange}
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('...')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
        })

        test('adjusts visible pages when current page is in middle', () => {
            render(
                <Pagination
                    currentPage={5} 
                    totalPages={10}
                    onPageChange={mockOnPageChange}
                />
            );

            expect(screen.getByText('4')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('6')).toBeInTheDocument();
            expect(screen.getByText('...')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
        })
    })

    describe('Navigation', () => {
        test('calls OnPageChange with correct page number on button click', () => {
            render(
                <Pagination
                    currentPage={2} 
                    totalPages={5}
                    onPageChange={mockOnPageChange}
                />
            );

            fireEvent.click(screen.getByText('3'));
            expect(mockOnPageChange).toHaveBeenCalledWith(3);
            expect(mockOnPageChange).toHaveBeenCalledTimes(1);
        });

        test('calls OnPageChange with previous page on Prev click', () => {
            render(
                <Pagination
                    currentPage={3} 
                    totalPages={5}
                    onPageChange={mockOnPageChange}
                />
            );

            fireEvent.click(screen.getByText('Prev'));
            expect(mockOnPageChange).toHaveBeenCalledWith(2);
        });

        test('calls OnPageChange with next page on Next click', () => {
            render(
                <Pagination
                    currentPage={3} 
                    totalPages={5}
                    onPageChange={mockOnPageChange}
                />
            );

            fireEvent.click(screen.getByText('Next'));
            expect(mockOnPageChange).toHaveBeenCalledWith(4);
        })
    })

    describe('Edge Cases', () => {
        test('disables Prev button on first page', () => {
            render(
                <Pagination 
                    currentPage={1} 
                    totalPages={5} 
                    onPageChange={mockOnPageChange} 
                />
            );

            const prevButton = screen.getByText('Prev');
            expect(prevButton).toBeDisabled();
        });

        test('disables Next button on last page', () => {
            render(
                <Pagination 
                    currentPage={5} 
                    totalPages={5} 
                    onPageChange={mockOnPageChange} 
                />
            );

            const prevButton = screen.getByText('Next');
            expect(prevButton).toBeDisabled();
        });

        test('applies selected styling to current page', () => {
            render(
                <Pagination 
                    currentPage={3} 
                    totalPages={5} 
                    onPageChange={mockOnPageChange} 
                />
            );

            const currentPageButton = screen.getByText('3');
            expect(currentPageButton).toHaveClass('page-button-number-selected');
        });

        test('applies non-selected styling to other pages', () => {
            render(
                <Pagination 
                    currentPage={3} 
                    totalPages={5} 
                    onPageChange={mockOnPageChange} 
                />
            );

            const otherPageButton = screen.getByText('2');
            expect(otherPageButton).toHaveClass('page-button-number');
            expect(otherPageButton).not.toHaveClass('page-button-number-selected');
        });
    })

    describe('Special Cases', () => {
        test('handles single page correctly', () => {
            render(
                <Pagination 
                    currentPage={1} 
                    totalPages={1} 
                    onPageChange={mockOnPageChange} 
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Prev')).toBeDisabled();
            expect(screen.getByText('Next')).toBeDisabled();
        });

        test('handles two pages correctly', () => {
            render(
                <Pagination 
                    currentPage={1} 
                    totalPages={2} 
                    onPageChange={mockOnPageChange} 
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.queryByText('...')).not.toBeInTheDocument();
        });
    });
})
