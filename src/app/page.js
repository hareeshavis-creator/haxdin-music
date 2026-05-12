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
        const [trendingRes, newReleasesRes] = await Promise.all([
          fetch('/api/music/search?q=trending music'),
          fetch('/api/music/search?q=new music releases 2026')
        ]);
        
        const trendingData = await trendingRes.json();
        const newData = await newReleasesRes.json();
        
        if (Array.isArray(trendingData)) setTrending(trendingData.slice(0, 10));
        else setTrending([]);
        
        if (Array.isArray(newData)) setNewReleases(newData.slice(0, 5));
        else setNewReleases([]);
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


        {/* Categories / Genres (Moved Down) */}
        <section style={{ padding: '80px 0', marginTop: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Malayalam' },
              { name: 'Tamil' },
              { name: 'Hindi' },
              { name: 'English' },
              { name: 'Phonk' },
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
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            My name is Harry. This is the first website I’ve ever created, inspired by my love for music and my favorite lavender aesthetic.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.9rem' }}>
          <a href="#" style={{ color: '#b4a8ff', textDecoration: 'none', transition: 'opacity 0.3s' }} onMouseOver={(e) => e.target.style.opacity = '0.7'} onMouseOut={(e) => e.target.style.opacity = '1'}>About</a>
          <a href="#" style={{ color: '#b4a8ff', textDecoration: 'none', transition: 'opacity 0.3s' }} onMouseOver={(e) => e.target.style.opacity = '0.7'} onMouseOut={(e) => e.target.style.opacity = '1'}>Privacy Policy</a>
          <a href="#" style={{ color: '#b4a8ff', textDecoration: 'none', transition: 'opacity 0.3s' }} onMouseOver={(e) => e.target.style.opacity = '0.7'} onMouseOut={(e) => e.target.style.opacity = '1'}>Terms of Service</a>
          <a href="#" style={{ color: '#b4a8ff', textDecoration: 'none', transition: 'opacity 0.3s' }} onMouseOver={(e) => e.target.style.opacity = '0.7'} onMouseOut={(e) => e.target.style.opacity = '1'}>Support</a>
        </div>
        <p style={{ marginTop: '40px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>© 2026 Haxdin Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
