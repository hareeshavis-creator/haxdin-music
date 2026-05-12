import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');

  if (!artist || !title) {
    return NextResponse.json([]);
  }

  try {
    // SMART TOGGLE: Use local for dev, Vercel for production
    const isDev = process.env.NODE_ENV === 'development';
    const defaultBackend = isDev ? 'http://localhost:5001' : 'https://music-backend-kappa-two.vercel.app';
    const backendUrl = process.env.MUSIC_BACKEND_URL || defaultBackend;
    const query = `related to ${artist} ${title}`;
    const searchUrl = `${backendUrl}/search?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data.slice(0, 10) : []);
  } catch (error) {
    console.error("Music Related Error:", error);
    return NextResponse.json([]);
  }
}
