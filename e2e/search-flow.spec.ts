import { test, expect } from '@playwright/test';
import { 
    setupAPIMocks, 
    waitForAppReady, 
    typeForTagSearch,
    selectFirstTag
} from './test-setup';
import { button } from 'framer-motion/client';

test.describe('Game Search Flow', () => {
    
    test.beforeEach(async ({ page }) => {
        await setupAPIMocks(page);
        
        // Now navigate
        await page.goto('/');
        
        // Wait for app to be fully ready with context loaded
        await waitForAppReady(page);
    });

    test('should display loading screen during data fetch', async({ page }) => {
        // Set up delayed mock responses
        await page.route('**/api/games/platforms', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ platforms: [] })
            });
        });
        
        await page.route('**/api/games/genres', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ genres: [] })
            });
        });
        
        await page.route('**/api/games/keywords', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ keywords: [] })
            });
        });

        // Navigate and check loading screen
        const navigationPromise = page.goto('/', { waitUntil: 'domcontentloaded' });
        
        const loadingScreen = page.getByTestId('loading-container');
        await expect(loadingScreen).toBeVisible({ timeout: 5000 });
        
        await navigationPromise;
        
        // Eventually home page should appear
        await expect(page.getByTestId('home-page')).toBeVisible();
        await expect(loadingScreen).not.toBeVisible();
    });
    
    test('should load and display search bar after initial load', async({ page }) => {
        const searchbar = page.getByTestId('search-bar');
        await expect(searchbar).toBeVisible();

        const input = page.getByLabel('Add tag');
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('placeholder');
    });

    test('should show tag suggestions when typing', async ({ page }) => {
        await typeForTagSearch(page, 'action');
        
        // Verify tag finder is visible
        const tagFinder = page.getByTestId('search-tag-finder');
        await expect(tagFinder).toBeVisible();
        
        // Verify we have results
        const tagResults = await page.getByLabel('search tag button').all();
        const count = tagResults.length;
        expect(count).toBeGreaterThan(0);
        
        // Should include our mocked "Action" genre
        await expect(page.getByRole('button').filter({hasText: 'Action'})).toBeVisible();
    });

    test('should add tags and enable search button', async({ page }) => {
        const searchButton = page.getByRole('button', {name: 'Search Games'});
        
        // Initially disabled
        await expect(searchButton).toBeDisabled();
        
        // Add a tag
        await typeForTagSearch(page, 'action');
        const addedTag = await selectFirstTag(page);
        
        // Verify tag was added
        await expect(addedTag).toBeVisible();
        const tagText = addedTag.getByText('Action');
        expect(tagText).toBeTruthy();
        expect(tagText).toContainText(':');
        
        // Search button should be enabled
        await expect(searchButton).toBeEnabled();
    });

    test('should perform search and display results', async({ page }) => {
        // Add a tag
        await typeForTagSearch(page, 'action');
        await selectFirstTag(page);
        
        // Click search
        const searchButton = page.getByRole('button', {name: 'Search Games'});
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        
        // Wait for results
        const searchResults = page.getByTestId('search-results');
        await expect(searchResults).toBeVisible({ timeout: 10000 });
        
        // Check header
        const resultsHeader = searchResults.getByText('Recommended games');
        await expect(resultsHeader).toBeVisible();

        // Should have game cards (from our mock data)
        const actioNGameCard = page.getByTestId('game-card').filter({hasText: 'Test Game 1'});
        await expect(actioNGameCard).toBeVisible({ timeout: 10000 });
    });

    test('should remove tags when clicking X button', async ({ page }) => {
        // Add a tag
        await typeForTagSearch(page, 'action');
        const addedTag = await selectFirstTag(page);
        
        // Click tag to remove it
        await addedTag.click();
        
        // Tag should disappear
        await expect(addedTag).not.toBeVisible({ timeout: 5000 });
        
        // Search button should be disabled
        const searchButton = page.getByRole('button', {name: 'Search Games'});
        await expect(searchButton).toBeDisabled();
    });

    test('should navigate tag suggestions with keyboard', async ({ page }) => {
        const input = page.getByTestId('add-tag-input');
        
        await typeForTagSearch(page, 'action');
        
        // First item should be selected by default
        let selectedItems = page.getByTestId('tag-result-selected');
        
        // Navigate down
        await input.press('ArrowDown');
        await page.waitForTimeout(100);
        
        await page.getByTestId('tag-result-selected');

        // Navigate back up
        await input.press('ArrowUp');
        await page.waitForTimeout(100);
        
        // Press Enter to select
        await input.press('Enter');
        
        // Tag should be added
        const addedSearchTag = page.getByTestId('search-tag');
        await expect(addedSearchTag).toBeVisible();
        
        // Input should be cleared
        await expect(input).toHaveValue('');
    });

});

// Additional test for debugging purposes
test.describe('Debug helpers', () => {
    test('verify mock data loads correctly', async ({ page }) => {
        await setupAPIMocks(page);
        await page.goto('/');
        await waitForAppReady(page);
        
        // Log what we find
        const input = page.locator('#add-tag-input');
        await input.fill('act');
        await page.waitForTimeout(500);
        
        const tagFinderCount = await page.locator('.tag-finder').count();
        const resultsCount = await page.locator('.tag-result, .tag-result-selected').count();
        
        console.log(`Tag finder visible: ${tagFinderCount > 0}`);
        console.log(`Number of results: ${resultsCount}`);
        
        // Get the actual text of results
        if (resultsCount > 0) {
            const results = await page.locator('.tag-result, .tag-result-selected').allTextContents();
            console.log('Results found:', results);
        }
        
        expect(resultsCount).toBeGreaterThan(0);
    });
});