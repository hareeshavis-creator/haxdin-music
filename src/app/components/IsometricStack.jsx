"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function IsometricStack({ tracks, title }) {
  const { playTrack } = useMusic();
  const [isHovered, setIsHovered] = React.useState(false);
  const [scrollX, setScrollX] = React.useState(0);
  const containerRef = React.useRef(null);

  if (!tracks || tracks.length === 0) return null;

  const cardWidth = 240;
  const gap = isHovered ? 25 : -205;
  const displayTracks = tracks.slice(0, 20);
  const maxScroll = (displayTracks.length - 4) * (cardWidth + gap);

  const handleScroll = (direction) => {
    const step = (cardWidth + gap) * 3;
    if (direction === 'left') {
      setScrollX(prev => Math.min(prev + step, 0));
    } else {
      setScrollX(prev => Math.max(prev - step, -maxScroll));
    }
  };

  return (
    <section 
      style={{ padding: '60px 0', position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1.2px', color: 'white', marginBottom: '10px' }}>{title}</h2>
          <div style={{ width: '30px', height: '2px', background: '#7C3AED', borderRadius: '10px' }} />
        </div>
      </div>

      <div style={{ position: 'relative', height: '420px' }}>
        {/* Navigation Arrows positioned on sides */}
        <button 
          onClick={() => handleScroll('left')}
          style={{ 
            position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
            width: '56px', height: '56px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(20px)', zIndex: 200, transition: 'all 0.3s',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
          className="nav-btn"
        >
          <ChevronLeft size={28} />
        </button>

        <button 
          onClick={() => handleScroll('right')}
          style={{ 
            position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
            width: '56px', height: '56px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(20px)', zIndex: 200, transition: 'all 0.3s',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
          className="nav-btn"
        >
          <ChevronRight size={28} />
        </button>

        <div style={{ overflow: 'hidden', height: '100%', borderRadius: '30px' }}>
          <motion.div
            animate={{ x: scrollX }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{ 
              display: 'flex', 
              gap: isHovered ? '25px' : '-205px',
              padding: '40px 0',
              width: 'max-content',
              marginLeft: '40px'
            }}
          >
            {displayTracks.map((track, i) => {
              const index = i + 1;
              const displayIndex = index < 10 ? `0${index}` : index;
              
              return (
                <motion.div
                  key={track.videoId || i}
                  whileHover={{ 
                    y: -15,
                    scale: 1.08,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    zIndex: 100,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => playTrack(track, tracks, i)}
                  style={{
                    width: '240px',
                    height: '320px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: '28px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    zIndex: 40 - i
                  }}
                  className="iso-card"
                >
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.3, zIndex: 0 }}>
                    <img src={track.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))' }} />
                  </div>

                  <div style={{ padding: '20px', height: '100%', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                      <img src={track.thumbnail} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} alt="" />
                      <div style={{ overflow: 'hidden' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{track.artist}</p>
                      </div>
                    </div>
                    <div style={{ width: '2px', height: '30px', background: 'rgba(255,255,255,0.15)', marginLeft: '3px' }} />
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{displayIndex}</span>
                      <span style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1 }}>{displayIndex}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Modern Slider at the bottom */}
      <div style={{ 
        width: '100%', height: '2px', background: 'rgba(255,255,255,0.05)', 
        marginTop: '20px', borderRadius: '2px', position: 'relative', overflow: 'hidden' 
      }}>
        <motion.div 
          animate={{ x: `${(maxScroll > 0 ? (-scrollX / maxScroll) : 0) * 400}%` }}
          style={{ width: '20%', height: '100%', background: '#7C3AED', borderRadius: '2px' }}
        />
      </div>

      <style jsx>{`
        .nav-btn:hover {
          background: rgba(255,255,255,0.2) !important;
          transform: translateY(-50%) scale(1.1) !important;
          border-color: rgba(255,255,255,0.4) !important;
        }
        .nav-btn:active {
          scale: 0.95 !important;
        }
      `}</style>
    </section>
  );
}
