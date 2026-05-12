"use client";
import React from 'react';
import Link from 'next/link';
import { Search, Bell, Menu } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Header() {
  const { searchMusic, isSearching, playTrack, showSuggestions, setShowSuggestions } = useMusic();
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(`https://akima-backend-main-2.vercel.app/search?q=${encodeURIComponent(query)}`);
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
      maxWidth: '1100px',
      height: '76px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 1000,
      background: 'rgba(20, 15, 25, 0.4)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: '100px',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(140, 122, 246, 0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
    }}>
      {/* LEFT: Logo & Brand */}
      <div style={{ width: '25%', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(140, 122, 246, 0.05)',
          border: '1px solid rgba(140, 122, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '1.2rem',
          boxShadow: '0 0 15px rgba(140, 122, 246, 0.15), inset 0 0 10px rgba(140, 122, 246, 0.1)',
          fontFamily: 'Inter, sans-serif'
        }}>
          H
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 500, fontSize: '1.1rem', letterSpacing: '-0.3px', lineHeight: '1.2' }}>Haxdin</span>
          <span style={{ color: '#b4a8ff', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
            Premium <span style={{ fontSize: '0.8rem' }}>✦</span>
          </span>
        </div>
      </div>

      {/* MIDDLE: Search Bar */}
      <div style={{
        flex: 1,
        maxWidth: '520px',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '100px',
          height: '50px',
          padding: '0 6px 0 20px',
          transition: 'all 0.3s ease',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
        }}
        className="search-container"
        >
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          
          <input
            type="text"
            placeholder={isSearching ? "Searching..." : "Search artists, songs, podcasts..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'white',
              outline: 'none',
              fontSize: '0.9rem',
              padding: '0 12px',
              fontFamily: 'inherit',
              fontWeight: 400
            }}
            className="search-input"
          />

          <div
            onClick={() => {
              searchMusic(query);
              setShowSuggestions(false);
            }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'transparent',
              border: '1px solid rgba(140, 122, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: query ? 1 : 0.6,
              pointerEvents: query ? 'all' : 'none',
              boxShadow: '0 0 10px rgba(140, 122, 246, 0.1), inset 0 0 8px rgba(140, 122, 246, 0.1)'
            }}
            className="search-btn"
          >
            <Search size={16} color="rgba(255,255,255,0.8)" strokeWidth={2} />
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '0',
            right: '0',
            background: 'rgba(20, 15, 25, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '8px',
            zIndex: 2000,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
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
                  padding: '10px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={track.thumbnail} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: 'white', fontWeight: 500, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Actions */}
      <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px' }}>
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bell-icon">
          <Bell size={22} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
          <div style={{ position: 'absolute', top: '-2px', right: '0px', width: '6px', height: '6px', background: '#b4a8ff', borderRadius: '50%', boxShadow: '0 0 6px #b4a8ff' }} />
        </div>
        
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        className="menu-btn"
        >
          <Menu size={20} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
        </div>
      </div>

      <style jsx>{`
        .search-input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .search-container:focus-within {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(140, 122, 246, 0.2) !important;
          box-shadow: 0 0 20px rgba(140, 122, 246, 0.1), inset 0 2px 10px rgba(0,0,0,0.1) !important;
        }
        .search-btn:hover {
          background: rgba(140, 122, 246, 0.15) !important;
        }
        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .bell-icon:hover {
          opacity: 1 !important;
        }
        .suggestion-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </header>
  );
}

