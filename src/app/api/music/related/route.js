import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');

  if (!artist || !title) {
    return NextResponse.json([]);
  }

  try {
    const query = `related to ${artist} ${title}`;
    const backendUrl = process.env.MUSIC_BACKEND_URL || 'http://localhost:5001';
    const searchUrl = `${backendUrl}/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data.slice(0, 10) : []);
  } catch (error) {
    console.error("Music Related API Error:", error);
    return NextResponse.json([]);
  }
}
