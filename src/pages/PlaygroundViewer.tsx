import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
}

export default function PlaygroundViewer() {
  const { id } = useParams<{ id: string }>();
  const [playground, setPlayground] = useState<Playground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlayground = async () => {
      if (!id) return;

      try {
        const response = await playgroundAPI.getById(id);
        setPlayground(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load playground');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayground();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading playground...</div>;
  }

  if (error || !playground) {
    return (
      <div className="loading">
        <div className="text-center">
          <p className="error-message">{error || 'Playground not found'}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="viewer-header">
        <div className="viewer-header-content">
          <Link to="/" className="viewer-back-link">
            ← Back to Home
          </Link>
          <h1 className="viewer-title">{playground.title}</h1>
          <div className="viewer-author">by {playground.author.username}</div>
        </div>
      </header>

      <main className="viewer-main">
        <div className="viewer-card">
          <div className="viewer-header-info">
            <div className="viewer-header-info-content">
              <div className="viewer-info">
                <h2 className="viewer-main-title">{playground.title}</h2>
                <div className="viewer-meta">
                  <span>Created by {playground.author.username}</span>
                  <span>•</span>
                  <span>{new Date(playground.createdAt).toLocaleDateString()}</span>
                </div>
                {playground.tags.length > 0 && (
                  <div className="tags">
                    {playground.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="viewer-content">
            <div className="game-canvas-container">
              <h3 className="game-canvas-title">Game Canvas</h3>
              <div ref={canvasRef} className="game-canvas">
                <div className="game-placeholder">
                  <div>
                    <p className="game-placeholder-title">🎮 Game Ready to Load</p>
                    <p className="game-placeholder-text">
                      Pixi.js game engine will be initialized here
                    </p>
                    <div className="game-data">
                      <pre>Game Data: {JSON.stringify(playground.data, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}