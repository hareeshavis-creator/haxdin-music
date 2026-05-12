"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, RotateCcw } from 'lucide-react';

const MOOD_IMAGES = {
  neutral: "/chatbot/normal.smiling.face.jpg", 
  blush: "/chatbot/love.jpg",
  sad: "/chatbot/crying.jpg"
};

export default function Chatbot({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [messages, setMessages] = useState([
    { role: 'ai', content: "yoo 😄" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentMood !== "neutral") {
      const timer = setTimeout(() => setCurrentMood("neutral"), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentMood]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      setCurrentMood(data.mood || "neutral");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Ayyo network issue 😭" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'ai', content: "yoo 😄" }]);
    setCurrentMood("neutral");
    setIsTyping(false);
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          style={{
            width: '100%',
            height: '450px',
            background: 'rgba(20, 15, 30, 0.95)',
            backdropFilter: 'blur(40px)',
            borderRadius: '32px',
            border: '1px solid rgba(180, 168, 255, 0.2)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3000,
            overflow: 'hidden'
          }}
        >
            {/* Header with staggered entrance */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <motion.div 
                  key={currentMood}
                  initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    background: 'rgba(180, 168, 255, 0.1)', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <img 
                    src={`${MOOD_IMAGES[currentMood]}?v=1`} 
                    alt="Harry" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: 700 }}
                  >
                    Harry :)
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ color: '#10b981', margin: 0, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> {currentMood === "blush" ? "Blushing..." : "Just vibing"}
                  </motion.p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  whileHover={{ scale: 1.1, rotate: -45 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleReset}
                  title="New Chat"
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
                >
                  <RotateCcw size={18} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* Message Area */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              ref={scrollRef}
              className="hide-scrollbar"
              style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  style={{
                    alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                    background: msg.role === 'ai' ? 'rgba(255,255,255,0.05)' : '#8c7af6',
                    padding: '12px 18px',
                    borderRadius: msg.role === 'ai' ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                    color: 'white',
                    fontSize: '0.95rem',
                    maxWidth: '80%',
                    border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', gap: '4px', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', width: 'fit-content' }}>
                  {[0, 1, 2].map(d => <motion.div key={d} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.1 }} style={{ width: '5px', height: '5px', background: 'white', borderRadius: '50%' }} />)}
                </div>
              )}
            </motion.div>

            {/* Input Field Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ padding: '24px', display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}
            >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk to me bro..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '12px 15px', color: 'white', outline: 'none', fontSize: '0.9rem' }}
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSend} style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#8c7af6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} color="white" />
              </motion.button>
            </motion.div>
          </motion.div>
      </AnimatePresence>
    </>
  );
}
