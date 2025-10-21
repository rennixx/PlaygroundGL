import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playgroundAPI } from '../services/api';

interface Playground {
  _id: string;
  title: string;
  author: {
    username: string;
  };
  tags: string[];
  createdAt: string;
}

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await playgroundAPI.getAll();
        setPlaygrounds(response.data);
      } catch (error) {
        console.error('Error fetching playgrounds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
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

        <div className="playground-grid">
          {playgrounds.map((playground) => (
            <div key={playground._id} className="playground-card">
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
          ))}
        </div>

        {playgrounds.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">
              No playgrounds yet. Be the first to create one!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}