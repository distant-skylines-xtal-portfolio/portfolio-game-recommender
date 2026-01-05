import type { genreTag, keywordTag, platformTag, SearchTagType } from "~/types/tagTypes";


/**
 * Utility for building and parsing search URLs in the format:
 * /search/g:action,rpg/k:survival,horror/p:pc,playstation-5/offset:50
 */

export class SearchUrlBuilder {

    /**
     * Converts search tags into URL-friendly path segments
     * @param tags Array of search tags
     * @param offset Pagination offset
     * @returns URL path string like "g:action,rpg/k:survival/p:pc"
     */
    static buildSearchPath(tags: SearchTagType[], offset: number = 0): string {
        if (tags.length === 0) return '';

        const groupedTags = tags.reduce((acc, tag) => {
            const prefix = this.getTypePrefix(tag.type);
            if (!acc[prefix]) {
                acc[prefix] = [];
            }
            acc[prefix].push(this.slugify(tag.name));
            return acc;
        }, {} as Record<string, string[]>);

        const segments: string[] = [];

        Object.entries(groupedTags).forEach(([prefix, names]) => {
            segments.push(`${prefix}:${names.join(',')}`);
        });

        if (offset > 0) {
            segments.push(`offset:${offset}`);
        }

        return segments.join('/');
    }

    /**
     * Parses URL path segments back into search tags
     * @param pathSegments The path after /search/
     * @param tagContext The context containing all available tags
     * @returns Object with parsed tags and offset
     */
    static parseSearchPath(
        pathSegments: string,
        tagContext: {
            platformTags: platformTag[];
            genreTags: genreTag[];
            keywordTags: keywordTag[];
        }
    ): {tags: SearchTagType[], offset: number} {
        if (!pathSegments) {
            return {tags: [], offset: 0};
        }

        const segments = pathSegments.split('/').filter(Boolean);
        const tags: SearchTagType[] = [];
        let offset = 0;

        segments.forEach(segment => {
            const [prefix, values] = segment.split(':');
            
            if (prefix === 'offset') {
                offset = parseInt(values, 10) || 0;
            }

            const tagNames = values.split(',').map(v => this.unslugify(v));
            const tagType = this.getTypeFromPrefix(prefix);

            if (!tagType) return;
            
            tagNames.forEach(name => {
                let foundTag: SearchTagType | undefined;
                
                if (tagType === 'genre' && tagContext.genreTags) {
                    foundTag = tagContext.genreTags.find(t => 
                        this.normalizeForComparison(t.name) === this.normalizeForComparison(name)
                    );
                } else if (tagType === 'platform' && tagContext.platformTags) {
                    foundTag = tagContext.platformTags.find(t => 
                        this.normalizeForComparison(t.name) === this.normalizeForComparison(name) ||
                        this.normalizeForComparison(t.abbreviation) === this.normalizeForComparison(name) ||
                        this.normalizeForComparison(t.alternative_name) === this.normalizeForComparison(name)
                    );
                } else if (tagType === 'keyword' && tagContext.keywordTags) {
                    foundTag = tagContext.keywordTags.find(t => 
                        this.normalizeForComparison(t.name) === this.normalizeForComparison(name)
                    );
                }

                if (foundTag) {
                    tags.push(foundTag);
                }
            })
        })

        return {tags, offset};
    }

    private static getTypePrefix(type: string): string {
        const prefixMap: Record<string, string> = {
            'genre': 'g',
            'platform': 'p',
            'keyword': 'k',
            'theme': 't',
        };
        return prefixMap[type] || type.charAt(0);
    }

    private static getTypeFromPrefix(prefix: string): string | null {
        const typeMap: Record<string, string> = {
            'g': 'genre',
            'p': 'platform',
            'k': 'keyword',
            't': 'theme',
            'm': 'mode',
            'per': 'perspective',
            'c': 'company'
        };
        return typeMap[prefix] || null;
    }

    private static normalizeForComparison(str: string | undefined): string {
        if (!str) return '';
        return str.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    /**
     * Convert tag name to URL-friendly slug
     * Examples:
     * "Survival Horror" -> "survival-horror"
     * "PlayStation 5" -> "playstation-5"
     * "Action/RPG" -> "action-rpg"
     */
    private static slugify(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') //Replace non-alphanumberic with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
            .replace(/--+/g, '-') //replace multiple hyphens with single
    }

    /**
     * Convert slug back to display name (approximate)
     * Note: This won't perfectly restore the original (e.g., "PlayStation 5" vs "Playstation 5")
     * The exact match should be done by finding the tag in the context
     */
    private static unslugify(slug: string): string {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Build the complete search URL
     */
    static buildSearchUrl(tags: SearchTagType[], offset: number, basePath: string = ''): string {
        const searchPath = this.buildSearchPath(tags, offset);
        const path = searchPath ? `search/${searchPath}` : '/';
        return basePath ? `${basePath}${path}` : path;
    }


    /**
     * Build a detail URL that preserves the search context
     */
    static buildDetailUrl(gameId: string | number, currentSearchPath: string): string {
        if (currentSearchPath) {
            return `detail/${gameId}?from=${encodeURIComponent(currentSearchPath)}`;
        }
        return `detail/${gameId}`;
    }

    /**
     * Extract search path from current location
     */
    static getSearchPathFromLocation(pathname: string) {
        if (pathname.startsWith('/search')) {
            return pathname.slice(8); //remove '/search/'
        }
        return '';
    }
}

// Example usage:
/*
// Building a search URL:
const tags = [
    { id: 1, type: 'genre', name: 'Survival Horror', formattedType: 'Genre' },
    { id: 2, type: 'genre', name: 'Action', formattedType: 'Genre' },
    { id: 48, type: 'platform', name: 'PlayStation 5', formattedType: 'Platform' },
    { id: 123, type: 'keyword', name: 'Psychological Horror', formattedType: 'Keyword' }
];

const searchUrl = SearchUrlBuilder.buildSearchUrl(tags, 50);
// Returns: "/search/g:survival-horror,action/p:playstation-5/k:psychological-horror/offset:50"

// Parsing a search URL:
const pathSegments = "g:survival-horror,action/p:playstation-5/offset:50";
const { tags, offset } = SearchUrlBuilder.parseSearchPath(pathSegments, tagContext);
*/