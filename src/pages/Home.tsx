import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playgroundAPI } from '../services/api';

interface Playground {
  _id: string;
  title: string;
  author: {
    username: string;
  };
  data: any;
  tags: string[];
  createdAt: string;
  playCount?: number;
  thumbnail?: string;
}

interface Filters {
  search: string;
  tag: string;
  sortBy: 'new' | 'trending' | 'mostPlayed';
}

const ITEMS_PER_PAGE = 12;
const AVAILABLE_TAGS = ['action', 'puzzle', 'platformer', 'rpg', 'strategy', 'arcade', 'simulation', 'adventure'];

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    tag: '',
    sortBy: 'new'
  });
  const [totalItems, setTotalItems] = useState(0);

  // Fetch playgrounds from API
  const fetchPlaygrounds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await playgroundAPI.getAll();

      // Mock play counts for demonstration (in real app, this would come from backend)
      const playgroundsWithCounts = response.data.map((pg: Playground, index: number) => ({
        ...pg,
        playCount: Math.floor(Math.random() * 1000) + 50
      }));

      setPlaygrounds(playgroundsWithCounts);
      setTotalItems(playgroundsWithCounts.length);
    } catch (error) {
      console.error('Error fetching playgrounds:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaygrounds();
  }, [fetchPlaygrounds]);

  // Filter and sort playgrounds
  const filteredAndSortedPlaygrounds = useMemo(() => {
    let filtered = [...playgrounds];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pg =>
        pg.title.toLowerCase().includes(searchLower) ||
        pg.author.username.toLowerCase().includes(searchLower)
      );
    }

    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter(pg => pg.tags.includes(filters.tag));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'new':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'mostPlayed':
          return (b.playCount || 0) - (a.playCount || 0);
        case 'trending':
          // Trending: recent and popular
          const scoreA = ((b.playCount || 0) * 0.3) + (new Date(a.createdAt).getTime() / 1000000 * 0.7);
          const scoreB = ((a.playCount || 0) * 0.3) + (new Date(b.createdAt).getTime() / 1000000 * 0.7);
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [playgrounds, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPlaygrounds.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlaygrounds = filteredAndSortedPlaygrounds.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="skeleton-card">
      <div className="skeleton skeleton-thumbnail"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-author"></div>
      <div className="skeleton skeleton-tags"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );

  if (loading && playgrounds.length === 0) {
    return (
      <div className="home">
        <header className="header">
          <div className="header-content">
            <h1 className="title">Global Playground</h1>
            <div className="nav-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="hero">
            <h2 className="hero-title">Discover Amazing Playgrounds</h2>
            <p className="hero-description">
              Explore interactive games and experiences created by our community
            </p>
          </div>

          <div className="playground-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Global Playground</h1>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <h2 className="hero-title">Discover Amazing Playgrounds</h2>
          <p className="hero-description">
            Explore interactive games and experiences created by our community
          </p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search playgrounds or authors..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>

          <div className="filter-controls">
            <select
              className="filter-select"
              value={filters.tag}
              onChange={(e) => handleFilterChange({ tag: e.target.value })}
            >
              <option value="">All Tags</option>
              {AVAILABLE_TAGS.map(tag => (
                <option key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="sort-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as Filters['sortBy'] })}
            >
              <option value="new">Newest First</option>
              <option value="trending">Trending</option>
              <option value="mostPlayed">Most Played</option>
            </select>
          </div>
        </div>

        {/* Playground Grid */}
        <div className="playground-grid">
          {loading && paginatedPlaygrounds.length === 0 ? (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : paginatedPlaygrounds.length > 0 ? (
            paginatedPlaygrounds.map((playground) => (
              <div key={playground._id} className="playground-card">
                <div className="playground-thumbnail">
                  {playground.thumbnail ? (
                    <img
                      src={playground.thumbnail}
                      alt={playground.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : null}
                </div>

                <div className="playground-stats">
                  <span className="play-count">
                    {playground.playCount || 0} plays
                  </span>
                  <span>
                    {new Date(playground.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="playground-title">{playground.title}</h3>
                <p className="playground-author">by {playground.author.username}</p>

                <div className="tags">
                  {playground.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/playground/${playground._id}`}
                  className="play-button"
                >
                  Play Now
                </Link>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">
                {filters.search || filters.tag
                  ? 'No playgrounds found matching your filters. Try adjusting your search or filters.'
                  : 'No playgrounds yet. Be the first to create one!'}
              </p>
              {(filters.search || filters.tag) && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleFilterChange({ search: '', tag: '' })}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}