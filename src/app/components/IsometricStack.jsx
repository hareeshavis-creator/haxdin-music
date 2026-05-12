"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function IsometricStack({ tracks, title }) {
  const { playTrack } = useMusic();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollRef = useRef(null);

  if (!tracks || tracks.length === 0) return null;

  const cardWidth = 220;
  const gap = 20;
  const displayTracks = tracks.slice(0, 20);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const step = (cardWidth + gap) * 3; // Scroll 3 cards at a time
      scrollRef.current.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '40px 0', position: 'relative' }}>
      
      {/* HEADER: Title and Nav Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', padding: '0 10px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{title}</h2>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ width: '20px', height: '2px', background: '#b4a8ff', borderRadius: '10px' }} />
            <div style={{ width: '4px', height: '2px', background: '#b4a8ff', borderRadius: '10px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => handleScroll('left')}
            className="nav-btn"
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="nav-btn"
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}
      <div 
        ref={scrollRef}
        className="hide-scrollbar"
        style={{ 
          overflowX: 'auto', 
          padding: '20px 0',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          display: 'flex', 
          gap: `${gap}px`,
          paddingLeft: '10px',
          paddingRight: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: `${gap}px`, width: 'max-content' }}>
          {displayTracks.map((track, i) => {
            const index = i + 1;
            const displayIndex = index < 10 ? `0${index}` : index;
            const isHovered = hoveredIndex === i;
            
            return (
              <motion.div
                key={track.videoId || i}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => playTrack(track, tracks, i)}
                style={{
                  width: `${cardWidth}px`,
                  height: '310px',
                  background: 'rgba(20, 15, 25, 0.4)',
                  borderRadius: '24px',
                  border: isHovered ? '1.5px solid rgba(180, 168, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isHovered ? '0 0 30px rgba(180, 168, 255, 0.15), inset 0 0 20px rgba(180, 168, 255, 0.05)' : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Index Top Left */}
                <span style={{ 
                  color: isHovered ? '#d4ccff' : '#b4a8ff', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  marginBottom: '10px' 
                }}>
                  {displayIndex}
                </span>

                {/* Image Container */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '160px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <motion.div
                    animate={{
                      width: isHovered ? '100%' : '130px',
                      height: isHovered ? '100%' : '130px',
                      borderRadius: isHovered ? '16px' : '50%',
                      opacity: isHovered ? 1 : 0.4
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      overflow: 'hidden',
                      boxShadow: isHovered ? '0 10px 25px rgba(180, 168, 255, 0.3)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={track.thumbnail} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt="" 
                    />
                    {isHovered && <div style={{ position: 'absolute', inset: 0, background: 'rgba(180, 168, 255, 0.15)' }} />}
                  </motion.div>

                  {/* Play Button Overlay */}
                  <motion.div
                    animate={{
                      bottom: isHovered ? '-10px' : '0px',
                      right: isHovered ? '-10px' : '15px',
                      scale: isHovered ? 1.1 : 1
                    }}
                    style={{
                      position: 'absolute',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(20, 15, 25, 0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                      zIndex: 10
                    }}
                  >
                    <Play size={16} fill="white" color="white" style={{ marginLeft: '2px' }} />
                  </motion.div>
                </div>

                {/* Text Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: 'white', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {track.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(255,255,255,0.4)',
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {track.artist}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
                  <div style={{ height: '3px', width: '20px', background: isHovered ? '#b4a8ff' : 'rgba(180, 168, 255, 0.5)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .nav-btn:hover {
          background: rgba(180, 168, 255, 0.2) !important;
          color: white !important;
          border-color: rgba(180, 168, 255, 0.4) !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
