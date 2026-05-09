"use client";
import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import TrackCard from './components/TrackCard';
import ThreeBackground from './components/ThreeBackground';
import { useMusic } from './context/MusicContext';
import { motion } from 'framer-motion';
import { ChevronRight, Music, Play, Disc, Mic2, Star } from 'lucide-react';
import IsometricStack from './components/IsometricStack';

export default function Home() {
  const { playTrack, searchResults, isSearching, searchMusic } = useMusic();
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, newRes] = await Promise.all([
          fetch('http://localhost:5001/search?q=trending music'),
          fetch('http://localhost:5001/search?q=new music releases 2026')
        ]);
        
        const trendingData = await trendingRes.json();
        const newData = await newRes.json();
        
        setTrending(trendingData.slice(0, 10));
        setNewReleases(newData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching music:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ paddingBottom: '120px' }}>
      <ThreeBackground />
      <Hero />

      <main className="container">
        {/* Search Results Section */}
        {searchResults.length > 0 && (
          <IsometricStack tracks={searchResults} title="Search Results" />
        )}

        {/* Trending Section */}
        {!isSearching && trending.length > 0 && (
          <IsometricStack tracks={trending} title="Trending Now" />
        )}

        {/* New Releases Section */}
        <section style={{ padding: '40px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>New Releases</h2>
            <button 
              onClick={() => searchMusic('new releases 2026')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            >
              See All <ChevronRight size={18} />
            </button>
          </div>
          <div className="music-grid">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <div key={i} className="glass-card" style={{ height: '250px', animate: 'pulse' }} />)
            ) : (
              newReleases.map((track, i) => (
                <div key={i} onClick={() => playTrack(track, newReleases, i)}>
                  <TrackCard title={track.title} artist={track.artist} image={track.thumbnail} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Categories / Genres (Moved Down) */}
        <section style={{ padding: '80px 0', marginTop: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Malayalam', icon: <Music size={24} /> },
              { name: 'Tamil', icon: <Disc size={24} /> },
              { name: 'Hindi', icon: <Mic2 size={24} /> },
              { name: 'English', icon: <Star size={24} /> },
              { name: 'Phonk', icon: <Play size={24} /> },
            ].map((genre, i) => (
              <motion.div
                key={i}
                onClick={() => searchMusic(genre.name)}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  height: '110px',
                  borderRadius: '22px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'var(--apple-blur)',
                  WebkitBackdropFilter: 'var(--apple-blur)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
              >
                <div style={{ color: 'white', opacity: 0.9 }}>{genre.icon}</div>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>{genre.name}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container" style={{ padding: '100px 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px' }}>Haxdin</h3>
          <p style={{ color: 'var(--text-dim)' }}>The future of sound is here.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <a href="#">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
        <p style={{ marginTop: '40px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>© 2026 Haxdin Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
