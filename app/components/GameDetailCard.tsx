import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router"
import { gameApi } from "~/services/gameapi.service";
import type { GameInfoResult, ReleaseDate, SimilarGame } from "~/types/resultTypes";
import { coverRateLimiter } from "~/util/RateLimiter";
import searchContext from '~/contexts/searchContext';
import TagPill from './TagPill';
import LoadingScreen from './LoadingScreen';

export default function GameDetailCard() {
    let params = useParams();
    let navigate = useNavigate();
    const tags = useContext(searchContext);
    const [searchParams] = useSearchParams();
    
    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingReleases, setIsLoadingReleases] = useState(false);
    const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
    
    // Data states
    const [gameInfo, setGameInfo] = useState<GameInfoResult | null>(null);
    const [releaseDates, setReleaseDates] = useState<ReleaseDate[]>([]);
    const [similarGames, setSimilarGames] = useState<SimilarGame[]>([]);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    const fromParams = searchParams.get('from');

    if (!params.id) {
        return <></>;
    }

    const gameId = parseInt(params.id);

    // Get tag names from context based on IDs
    function getGenreNames(genreIds: number[]): { id: number; name: string }[] {
        if (!tags || !genreIds) return [];
        return genreIds
            .map(id => {
                const genre = tags.genreTags.find(g => g.id === id);
                return genre ? { id: genre.id, name: genre.name } : null;
            })
            .filter((g): g is { id: number; name: string } => g !== null);
    }

    function getPlatformNames(platformIds: number[]): { id: number; name: string }[] {
        if (!tags || !platformIds) return [];
        return platformIds
            .map(id => {
                const platform = tags.platformTags.find(p => p.id === id);
                return platform ? { id: platform.id, name: platform.name } : null;
            })
            .filter((p): p is { id: number; name: string } => p !== null);
    }

    function getKeywordNames(keywordIds: number[]): { id: number; name: string }[] {
        if (!tags || !keywordIds) return [];
        return keywordIds
            .map(id => {
                const keyword = tags.keywordTags.find(k => k.id === id);
                return keyword ? { id: keyword.id, name: keyword.name } : null;
            })
            .filter((k): k is { id: number; name: string } => k !== null);
    }

    // Fetch game details from API
    useEffect(() => {       
        async function fetchInfo() {
            try {
                setIsLoading(true);

                const gameInfo = await coverRateLimiter.add(async () => {
                    return await gameApi.getFullInfo(gameId);
                });
                
                setGameInfo(gameInfo);

                // Fetch cover image
                if (gameInfo.cover) {
                    try {
                        const coverData = await gameApi.getCover(gameId);
                        if (coverData.success) {
                            setCoverUrl(coverData.imageUrl);
                        }
                    } catch (error) {
                        console.error('Error fetching cover:', error);
                    }
                }

                // Fetch release dates if available
                if (gameInfo.release_dates && gameInfo.release_dates.length > 0) {
                    setIsLoadingReleases(true);
                    try {
                        const releases = await gameApi.getReleaseDates(gameInfo.id);
                        setReleaseDates(releases);
                    } catch (error) {
                        console.error('Error fetching release dates:', error);
                    } finally {
                        setIsLoadingReleases(false);
                    }
                }

                // Fetch similar games if available
                if (gameInfo.similar_games && gameInfo.similar_games.length > 0) {
                    setIsLoadingSimilar(true);
                    try {
                        const similar = await gameApi.getSimilarGames(gameInfo.similar_games.slice(0, 7));
                        
                        setSimilarGames(similar);
                    } catch (error) {
                        console.error('Error fetching similar games:', error);
                    } finally {
                        setIsLoadingSimilar(false);
                    }
                }

            } catch (error) {
                console.error(`Error Getting full game info: `, error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchInfo();
    }, [params.id]);

    function handleBackClick() {
        if (fromParams) {
            const searchUrl = `/search/${decodeURIComponent(fromParams)}`;
            navigate(searchUrl);
        } else {
            navigate('/');
        }
    }

    function handleTagClick(tagName: string, tagType: string) {
    }

    function formatReleaseDate(timestamp: number): string {
        if (!timestamp) return 'TBA';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Show loading screen while fetching main game info
    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!gameInfo) {
        return (
            <div className="detail-page">
                <div className="navigate-header">
                    <button className="button-text" onClick={handleBackClick}>
                        Back to Home
                    </button>
                </div>
                <div className="error-container">
                    <p>Failed to load game information.</p>
                </div>
            </div>
        );
    }

    const genres = getGenreNames(gameInfo.genres || []);
    const platforms = getPlatformNames(gameInfo.platforms || []);
    const keywords = getKeywordNames(gameInfo.keywords || []).slice(0, 10); // Limit keywords shown

    function getReleasePlatform(release: ReleaseDate):string {
        let platform = tags?.platformTags.find(tag => tag.id === release.platformId);
        return platform ? platform.name : 'Unknown'
    }


    return (
        <div 
            className="detail-page"
            data-testid="detail-page"
        >
            <div className="navigate-header">
                <button className="button-text" onClick={handleBackClick}>
                    Back to Home
                </button>
            </div>
            
            <div className="game-info-title-container">
                <h1 
                    className="text-detail-header"
                    data-testid="text-detail-header"
                >
                    {gameInfo.name}
                </h1>
            </div>

            <div className="cover-container">
                {coverUrl ? (
                    <img 
                        src={coverUrl} 
                        alt={`${gameInfo.name} cover`}
                        className="detail-cover-image"
                    />
                ) : (
                    <div className="cover-placeholder">
                        No Cover Available
                    </div>
                )}
            </div>

            <div className="basic-info-container">
                <div className="game-info-summary-container">
                    <h2 className="text-detail-header">Summary</h2>
                    <p className="body-text">{gameInfo.summary || 'No summary available.'}</p>
                </div>
            </div>

            <div className="detail-tags-container">
                {/* Genres */}
                <div className="detail-tag-section">
                    <h3 className="text-detail-body">Genres</h3>
                    <div className="tags-container">
                        {genres.length > 0 ? (
                            genres.map(genre => (
                                <TagPill
                                    key={`genre-${genre.id}`}
                                    id={`genre-${genre.id}`}
                                    text={genre.name}
                                    ariaLabel={`Genre: ${genre.name}`}
                                    canDelete={false}
                                    handleClick={() => handleTagClick(genre.name, 'genre')}
                                />
                            ))
                        ) : (
                            <p className="text-muted">No genres listed</p>
                        )}
                    </div>
                </div>

                {/* Platforms */}
                <div className="detail-tag-section">
                    <h3 className="text-detail-body">Platforms</h3>
                    <div className="tags-container">
                        {platforms.length > 0 ? (
                            platforms.map(platform => (
                                <TagPill
                                    key={`platform-${platform.id}`}
                                    id={`platform-${platform.id}`}
                                    text={platform.name}
                                    ariaLabel={`Platform: ${platform.name}`}
                                    canDelete={false}
                                    handleClick={() => handleTagClick(platform.name, 'platform')}
                                />
                            ))
                        ) : (
                            <p className="text-muted">No platforms listed</p>
                        )}
                    </div>
                </div>

                {/* Keywords */}
                <div className="detail-tag-section">
                    <h3 className="text-detail-body">Keywords</h3>
                    <div className="tags-container">
                        {keywords.length > 0 ? (
                            keywords.map(keyword => (
                                <TagPill
                                    key={`keyword-${keyword.id}`}
                                    id={`keyword-${keyword.id}`}
                                    text={keyword.name}
                                    ariaLabel={`Keyword: ${keyword.name}`}
                                    canDelete={false}
                                    handleClick={() => handleTagClick(keyword.name, 'keyword')}
                                />
                            ))
                        ) : (
                            <p className="text-muted">No keywords listed</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="releases-container">
                <h2 className="text-detail-header">Release Dates</h2>
                {isLoadingReleases ? (
                    <p className="text-muted">Loading release dates...</p>
                ) : releaseDates.length > 0 ? (
                    <table className="releases-table">
                        <thead>
                            <tr>
                                <th>Platform</th>
                                <th>Region</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {releaseDates.map((release, index) => (
                                <tr key={`release-${index}`}>
                                    <td>{getReleasePlatform(release)}</td>
                                    <td>{release.region || 'Worldwide'}</td>
                                    <td>{formatReleaseDate(release.date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-muted">No release date information available</p>
                )}
            </div>

            {/* Similar Games Section */}
            {gameInfo.similar_games && gameInfo.similar_games.length > 0 && (
                <div className="similar-games-container">
                    <h2 className="text-detail-header">Similar Games</h2>
                    {isLoadingSimilar ? (
                        <p className="text-muted">Loading similar games...</p>
                    ) : similarGames.length > 0 ? (
                        <div className="similar-games-list">
                            {similarGames.map(game => (
                                <div 
                                    key={`similar-${game.id}`} 
                                    className="similar-game-item"
                                    onClick={() => navigate(`/game/${game.id}`)}
                                >
                                    <p className="similar-game-name">{game.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No similar games found</p>
                    )}
                </div>
            )}
        </div>
    );
}