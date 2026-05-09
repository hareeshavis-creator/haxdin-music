"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2, ListMusic, Share2, MoreHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';

export default function MusicPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious } = useMusic();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentTrack) setIsLoading(true);
  }, [currentTrack?.videoId]);

  useEffect(() => {
    if (!audioRef.current) return;
    const playAudio = async () => {
      try {
        if (isPlaying && currentTrack?.streamUrl) await audioRef.current.play();
        else audioRef.current.pause();
      } catch (error) {
        if (error.name !== 'AbortError') console.error("Playback error:", error);
      }
    };
    playAudio();
  }, [isPlaying, currentTrack?.streamUrl]);

  const handleAudioError = () => { setIsPlaying(false); setIsLoading(false); };
  const handleCanPlay = () => setIsLoading(false);
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (audioRef.current) audioRef.current.currentTime = percentage * duration;
  };

  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVolume);
  };

  if (!currentTrack) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '94%',
      maxWidth: '1000px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'var(--apple-blur)',
      WebkitBackdropFilter: 'var(--apple-blur)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
    }}>
      {currentTrack.streamUrl && (
        <audio 
          key={currentTrack.videoId}
          ref={audioRef}
          src={currentTrack.streamUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={playNext}
          onError={(e) => {
            console.warn("Audio Stream Error: Attempting to handle...", e);
            handleAudioError();
          }}
          onCanPlay={handleCanPlay}
          preload="auto"
          crossOrigin="anonymous"
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '25%' }}>
        <img 
          src={currentTrack.thumbnail} 
          style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '12px', 
            objectFit: 'cover'
          }} 
          alt="" 
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{currentTrack.title}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{currentTrack.artist}</div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: '8px',
        justifyContent: 'center',
        flex: 1,
        marginTop: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.2, cursor: 'pointer' }}><Shuffle size={16} /></button>
          <SkipBack size={20} style={{ cursor: 'pointer', color: 'white', opacity: 0.8 }} onClick={playPrevious} />
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)',
              transition: 'transform 0.2s ease'
            }}
            disabled={isLoading}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} color="#000" />
            ) : isPlaying ? (
              <Pause size={20} color="#000" fill="#000" />
            ) : (
              <Play size={20} color="#000" fill="#000" style={{ marginLeft: '3px' }} />
            )}
          </button>

          <SkipForward size={20} style={{ cursor: 'pointer', color: 'white', opacity: 0.8 }} onClick={playNext} />
          <button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.2, cursor: 'pointer' }}><Repeat size={16} /></button>
        </div>

        {/* Minimal Progress Bar (Inside Centre) */}
        <div 
          style={{ 
            width: '100%',
            maxWidth: '400px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            cursor: 'pointer',
            position: 'relative',
            marginTop: '4px'
          }}
          onClick={handleProgressClick}
        >
          <motion.div 
            style={{ 
              height: '100%', 
              background: isLoading ? 'rgba(255,255,255,0.3)' : 'white',
              width: `${(currentTime / duration) * 100}%`,
              boxShadow: isPlaying ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
              transition: isLoading ? 'none' : 'width 0.1s linear'
            }} 
            animate={isLoading ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 1 }}
            transition={isLoading ? { repeat: Infinity, duration: 1.5 } : {}}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '25%', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100px' }}>
          <Volume2 size={18} style={{ color: 'white', opacity: 0.5 }} />
          <div 
            onClick={handleVolumeClick}
            style={{ flex: 1, height: '3px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ width: `${volume * 100}%`, height: '100%', background: 'white', borderRadius: '10px' }} />
          </div>
        </div>
        <ListMusic size={20} style={{ color: 'white', opacity: 0.4, cursor: 'pointer' }} />
        <Maximize2 size={18} style={{ color: 'white', opacity: 0.4, cursor: 'pointer' }} />
      </div>
    </div>
  );
}
