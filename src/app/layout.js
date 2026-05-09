import "./globals.css";
import { MusicProvider } from './context/MusicContext';

export const metadata = {
  title: "Haxdin | Experience Music Like Never Before",
  description: "A premium, professional music streaming platform featuring high-fidelity audio and an immersive glassmorphic experience.",
  keywords: ["music streaming", "hi-fi audio", "haxdin", "new releases", "discover music"],
  authors: [{ name: "Haxdin Team" }],
  viewport: "width=device-width, initial-scale=1",
};

import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MusicProvider>
          <Header />
          <main>{children}</main>
          <MusicPlayer />
        </MusicProvider>
      </body>
    </html>
  );
}
