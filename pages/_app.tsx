

// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Inline SVG filter for .liquid-button */}
      <svg width="0" height="0" aria-hidden="true">
        <filter id="liquid-distort">
          <feTurbulence type="fractalNoise"
                       baseFrequency="0.008"
                       numOctaves="2"
                       result="noise" />
          <feDisplacementMap in="SourceGraphic"
                             in2="noise"
                             scale="77"
                             xChannelSelector="R"
                             yChannelSelector="G" />
        </filter>
      </svg>

      <Component {...pageProps} />
    </>
  );
}