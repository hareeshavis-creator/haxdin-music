import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    // construction of the search URL - Using env variable for deployment
    const backendUrl = process.env.MUSIC_BACKEND_URL || 'http://localhost:5001';
    const searchUrl = `${backendUrl}/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`External API responded with ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json([]);
    }

    // Filter logic moved to backend for cleaner architecture
    const excludedKeywords = [
      'news', 'shorts', 'movie', 'trailer', 'teaser', 'promo',
      'vlog', 'interview', 'reaction', 'episode', 'review', 'press',
      '#shorts', '#dance', 'reels', 'tiktok', 'compilation', 'funny', 'fail'
    ];

    let filteredResults = data.filter(track => {
      const title = track.title.toLowerCase();
      return !excludedKeywords.some(keyword => title.includes(keyword));
    });

    // Ensure we have enough results if possible
    if (filteredResults.length > 0 && filteredResults.length < 20 && data.length >= 20) {
      const missingCount = 20 - filteredResults.length;
      const remaining = data.filter(track => !filteredResults.some(f => f.videoId === track.videoId));
      filteredResults = [...filteredResults, ...remaining.slice(0, missingCount)];
    }

    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error("Music Search API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch music' }, { status: 500 });
  }
}
