import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

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

const melodyChords = [
  [349.23, 440.00, 523.25, 659.25, 783.99, 1046.50],
  [392.00, 493.88, 587.33, 659.25, 783.99, 1174.66],
  [329.63, 392.00, 493.88, 587.33, 783.99, 987.77],
  [440.00, 523.25, 659.25, 783.99, 987.77, 1318.51]
];

export const MusicProvider: React.FC<{ children: React.ReactNode; onToast?: (msg: string) => void }> = ({
  children,
  onToast
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const loopIntervalRef = useRef<any>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const chordIndexRef = useRef(0);

  const ensureAudioContext = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSingleMeasure = () => {
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const chord = melodyChords[chordIndexRef.current % melodyChords.length];
      chordIndexRef.current++;
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        const startTime = now + idx * 0.36;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.065, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 2.5);
        activeOscillatorsRef.current.push(osc);

        osc.onended = () => {
          activeOscillatorsRef.current = activeOscillatorsRef.current.filter(o => o !== osc);
        };
      });
    } catch {
      // Audio autoplay policy restriction
    }
  };

  const startMusic = () => {
    setIsPlaying(true);
    playSingleMeasure();
    clearInterval(loopIntervalRef.current);
    loopIntervalRef.current = setInterval(() => {
      playSingleMeasure();
    }, 2600);
  };

  const stopMusic = () => {
    setIsPlaying(false);
    clearInterval(loopIntervalRef.current);
    loopIntervalRef.current = null;
    activeOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    activeOscillatorsRef.current = [];
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
      onToast?.('تم إيقاف الموسيقى');
    } else {
      startMusic();
      onToast?.('تم تشغيل موسيقى الزفاف ♪');
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

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
      className="fixed bottom-5 left-4 z-40 px-3.5 py-2.5 rounded-full bg-slate-950/95 border-2 border-amber-400/70 text-amber-200 shadow-2xl flex items-center gap-2 text-xs font-ui-ar font-bold hover:scale-105 transition"
    >
      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
      </svg>
      <span>{isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}</span>
    </button>
  );
};

