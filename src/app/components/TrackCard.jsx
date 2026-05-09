"use client";
import React from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';

export default function TrackCard({ title, artist, image, videoId, category }) {
  const { playTrack } = useMusic();
  const track = { title, artist, thumbnail: image, videoId, category };

  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      className="glass-card" 
      onClick={() => playTrack(track)}
      style={{ 
        padding: '14px', 
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}
    >
      <div style={{ 
        width: '100%', 
        aspectRatio: '1', 
        borderRadius: '18px', 
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
      }} className="image-container">
        <img 
          src={image} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)' }} 
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'all 0.4s ease'
        }} className="play-overlay">
          <div style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(255,255,255,0.3)',
            transform: 'scale(0.8)',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }} className="play-btn-inner">
            <Play fill="black" color="black" size={24} style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 8px 8px 8px' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: 800, 
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'white'
          }}>{title}</h4>
          <p style={{ 
            fontSize: '0.85rem', 
            color: 'rgba(255,255,255,0.7)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{artist}</p>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', padding: '4px' }}>
          <Heart size={18} />
        </button>
      </div>

      <style jsx>{`
        .glass-card:hover .play-overlay { opacity: 1; }
        .glass-card:hover .play-btn-inner { transform: scale(1); }
        .glass-card:hover img { transform: scale(1.15); }
      `}</style>
    </motion.div>
  );
}

