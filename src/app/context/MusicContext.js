"use client";
import React, { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [relatedResults, setRelatedResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const playTrack = async (track, newQueue = [], index = -1) => {
    try {
      if (newQueue.length > 0) {
        setQueue(newQueue);
        setCurrentIndex(index);
      }

      // Fetch related tracks from our new BACKEND API
      fetch(`/api/music/related?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setRelatedResults(data))
        .catch(err => {
          console.error("Related tracks fetch failed:", err);
          setRelatedResults([]);
        });

      setCurrentTrack(track);
      setIsPlaying(true);
      
    } catch (error) {
      console.error("Error setting track:", error);
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      playTrack(queue[nextIndex], queue, nextIndex);
    }
  };

  const playPrevious = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      playTrack(queue[prevIndex], queue, prevIndex);
    }
  };

  const searchMusic = async (query) => {
    if (!query) return;
    setIsSearching(true);
    setRelatedResults([]); 
    try {
      // Call our new BACKEND API instead of the external one directly
      const response = await fetch(`/api/music/search?q=${encodeURIComponent(query + ' official audio')}`);
      const filteredResults = await response.json();

      setSearchResults(Array.isArray(filteredResults) ? filteredResults : []);
      
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <MusicContext.Provider value={{
      currentTrack, setCurrentTrack,
      isPlaying, setIsPlaying,
      playTrack,
      playNext, playPrevious,
      searchResults, setSearchResults,
      relatedResults,
      isSearching, searchMusic,
      showSuggestions, setShowSuggestions
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
