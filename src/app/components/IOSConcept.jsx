"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Home, Search, Library, User, Heart, MoreHorizontal, Shuffle, Repeat, ChevronDown } from 'lucide-react';

// Reusable iPhone Frame
const IPhoneFrame = ({ children, background = '#0a0a0c' }) => (
  <div style={{
    width: '393px',
    height: '852px',
    backgroundColor: background,
    borderRadius: '55px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0,0,0,0.8), inset 0 0 0 8px #1a1a1c, inset 0 0 20px rgba(255,255,255,0.05)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
    color: 'white',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {/* Dynamic Island / Status Bar Area */}
    <div style={{ height: '54px', width: '100%', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
      <div style={{ width: '120px', height: '32px', backgroundColor: '#000', borderRadius: '20px', marginTop: '10px', boxShadow: 'inset 0 0 4px rgba(255,255,255,0.1)' }}></div>
    </div>
    {children}
  </div>
);

// 1. Immersive Full-Screen Player Concept
export const FullScreenPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const queue = [
    { title: "Neon Skyline", artist: "Cyber Dreamer", duration: "3:50" },
    { title: "Midnight City", artist: "M83", duration: "4:03" },
  ];

  return (
    <IPhoneFrame>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        opacity: isPlaying ? 0.8 : 0.4,
        transition: 'opacity 1s ease'
      }} />

      <div style={{ flex: 1, padding: '70px 20px 20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Top Section: Compact floating "Now Playing" mini card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: '28px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15))' }} />
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100" style={{ width: '48px', height: '48px', borderRadius: '16px', objectFit: 'cover' }} alt="Album" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Lost in Space <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 5px #8B5CF6' }}></span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Enigma Sounds</div>
            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <motion.div style={{ width: `${progress}%`, height: '100%', background: '#8B5CF6', borderRadius: '2px', boxShadow: '0 0 8px #8B5CF6' }} />
            </div>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: 'white', border: 'none', 
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', boxShadow: '0 0 15px rgba(255,255,255,0.2)'
            }}>
            {isPlaying ? <Pause size={16} color="#000" fill="#000" /> : <Play size={16} color="#000" fill="#000" style={{ marginLeft: '2px' }} />}
          </button>
        </motion.div>

        {/* Centerpiece: Animated Vinyl/Visualizer */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', flex: 1 }}>
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0, scale: isPlaying ? [1, 1.02, 1] : 1 }}
            transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            style={{
              width: '280px', height: '280px', borderRadius: '50%',
              background: 'linear-gradient(145deg, #1a1a1c, #0a0a0c)',
              boxShadow: isPlaying ? '0 0 60px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.8)' : '0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
            }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div style={{ position: 'absolute', inset: '15px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }} />
            <div style={{ position: 'absolute', inset: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }} />
            <motion.img 
              src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300"
              style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 20px rgba(0,0,0,0.8)', border: '4px solid #0a0a0c' }}
            />
            <div style={{ position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', background: '#0a0a0c', border: '2px solid rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>

        {/* Playlist / queue section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.5px' }}>Up Next</span>
            <MoreHorizontal size={20} color="rgba(255,255,255,0.4)" />
          </div>
          
          <div style={{ position: 'relative', height: '140px' }}>
            {queue.map((song, idx) => (
              <motion.div
                key={idx}
                style={{
                  position: 'absolute', top: `${idx * 64}px`, left: 0, right: 0,
                  background: idx === 0 ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01))' : 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  border: idx === 0 ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: idx === 0 ? '0 10px 30px rgba(139, 92, 246, 0.1)' : 'none',
                  zIndex: 3 - idx, transform: `scale(${1 - idx * 0.05})`, opacity: 1 - idx * 0.2
                }}
              >
                <div style={{ display: 'flex', marginRight: '-6px' }}>
                  <img src="https://i.pravatar.cc/100?img=4" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #1a1a1c', zIndex: 2 }} />
                  <img src="https://i.pravatar.cc/100?img=5" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #1a1a1c', zIndex: 1, marginLeft: '-12px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: idx === 0 ? 600 : 500, color: idx === 0 ? '#fff' : 'rgba(255,255,255,0.7)' }}>{song.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{song.artist}</div>
                </div>
                <div style={{ fontSize: '13px', color: idx === 0 ? '#8B5CF6' : 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{song.duration}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ 
        position: 'absolute', bottom: '24px', left: '20px', right: '20px',
        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px', height: '70px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 10px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        {[{ icon: Home, label: 'Home' }, { icon: Search, label: 'Search' }, { icon: Library, label: 'Library' }, { icon: User, label: 'Profile' }].map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: item.label === 'Home' ? 1 : 0.4 }}>
            <item.icon size={24} color={item.label === 'Home' ? '#8B5CF6' : '#fff'} />
            <div style={{ fontSize: '10px', fontWeight: 600, opacity: item.label === 'Home' ? 1 : 0, color: '#fff' }}>{item.label}</div>
          </motion.div>
        ))}
      </div>
    </IPhoneFrame>
  );
};

// 2. Home Screen with Compact Mini-Player Concept
export const MiniPlayerConcept = () => {
  return (
    <IPhoneFrame>
      <div style={{ padding: '80px 20px 20px', display: 'flex', flexDirection: 'column', gap: '30px', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>Listen Now</h1>
          <img src="https://i.pravatar.cc/100?img=4" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
        </div>

        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ minWidth: '160px', height: '200px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <img src={`https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200&sig=${i}`} style={{ width: '100%', height: '120px', borderRadius: '16px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Neon Nights</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Synthwave</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Mini Player */}
      <motion.div 
        style={{
          position: 'absolute', bottom: '110px', left: '16px', right: '16px',
          background: 'rgba(30, 30, 35, 0.7)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '24px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)' }} />
        <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Lost in Space</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Enigma Sounds</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginRight: '4px' }}>
          <Heart size={20} color="rgba(255,255,255,0.5)" />
          <Play size={20} color="#fff" fill="#fff" />
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <div style={{ 
        position: 'absolute', bottom: '24px', left: '20px', right: '20px',
        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px', height: '70px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 10px', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {[{ icon: Home, label: 'Home' }, { icon: Search, label: 'Search' }, { icon: Library, label: 'Library' }, { icon: User, label: 'Profile' }].map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: item.label === 'Home' ? 1 : 0.4 }}>
            <item.icon size={24} color={item.label === 'Home' ? '#8B5CF6' : '#fff'} />
            <div style={{ fontSize: '10px', fontWeight: 600, opacity: item.label === 'Home' ? 1 : 0 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </IPhoneFrame>
  );
};

// 3. Lockscreen Widget Concept
export const LockscreenConcept = () => {
  return (
    <IPhoneFrame background="transparent">
      {/* Background Image simulating lockscreen wallpaper */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=1600)',
        backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1,
        filter: 'brightness(0.6) contrast(1.2)'
      }} />
      
      {/* Time */}
      <div style={{ marginTop: '120px', textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontSize: '20px', fontWeight: 600, opacity: 0.9 }}>Tuesday, May 9</div>
        <div style={{ fontSize: '96px', fontWeight: 700, letterSpacing: '-4px', lineHeight: 1, opacity: 0.95 }}>10:24</div>
      </div>

      {/* Lockscreen Player Widget */}
      <div style={{
        position: 'absolute', bottom: '120px', left: '20px', right: '20px',
        background: 'rgba(20, 20, 25, 0.4)', backdropFilter: 'blur(40px) saturate(150%)', WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        borderRadius: '36px', padding: '20px',
        border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=150&h=150" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Lost in Space</div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>Enigma Sounds</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          </div>
        </div>

        {/* Progress */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
          <div style={{ width: '45%', height: '100%', background: '#fff', borderRadius: '3px' }} />
          <div style={{ position: 'absolute', top: '50%', left: '45%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <SkipBack size={28} color="#fff" style={{ opacity: 0.8 }} />
          <Play size={36} color="#fff" fill="#fff" />
          <SkipForward size={28} color="#fff" style={{ opacity: 0.8 }} />
        </div>
      </div>

      {/* Bottom Icons */}
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '130px', height: '5px', background: '#fff', borderRadius: '10px' }} />
    </IPhoneFrame>
  );
};
