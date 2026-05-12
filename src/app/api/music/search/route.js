import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    // SMART TOGGLE: Use local for dev, Vercel for production
    const isDev = process.env.NODE_ENV === 'development';
    const defaultBackend = isDev ? 'http://localhost:5001' : 'https://music-backend-kappa-two.vercel.app';
    const backendUrl = process.env.MUSIC_BACKEND_URL || defaultBackend;
    
    const searchUrl = `${backendUrl}/search?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`External API responded with ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json([]);
    }

    // Professional music filtering
    const excludedKeywords = [
      'news', 'shorts', 'movie', 'trailer', 'teaser', 'promo',
      'vlog', 'interview', 'reaction', 'episode', 'review', 'press',
      '#shorts', '#dance', 'reels', 'tiktok', 'compilation', 'funny', 'fail'
    ];

    let filteredResults = data.filter(track => {
      const title = track.title.toLowerCase();
      return !excludedKeywords.some(keyword => title.includes(keyword));
    });

    return NextResponse.json(filteredResults.slice(0, 20));
  } catch (error) {
    console.error("Music Search Error:", error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
