import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
/**
 * Mock data for testing
 */
export const mockTags = {
    genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
        { id: 3, name: 'Strategy' },
        { id: 4, name: 'Role-playing (RPG)' },
        { id: 5, name: 'Shooter' },
    ],
    platforms: [
        { 
            id: 1, 
            name: 'PC (Microsoft Windows)', 
            abbreviation: 'PC',
            alternative_name: 'Windows',
            platform_type: 1
        },
        { 
            id: 2, 
            name: 'PlayStation 5', 
            abbreviation: 'PS5',
            alternative_name: 'PS5',
            platform_type: 2
        },
    ],
    keywords: [
        { id: 1, name: 'multiplayer', slug: 'multiplayer' },
        { id: 2, name: 'singleplayer', slug: 'singleplayer' },
        { id: 3, name: 'cooperative', slug: 'cooperative' },
        { id: 4, name: 'fantasy', slug: 'fantasy' },
    ]
};

export const mockGames = {
    count: 25,
    games: [
        {
            id: 1,
            name: 'Test Game 1',
            cover: 12345,
            first_release_date: 1609459200,
            genres: [1, 2],
            platforms: [1, 2],
            summary: 'A test game for testing',
            languageSupports: []
        },
        {
            id: 2,
            name: 'Test Game 2',
            cover: 12346,
            first_release_date: 1609459200,
            genres: [1, 3],
            platforms: [1],
            summary: 'Another test game',
            languageSupports: []
        },
    ]
};

export const mockFullGameInfo = {
    id: 1,
    age_ratings: [],
    cover: 12345,
    created_at: 0,
    first_release_date: 1609459200,
    franchises: [],
    game_modes: [],
    genres: [1, 2],
    involved_companies: [],
    keywords: [1],
    name: 'Test Game 1',
    parent_game: 0,
    platforms: [1, 2],
    player_perspectives: [],
    release_dates: [],
    screenshots: [],
    similar_games: [],
    slug: 'test-game-1',
    summary: 'A test game for testing',
    tags: [],
    themes: [],
    updated_at: [],
    url: '',
    checksum: '',
    collections: [],
    game_type: 0
}

/**
 * Setup API mocks for consistent test data
 */
export async function setupAPIMocks(page: Page) {
    // Mock platforms endpoint
    // The body should be whatever ends up being the response.data. object,
    // After the call is intercepted here it is then wrapped in the axios response.
    await page.route('**/api/games/platforms', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ platforms: mockTags.platforms })
        });
    });

    // Mock genres endpoint
    await page.route('**/api/games/genres', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ genres: mockTags.genres })
        });
    });

    // Mock keywords endpoint
    await page.route('**/api/games/keywords', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ keywords: mockTags.keywords })
        });
    });

    // Mock recommendations endpoint
    await page.route('**/api/games/recommend', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGames)
        });
    });

    // Mock full game info enpoint
    await page.route('**/api/games/fullinfo/**', async (route) => {
        const url = route.request().url();
        const gameId = url.split('/').pop();
        
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ game: [mockFullGameInfo] })  
        });
    });

    await page.route('**/api/games/cover', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                imageUrl: 'https://via.placeholder.com/264x352',
                coverInfo: {
                    width: 264,
                    height: 352,
                    animated: false
                }
            })
        });
    });
}

/**
 * Wait for the app to be fully loaded with context
 */
export async function waitForAppReady(page: Page) {
    // Wait for the home page to appear
    await page.getByTestId('search-bar');
        
    // Wait for the input to be enabled and ready
    const input = await expect(page.getByTestId('add-tag-input')).toBeVisible();
    
    await typeForTagSearch(page, 'Act');
}

/**
 * Type text with proper timing for tag finder to work
 */
export async function typeForTagSearch(page: Page, text: string) {
    const input = page.getByTestId('add-tag-input');
    
    // Clear and focus
    await input.clear();
    await input.focus();
    await page.waitForTimeout(100);
    
    // Type the text
    await input.fill(text);
    
    // Wait for the component to process (needs at least 3 characters)
    await page.waitForTimeout(300);
    
    // Wait for tag finder to appear
    await expect(page.getByTestId('search-tag-finder')).toBeVisible();
}

/**
 * Click the first tag result in the search tag finder and return the added tag
 * in the search bar
 */
export async function selectFirstTag(page: Page) {
    await expect(page.getByTestId('search-tag-finder')).toBeVisible();

    const searchTagResults = await page.getByLabel('search tag button').all();
    
    await expect(searchTagResults.length).toBeGreaterThan(0);

    searchTagResults[0].click();

    const addedSearchTag = page.getByTestId('search-tag');
    await expect(addedSearchTag).toBeVisible();

    return addedSearchTag;
}
