"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function Hero() {
  const { playTrack, searchResults, relatedResults, showSuggestions } = useMusic();
  const [trending, setTrending] = useState([]);
  const [centerIndex, setCenterIndex] = useState(2);

  useEffect(() => {
    fetch('/api/music/search?q=billboard hot 100')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrending(data.slice(0, 10));
        } else {
          setTrending([]);
        }
      })
      .catch(() => setTrending([]));
  }, []);

  const displayData = relatedResults.length > 0 ? relatedResults : (searchResults.length > 0 ? searchResults : trending);

  useEffect(() => {
    if (displayData.length > 0) {
      setCenterIndex(Math.floor(displayData.length / 2));
    }
  }, [searchResults, relatedResults]);

  const handleNext = () => setCenterIndex((prev) => (prev + 1) % displayData.length);
  const handlePrev = () => setCenterIndex((prev) => (prev - 1 + displayData.length) % displayData.length);

  if (displayData.length === 0) return null;

  return (
    <div style={{
      height: '650px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '1500px',
      paddingTop: '180px',
      overflow: 'hidden',
      marginBottom: '10px',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: '400px'
      }}>
        {displayData.slice(Math.max(0, centerIndex - 3), centerIndex + 4).map((track, i) => {
          const actualIndex = displayData.indexOf(track);
          const offset = actualIndex - centerIndex;
          const absOffset = Math.abs(offset);
          const isActive = absOffset === 0;
          
          let xPos;
          if (showSuggestions) {
            const gap = 420;
            if (offset <= 0) xPos = (offset * 180) - gap;
            else xPos = ((offset - 1) * 180) + gap;
          } else {
            xPos = offset * 240;
          }

          return (
            <motion.div
              key={track.videoId}
              initial={false}
              animate={{
                x: xPos,
                scale: showSuggestions ? 0.5 : (1 - absOffset * 0.15),
                zIndex: 10 - absOffset,
                rotateY: offset * -20,
                opacity: showSuggestions ? 0.15 : (1 - absOffset * 0.35),
                filter: showSuggestions ? 'blur(12px)' : `blur(${absOffset * 1.5}px)`
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={() => {
                if (isActive) playTrack(track, displayData, actualIndex);
                else setCenterIndex(actualIndex);
              }}
              className="glass-card"
              style={{
                position: 'absolute',
                width: '300px',
                height: '400px',
                padding: '12px',
                cursor: 'pointer',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))' 
                  : 'rgba(255, 255, 255, 0.02)',
                boxShadow: isActive 
                  ? '0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(255, 255, 255, 0.1)' 
                  : '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              whileHover={{ y: -15, scale: isActive ? 1.05 : 1 - absOffset * 0.2 + 0.05 }}
            >
              <div style={{ position: 'relative', width: '100%', height: '78%', borderRadius: '22px', overflow: 'hidden' }}>
                <img 
                  src={track.thumbnail} 
                  alt={track.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'saturate(1.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(15px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}>
                      <Play fill="white" color="white" size={32} style={{ marginLeft: '4px' }} />
                    </motion.div>
                  </div>
                )}
              </div>
              <div style={{ padding: '18px 10px', textAlign: 'center' }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 800, 
                  marginBottom: '6px', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>{track.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{track.artist}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', gap: '35px', marginTop: '50px' }}>
        <button onClick={handlePrev} className="nav-btn"><ChevronLeft size={24} /></button>
        <button onClick={handleNext} className="nav-btn"><ChevronRight size={24} /></button>
      </div>

      <style jsx>{`
        .nav-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-btn:hover {
          background: white;
          color: black;
          transform: scale(1.15) translateY(-5px);
          box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

