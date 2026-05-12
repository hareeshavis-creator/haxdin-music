"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2, Minimize2, ListMusic, Loader2, ChevronDown, MoreHorizontal, Timer, Moon, Headphones, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import dynamic from 'next/dynamic';
import Chatbot from './Chatbot';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function MusicPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious, playTrack, relatedResults, searchResults } = useMusic();
  const playerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatLabel, setShowChatLabel] = useState(false);
  const [deviceName, setDeviceName] = useState('This Device');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      if (/iPhone/.test(ua)) setDeviceName('This iPhone');
      else if (/iPad/.test(ua)) setDeviceName('This iPad');
      else if (/Android/.test(ua)) setDeviceName('This Android');
      else if (/Macintosh/.test(ua)) setDeviceName('MacBook Pro');
      else if (/Windows/.test(ua)) setDeviceName('Windows PC');
    }
  }, []);

  useEffect(() => {
    if (currentTrack) setIsLoading(true);
  }, [currentTrack?.videoId]);

  const formatTime = (time) => {
    if (!time) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (playerRef.current) {
      playerRef.current.seekTo(percentage);
    }
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVolume);
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Hidden ReactPlayer */}
      <div style={{ display: 'none' }}>
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${currentTrack.videoId}`}
          playing={isPlaying}
          volume={volume}
          onReady={() => setIsLoading(false)}
          onStart={() => setIsLoading(false)}
          onProgress={(state) => {
            setCurrentTime(state.playedSeconds);
            setProgress(state.played * 100);
          }}
          onDuration={(dur) => setDuration(dur)}
          onEnded={playNext}
          onError={(e) => {
            console.warn("ReactPlayer Error", e);
            setIsPlaying(false);
            setIsLoading(false);
          }}
          config={{
            youtube: {
              playerVars: { autoplay: 1, controls: 0 }
            }
          }}
        />
      </div>

      <AnimatePresence>
        {!isExpanded ? (
          <motion.div 
            key="mini-player"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: 0,
              right: 0,
              margin: '0 auto',
              width: '92%',
              maxWidth: '1000px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              zIndex: 1000,
              background: 'rgba(20, 15, 25, 0.65)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7), 0 0 50px rgba(140, 122, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            {/* LEFT: Track Info & Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '32%', minWidth: 0 }}>
              <motion.div 
                layoutId={`album-container-${currentTrack.videoId}`}
                style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  boxShadow: '0 0 25px rgba(140, 122, 246, 0.4)',
                  flexShrink: 0
                }}
              >
                {currentTrack.thumbnail ? (
                  <motion.img layoutId={`album-img-${currentTrack.videoId}`} src={currentTrack.thumbnail} style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} alt="" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                )}
              </motion.div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white', letterSpacing: '0.3px' }}>
                    {currentTrack.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentTrack.artist}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', minWidth: '32px', textAlign: 'left' }}>{formatTime(currentTime)}</span>
                  <div 
                    style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', cursor: 'pointer', position: 'relative', minWidth: '100px' }}
                    onClick={handleProgressClick}
                  >
                    <motion.div style={{ height: '100%', background: '#b4a8ff', width: `${progress}%`, borderRadius: '10px', boxShadow: '0 0 6px rgba(180, 168, 255, 0.4)', position: 'relative' }}>
                      <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', background: '#d4ccff', borderRadius: '50%', boxShadow: '0 0 6px rgba(212, 204, 255, 0.5)' }} />
                    </motion.div>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', minWidth: '32px', textAlign: 'right' }}>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* MIDDLE: Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center', flex: 1 }}>
              <button className="control-btn"><Shuffle size={18} color="rgba(255,255,255,0.4)" strokeWidth={2} /></button>
              <button className="control-btn" onClick={playPrevious}><SkipBack size={20} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '54px', height: '54px', borderRadius: '50%', background: 'transparent',
                  border: '2px solid rgba(180, 168, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isLoading ? 'wait' : 'pointer', boxShadow: '0 0 25px rgba(180, 168, 255, 0.25), inset 0 0 15px rgba(180, 168, 255, 0.15)',
                  transition: 'all 0.2s ease',
                }}
                className="play-btn"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} color="#d4ccff" /> : isPlaying ? <Pause size={20} fill="#d4ccff" color="#d4ccff" /> : <Play size={20} fill="#d4ccff" color="#d4ccff" style={{ marginLeft: '3px' }} />}
              </button>
              <button className="control-btn" onClick={playNext}><SkipForward size={20} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" /></button>
              <button className="control-btn"><Repeat size={18} color="rgba(255,255,255,0.4)" strokeWidth={2} /></button>
            </div>

            {/* RIGHT: Volume & Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', width: '32%', justifyContent: 'flex-end' }}>
              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '120px' }}>
                <Volume2 size={18} style={{ color: 'rgba(255,255,255,0.4)' }} strokeWidth={2} />
                <div onClick={handleVolumeClick} style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ width: `${volume * 100}%`, height: '100%', background: '#b4a8ff', borderRadius: '10px', boxShadow: '0 0 6px rgba(180, 168, 255, 0.4)', position: 'relative' }} >
                    <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', background: '#d4ccff', borderRadius: '50%', boxShadow: '0 0 6px rgba(212, 204, 255, 0.5)' }} />
                  </div>
                </div>
              </div>
              <ListMusic size={20} style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }} className="tool-btn" strokeWidth={2} />
              <Maximize2 size={18} onClick={() => setIsExpanded(true)} style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }} className="tool-btn" strokeWidth={2} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'linear-gradient(to bottom, #120d1a, #0a070e)',
              color: 'white',
              borderRadius: '0px',
              display: 'flex',
              flexDirection: 'column',
              padding: '30px 40px',
              overflow: 'hidden'
            }}
          >
            {/* Content Container */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', position: 'relative' }}>
              <button 
                onClick={() => setIsExpanded(false)}
                style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s' }}
                className="hover-bg"
              >
                <ChevronDown size={24} />
              </button>

              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Playing From</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                  {deviceName} <ChevronDown size={14} color="#b4a8ff" />
                </div>
              </div>

              <button 
                style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s' }}
                className="hover-bg"
              >
                <MoreHorizontal size={24} />
              </button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
              
              {/* LEFT: Album Art & Minimal Vinyl */}
              <div style={{ width: '30%', display: 'flex', justifyContent: 'center', position: 'relative', marginLeft: '-40px' }}>
                <div style={{ position: 'relative' }}>
                  {/* Minimal Vinyl Record */}
                  <div style={{
                    position: 'absolute',
                    right: '-70px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #111, #1a1a1a, #111, #1a1a1a, #111)',
                    boxShadow: '10px 0 30px rgba(0,0,0,0.8)',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {/* Minimal grooves */}
                    {[240, 220, 200, 180, 160, 140].map(size => (
                      <div key={size} style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }} />
                    ))}
                  </div>

                  {/* Album Cover */}
                  <motion.div 
                    layoutId={`album-container-${currentTrack.videoId}`}
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      rotate: 0,
                      y: isPlaying ? [0, -10, 0] : 0
                    }}
                    transition={{ 
                      opacity: { duration: 0.6 },
                      scale: { type: 'spring', damping: 20, stiffness: 100 },
                      rotate: { type: 'spring', damping: 20, stiffness: 100 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    style={{
                      width: '320px',
                      height: '320px',
                      borderRadius: '32px',
                      boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(140, 122, 246, 0.2)',
                      position: 'relative',
                      zIndex: 2,
                      overflow: 'hidden'
                    }}
                  >
                    {currentTrack.thumbnail && <motion.img layoutId={`album-img-${currentTrack.videoId}`} src={currentTrack.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                  </motion.div>
                </div>
              </div>

              {/* CENTER: Left-aligned Info & Controls */}
              <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '40px' }}>
                
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '20px', marginBottom: '15px' }}>
                  {[0.4, 0.8, 0.6, 1.0, 0.5].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? {
                        height: ['4px', `${h * 16}px`, '4px'],
                      } : { height: '4px' }}
                      transition={{
                        duration: 0.5 + (i * 0.1),
                        repeat: isPlaying ? Infinity : 0,
                        ease: "easeInOut",
                        delay: i * 0.05
                      }}
                      style={{ 
                        width: '3px', 
                        background: '#b4a8ff', 
                        borderRadius: '10px',
                        boxShadow: '0 0 8px rgba(180, 168, 255, 0.3)'
                      }}
                    />
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ marginBottom: '40px', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', marginBottom: '10px' }}>
                    <h1 style={{ 
                      fontSize: '2.2rem', 
                      fontWeight: 800, 
                      color: 'white', 
                      lineHeight: '1.1',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}>
                      {currentTrack.title}
                    </h1>
                    <motion.div 
                      onClick={() => setIsLiked(!isLiked)}
                      style={{ cursor: 'pointer', marginTop: '8px', flexShrink: 0, position: 'relative' }}
                    >
                      <svg width="34" height="34" viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
                        {/* Particles / Sparkles */}
                        <AnimatePresence>
                          {isLiked && [0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <motion.circle
                              key={i}
                              initial={{ cx: 12, cy: 12, r: 0 }}
                              animate={{ 
                                cx: 12 + Math.cos(angle * Math.PI / 180) * 15,
                                cy: 12 + Math.sin(angle * Math.PI / 180) * 15,
                                r: [0, 1.5, 0]
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.02 }}
                              fill="#b4a8ff"
                            />
                          ))}
                        </AnimatePresence>

                        <motion.path 
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill={isLiked ? "#b4a8ff" : "transparent"}
                          stroke="#b4a8ff"
                          strokeWidth="2"
                          animate={{ 
                            scale: isLiked ? [1, 1.3, 1, 1.1, 1] : 1
                          }}
                          transition={{ 
                            duration: 0.5,
                            times: [0, 0.2, 0.4, 0.6, 1],
                            ease: "easeInOut"
                          }}
                          style={{ transformOrigin: 'center' }}
                        />
                      </svg>
                    </motion.div>
                  </div>
                  <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    {currentTrack.artist} 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#b4a8ff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                  </p>
                </motion.div>

                {/* Progress Bar */}
                <div style={{ width: '100%', maxWidth: '450px', marginBottom: '50px' }}>
                  <div 
                    style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', cursor: 'pointer', position: 'relative', marginBottom: '12px' }}
                    onClick={handleProgressClick}
                  >
                    <motion.div style={{ height: '100%', background: '#d4ccff', width: `${progress}%`, borderRadius: '10px', boxShadow: '0 0 10px rgba(212, 204, 255, 0.5)', position: 'relative' }}>
                      <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', background: '#ece8ff', borderRadius: '50%', boxShadow: '0 0 10px rgba(233, 213, 255, 0.8)' }} />
                    </motion.div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{formatTime(currentTime)}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '40px', alignSelf: 'flex-start', marginLeft: '10px' }}
                >
                  <button className="control-btn"><Shuffle size={22} color="#b4a8ff" strokeWidth={2} /></button>
                  <button className="control-btn" onClick={playPrevious}><SkipBack size={28} color="white" fill="white" /></button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      width: '76px', height: '76px', borderRadius: '50%', background: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: isLoading ? 'wait' : 'pointer', boxShadow: '0 20px 40px rgba(180, 168, 255, 0.3)',
                      transition: 'all 0.2s ease', border: 'none'
                    }}
                    className="play-btn-large"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={30} color="#000" /> : isPlaying ? <Pause size={28} fill="#000" color="#000" /> : <Play size={28} fill="#000" color="#000" style={{ marginLeft: '4px' }} />}
                  </motion.button>

                  <button className="control-btn" onClick={playNext}><SkipForward size={28} color="white" fill="white" /></button>
                  <button className="control-btn"><Repeat size={22} color="#b4a8ff" strokeWidth={2} /></button>
                </motion.div>
              </div>

              {/* RIGHT: Up Next Panel (Fixed space) */}
              <div style={{ width: '28%', flexShrink: 0, marginLeft: '30px', position: 'relative' }}>
                <AnimatePresence mode="wait">
                  {!isChatOpen ? (
                    <motion.div 
                      key="upnext"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ width: '100%', height: '450px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}
                    >
                      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px', marginBottom: '20px' }}>
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', position: 'relative', cursor: 'pointer', letterSpacing: '-0.01em' }}>
                          Up Next
                          <motion.div 
                            layoutId="tab-indicator"
                            style={{ position: 'absolute', bottom: '-16px', left: 0, right: 0, height: '3px', background: '#b4a8ff', borderRadius: '3px' }} 
                          />
                        </span>
                      </div>
      
                      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
                        {(relatedResults && relatedResults.length > 0 
                          ? relatedResults.slice(0, 8) 
                          : searchResults && searchResults.length > 0 
                            ? searchResults.slice(0, 8)
                            : [
                              { title: "Finding more music...", artist: "Curating your vibe" },
                              { title: "Loading...", artist: "..." },
                              { title: "Loading...", artist: "..." }
                            ]).map((track, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (i * 0.05) }}
                            onClick={() => { if (track.videoId) playTrack(track, relatedResults, i); }}
                            whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', borderRadius: '18px', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid transparent' }} 
                          >
                            {track.thumbnail ? (
                              <img src={track.thumbnail} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 8px 15px rgba(0,0,0,0.3)' }} alt="" />
                            ) : (
                              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }} />
                            )}
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</p>
                              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '3px' }}>{track.artist || 'Unknown Artist'}</p>
                            </div>
                            <motion.div 
                              whileHover={{ scale: 1.1, backgroundColor: 'rgba(180, 168, 255, 0.2)' }}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >
                              <Play size={14} fill="#fff" color="#fff" style={{ marginLeft: '2px' }} />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="chatbot-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Chatbot 
                        onClose={() => {
                          setIsChatOpen(false);
                          setShowChatLabel(false);
                        }} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* BOTTOM: Minimal Floating Dock */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px', padding: '16px 30px', marginTop: 'auto',
              maxWidth: '1400px', width: '100%', margin: 'auto auto 0 auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={22} color="white" />
                </div>
                <div>
                  <p style={{ color: '#d4ccff', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>{deviceName} <ChevronDown size={14} /></p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> Connected
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '35px', color: 'rgba(255,255,255,0.4)', alignItems: 'center' }}>
                <motion.div 
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  onClick={() => {
                    if (!showChatLabel) {
                      setShowChatLabel(true);
                    } else if (!isChatOpen) {
                      setIsChatOpen(true);
                    } else {
                      // Close everything and go back to icon only
                      setIsChatOpen(false);
                      setShowChatLabel(false);
                    }
                  }}
                  style={{ 
                    cursor: 'pointer',
                    background: showChatLabel ? 'rgba(180, 168, 255, 0.12)' : 'rgba(255,255,255,0.03)',
                    padding: showChatLabel ? '10px 20px' : '10px',
                    borderRadius: '16px',
                    color: isChatOpen ? '#d4ccff' : 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: showChatLabel ? '1px solid rgba(180, 168, 255, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: showChatLabel ? '0 0 20px rgba(140, 122, 246, 0.15)' : 'none',
                    overflow: 'hidden'
                  }}
                  className="hover-white"
                >
                  <motion.div 
                    layout="position"
                    animate={{ 
                      rotate: showChatLabel ? 360 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <Sparkles 
                      size={22} 
                      style={{ 
                        filter: isChatOpen || showChatLabel ? 'drop-shadow(0 0 8px #8c7af6)' : 'none',
                        color: isChatOpen || showChatLabel ? '#b4a8ff' : 'inherit'
                      }} 
                    />
                  </motion.div>
                  
                  {showChatLabel && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ 
                        type: 'spring', 
                        damping: 20, 
                        stiffness: 200,
                        opacity: { duration: 0.2 }
                      }}
                      style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.3px',
                        color: isChatOpen ? 'white' : '#d4ccff',
                        pointerEvents: 'none'
                      }}
                    >
                      Talk with Harry
                    </motion.span>
                  )}
                </motion.div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '280px', justifyContent: 'flex-end' }}>
                <Volume2 size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <div onClick={handleVolumeClick} style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ width: `${volume * 100}%`, height: '100%', background: '#d4ccff', borderRadius: '10px', boxShadow: '0 0 6px rgba(212, 204, 255, 0.4)', position: 'relative' }} >
                    <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', background: '#ece8ff', borderRadius: '50%', boxShadow: '0 0 6px rgba(233, 213, 255, 0.5)' }} />
                  </div>
                </div>
                <ListMusic size={20} style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '10px' }} className="hover-white" cursor="pointer" />
                <Minimize2 size={20} onClick={() => setIsExpanded(false)} style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginLeft: '10px' }} className="hover-white" />
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .control-btn {
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .control-btn:hover {
          transform: scale(1.15);
        }
        .play-btn:hover {
          background: rgba(180, 168, 255, 0.1) !important;
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(180, 168, 255, 0.4), inset 0 0 25px rgba(180, 168, 255, 0.25) !important;
          border-color: rgba(180, 168, 255, 0.7) !important;
        }
        .play-btn-large:hover {
          background: rgba(180, 168, 255, 0.1) !important;
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(180, 168, 255, 0.4), inset 0 0 30px rgba(180, 168, 255, 0.25) !important;
          border-color: rgba(180, 168, 255, 0.8) !important;
        }
        .tool-btn:hover, .hover-white:hover {
          color: white !important;
        }
        .hover-bg:hover {
          background: rgba(255,255,255,0.15) !important;
        }
        .hover-border:hover {
          border-color: rgba(180, 168, 255, 0.3) !important;
          background: rgba(180, 168, 255, 0.05) !important;
        }
      `}</style>
    </>
  );
}
