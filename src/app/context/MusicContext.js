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

      // Fetch related tracks immediately
      fetch(`https://akima-backend-main-2.vercel.app/search?q=${encodeURIComponent('related to ' + track.artist + ' ' + track.title)}`)
        .then(res => res.json())
        .then(data => setRelatedResults(data.slice(0, 10)))
        .catch(err => console.error("Error fetching related:", err));

      const response = await fetch(`https://akima-backend-main-2.vercel.app/stream?id=${track.videoId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.url) {
        setCurrentTrack({ ...track, streamUrl: data.url });
        setIsPlaying(true);
      } else {
        throw new Error("No stream URL returned from server");
      }
    } catch (error) {
      console.error("Error fetching stream:", error);
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
    setRelatedResults([]); // Clear related when searching manually
    try {
      // Append "official audio" to help the backend prioritize music results
      const searchUrl = `https://akima-backend-main-2.vercel.app/search?q=${encodeURIComponent(query + ' official audio')}`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      // Filter out non-music content like news, shorts, movies, trailers, etc.
      const excludedKeywords = [
        'news', 'shorts', 'movie', 'trailer', 'teaser', 'promo',
        'vlog', 'interview', 'reaction', 'episode', 'review', 'press',
        '#shorts', '#dance', 'reels', 'tiktok', 'compilation', 'funny', 'fail'
      ];

      const filteredResults = data.filter(track => {
        const title = track.title.toLowerCase();
        return !excludedKeywords.some(keyword => title.includes(keyword));
      });

      setSearchResults(filteredResults);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Search error:", error);
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
