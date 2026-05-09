"use client";
import React from 'react';
import Link from 'next/link';
import { Search, User, Bell, Radio, Music2, Library, Compass } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Header() {
  const { searchMusic, isSearching, playTrack, showSuggestions, setShowSuggestions } = useMusic();
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(`http://localhost:5001/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          setSuggestions(data.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error("Suggestions error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchMusic(query);
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '92%',
      maxWidth: '1300px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'var(--apple-blur)',
      WebkitBackdropFilter: 'var(--apple-blur)',
      borderRadius: '100px',
      border: '1px solid var(--glass-border)',
      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
    }}>
      <div style={{ width: '25%', display: 'flex', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '1.6rem', 
          fontWeight: 900, 
          letterSpacing: '-1.5px',
          fontFamily: 'Urbanist, sans-serif',
          color: 'white',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}>Haxdin</span>
      </div>

      <div style={{
        flex: 1,
        maxWidth: '600px',
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder={isSearching ? "Searching..." : "Search artists, songs, podcasts..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          style={{
            width: '100%',
            height: '54px',
            padding: '0 60px 0 30px',
            borderRadius: '100px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            outline: 'none',
            fontSize: '1rem',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
          }}
          className="search-input"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '65px',
            left: '0',
            right: '0',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'var(--apple-blur)',
            WebkitBackdropFilter: 'var(--apple-blur)',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px',
            zIndex: 2000,
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
          }}>
            {suggestions.map((track) => (
              <div 
                key={track.videoId}
                onClick={() => {
                  playTrack(track);
                  setQuery('');
                  setShowSuggestions(false);
                }}
                className="suggestion-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={track.thumbnail} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div 
          onClick={() => {
            searchMusic(query);
            setShowSuggestions(false);
          }}
          style={{ 
            position: 'absolute', 
            right: '4px', 
            top: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: query ? 1 : 0.5,
            transition: 'all 0.4s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            pointerEvents: query ? 'all' : 'none'
          }}
        >
          <Search size={20} color="white" strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '30px' }}>
        <Bell size={24} color="white" style={{ cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.8} />
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'white'
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = 'scale(1)';
        }}
        >
          H
        </div>
      </div>
      
      <style jsx>{`
        .search-input:focus {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: white !important;
          box-shadow: 0 0 30px var(--accent-glow) !important;
        }
        .suggestion-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }
      `}</style>
    </header>
  );
}

