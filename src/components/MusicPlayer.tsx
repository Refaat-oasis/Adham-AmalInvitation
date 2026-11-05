import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import weddingAudioSource from '../2023_5vdnandC.m4a';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  startMusic: () => void;
  stopMusic: () => void;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  toggleMusic: () => {},
  startMusic: () => {},
  stopMusic: () => {},
});

export const useWeddingMusic = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode; onToast?: (msg: string) => void }> = ({
  children,
  onToast
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Primary source from bundler, with fallback to public static path
    const audio = new Audio(weddingAudioSource);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.85;

    // Fallback if the bundled asset fails for any network or MIME reason
    audio.onerror = () => {
      if (audio.src !== window.location.origin + '/2023_5vdnandC.m4a') {
        console.warn('[Audio] Retrying with public fallback path: /2023_5vdnandC.m4a');
        audio.src = '/2023_5vdnandC.m4a';
        audio.load();
        if (isPlaying) {
          audio.play().catch(() => {});
        }
      }
    };

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const startMusic = () => {
    if (!audioRef.current) return;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('[Audio] Autoplay policy requires user interaction:', err);
        });
    }
  };

  const stopMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      stopMusic();
      onToast?.('تم إيقاف الصوت');
    } else {
      startMusic();
      onToast?.('تم تشغيل الصوت ♪');
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, startMusic, stopMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

export const FloatingMusicButton: React.FC<{ isUnlocked: boolean }> = ({ isUnlocked }) => {
  const { isPlaying, toggleMusic } = useWeddingMusic();

  if (!isUnlocked) return null;

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="fixed bottom-5 left-4 z-40 px-3.5 py-2.5 rounded-full bg-slate-950/95 border-2 border-amber-400/70 text-amber-200 shadow-2xl flex items-center gap-2 text-xs font-ui-ar font-bold hover:scale-105 transition cursor-pointer"
    >
      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
      </svg>
      <span>{isPlaying ? 'إيقاف الصوت' : 'تشغيل الصوت'}</span>
    </button>
  );
};
