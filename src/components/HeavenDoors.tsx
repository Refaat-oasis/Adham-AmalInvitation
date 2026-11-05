import React, { useState, useEffect, useRef } from 'react';

interface HeavenDoorsProps {
  isOpen: boolean;
  onOpen: () => void;
  groomNameAr?: string;
  groomNameEn?: string;
  brideNameAr?: string;
  brideNameEn?: string;
}

export const HeavenDoors: React.FC<HeavenDoorsProps> = ({
  isOpen,
  onOpen,
  groomNameAr = 'أدهم',
  groomNameEn = 'Adham',
  brideNameAr = 'أمل',
  brideNameEn = 'Aml',
}) => {
  const [hidden, setHidden] = useState(false);
  const [isKnocking, setIsKnocking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const ensureAudioContext = () => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize 3 Realistic Metallic Door Knocks + Old Doorbell Chime
  const playDoorKnockerSound = () => {
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const knockTimes = [0.22, 0.50, 0.80];

      knockTimes.forEach((offset, idx) => {
        const t = now + offset;

        // Deep Wooden/Metallic Door Thud
        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thudOsc.type = 'triangle';
        thudOsc.frequency.setValueAtTime(165 - idx * 8, t);
        thudOsc.frequency.exponentialRampToValueAtTime(48, t + 0.14);

        thudGain.gain.setValueAtTime(0.001, t);
        thudGain.gain.linearRampToValueAtTime(0.42, t + 0.012);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);
        thudOsc.start(t);
        thudOsc.stop(t + 0.17);

        // Brass Anvil Ring Resonance + Vintage Doorbell Overtones
        const bellOsc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(idx === 2 ? 1046.5 : 880, t);

        bellGain.gain.setValueAtTime(0.001, t);
        bellGain.gain.linearRampToValueAtTime(0.12, t + 0.01);
        bellGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.35);

        bellOsc.connect(bellGain);
        bellGain.connect(ctx.destination);
        bellOsc.start(t);
        bellOsc.stop(t + 0.36);
      });
    } catch {
      // Ignore audio policy errors
    }
  };

  const handleKnock = () => {
    if (isOpen || isKnocking) return;
    setIsKnocking(true);
    playDoorKnockerSound();

    setTimeout(() => {
      setIsKnocking(false);
      onOpen();
    }, 980);
  };

  // When isOpen changes, manage visibility timing
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setHidden(true);
      }, 1250);
      return () => clearTimeout(timer);
    } else {
      setHidden(false);
      setIsKnocking(false);
    }
  }, [isOpen]);

  if (hidden && isOpen) return null;

  return (
    <div
      id="heavenGatesOverlay"
      className={`heaven-stage fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none transition-opacity duration-500 ${
        isOpen ? 'gates-opened pointer-events-none opacity-0' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Celestial Backdrop behind the doors */}
      <div
        id="heavenBackdrop"
        className={`absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/90 transition-opacity duration-700 pointer-events-none ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at 50% 45%, rgba(212, 175, 55, 0.18) 0deg, rgba(15, 23, 42, 0.05) 12deg, rgba(212, 175, 55, 0.18) 24deg)',
          }}
        />
      </div>

      {/* Brief Shimmer on Open */}
      <div
        id="heavenBloomGlow"
        className="heaven-bloom absolute w-72 h-72 rounded-full bg-gradient-to-r from-amber-300/35 via-amber-100/45 to-amber-300/35 opacity-0 blur-2xl z-30"
      />

      {/* LEFT HEAVEN DOOR ("Adham" written on the Left Door) */}
      <div
        id="leftHeavenDoor"
        className="door-panel door-left z-20 flex flex-col justify-between p-2.5 sm:p-6 md:p-8 cursor-pointer"
        onClick={handleKnock}
      >
        <div className="w-full h-full border-2 border-amber-600/70 rounded-tl-[110px] sm:rounded-tl-[240px] rounded-bl-2xl p-2 sm:p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-white/95 via-amber-50/85 to-amber-100/75 shadow-inner">
          {/* Ornate Wrought-Gold Filigree SVG */}
          <svg className="w-full h-full text-amber-600/75" viewBox="0 0 300 700" fill="none" preserveAspectRatio="none">
            <path d="M 15 685 L 15 240 Q 15 25 290 15" stroke="currentColor" strokeWidth="3.2" />
            <path d="M 28 675 L 28 245 Q 28 45 290 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
            <line x1="70" y1="115" x2="70" y2="670" stroke="currentColor" strokeWidth="2" />
            <line x1="125" y1="68" x2="125" y2="670" stroke="currentColor" strokeWidth="2" />
            <line x1="180" y1="42" x2="180" y2="670" stroke="currentColor" strokeWidth="2.5" />
            <line x1="235" y1="28" x2="235" y2="670" stroke="currentColor" strokeWidth="2" />
            <path d="M 290 160 C 210 160, 160 210, 125 260 C 90 310, 45 310, 28 280" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path d="M 290 350 C 200 350, 160 300, 125 350 C 90 400, 50 390, 28 360" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path d="M 290 520 C 210 520, 175 480, 125 520 C 75 560, 45 540, 28 520" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <circle cx="295" cy="350" r="85" stroke="currentColor" strokeWidth="2" />
            <circle cx="295" cy="350" r="115" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
          </svg>

          {/* Groom Calligraphic Plaque */}
          <div className="absolute top-[16%] sm:top-[18%] left-2 right-2 sm:left-6 sm:right-6 flex justify-center pointer-events-none">
            <div className="px-3 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-b from-amber-50/95 to-amber-100/95 border-2 border-amber-500/80 shadow-lg text-center">
              <span className="block text-[10px] sm:text-xs font-ui-ar text-amber-800 font-semibold">العريس</span>
              <span className="name-italic-script text-3xl sm:text-5xl md:text-6xl text-amber-950 block leading-none mt-0.5">
                {groomNameEn}
              </span>
              <span className="font-ruqaa text-xs sm:text-base text-amber-800 block mt-0.5">{groomNameAr}</span>
            </div>
          </div>

          <div className="absolute bottom-6 left-2 right-2 sm:left-6 sm:right-6 text-center pointer-events-none">
            <p className="font-arabic text-xs sm:text-base text-amber-900/90 font-bold">أهلاً بكم في ليلة العمر</p>
          </div>
        </div>
      </div>

      {/* RIGHT HEAVEN DOOR ("Aml" written on the Right Door) */}
      <div
        id="rightHeavenDoor"
        className="door-panel door-right z-20 flex flex-col justify-between p-2.5 sm:p-6 md:p-8 cursor-pointer"
        onClick={handleKnock}
      >
        <div className="w-full h-full border-2 border-amber-600/70 rounded-tr-[110px] sm:rounded-tr-[240px] rounded-br-2xl p-2 sm:p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-white/95 via-amber-50/85 to-amber-100/75 shadow-inner">
          {/* Mirrored Ornate Wrought-Gold Filigree SVG */}
          <svg className="w-full h-full text-amber-600/75" viewBox="0 0 300 700" fill="none" preserveAspectRatio="none">
            <path d="M 285 685 L 285 240 Q 285 25 10 15" stroke="currentColor" strokeWidth="3.2" />
            <path d="M 272 675 L 272 245 Q 272 45 10 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
            <line x1="230" y1="115" x2="230" y2="670" stroke="currentColor" strokeWidth="2" />
            <line x1="175" y1="68" x2="175" y2="670" stroke="currentColor" strokeWidth="2" />
            <line x1="120" y1="42" x2="120" y2="670" stroke="currentColor" strokeWidth="2.5" />
            <line x1="65" y1="28" x2="65" y2="670" stroke="currentColor" strokeWidth="2" />
            <path d="M 10 160 C 90 160, 140 210, 175 260 C 210 310, 255 310, 272 280" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path d="M 10 350 C 100 350, 140 300, 175 350 C 210 400, 250 390, 272 360" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path d="M 10 520 C 90 520, 125 480, 175 520 C 225 560, 255 540, 272 520" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <circle cx="5" cy="350" r="85" stroke="currentColor" strokeWidth="2" />
            <circle cx="5" cy="350" r="115" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
          </svg>

          {/* Bride Calligraphic Plaque */}
          <div className="absolute top-[16%] sm:top-[18%] left-2 right-2 sm:left-6 sm:right-6 flex justify-center pointer-events-none">
            <div className="px-3 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-b from-amber-50/95 to-amber-100/95 border-2 border-amber-500/80 shadow-lg text-center">
              <span className="block text-[10px] sm:text-xs font-ui-ar text-amber-800 font-semibold">العروسة</span>
              <span className="name-italic-script text-3xl sm:text-5xl md:text-6xl text-amber-950 block leading-none mt-0.5">
                {brideNameEn}
              </span>
              <span className="font-ruqaa text-xs sm:text-base text-amber-800 block mt-0.5">{brideNameAr}</span>
            </div>
          </div>

          <div className="absolute bottom-6 left-2 right-2 sm:left-6 sm:right-6 text-center pointer-events-none">
            <p className="font-arabic text-xs sm:text-base text-amber-900/90 font-bold">دامت أفراحكم عامرة</p>
          </div>
        </div>
      </div>

      {/* SOFT HEAVENLY CLOUDS AT THE BASE OF THE GATES */}
      <div
        className="cloud-layer cloud-left absolute -bottom-10 left-0 w-3/5 h-36 sm:h-44 z-25 pointer-events-none opacity-90"
        style={{
          background:
            'radial-gradient(ellipse at 30% 80%, rgba(255,255,255,0.95) 0%, rgba(254,246,228,0.65) 50%, transparent 75%)',
          filter: 'blur(12px)',
        }}
      />
      <div
        className="cloud-layer cloud-right absolute -bottom-10 right-0 w-3/5 h-36 sm:h-44 z-25 pointer-events-none opacity-90"
        style={{
          background:
            'radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.95) 0%, rgba(254,246,228,0.65) 50%, transparent 75%)',
          filter: 'blur(12px)',
        }}
      />

      {/* =================================================================
           ANTIQUE ROYAL GOLDEN DOOR KNOCKER & OLD DOORBELL (REPLACES STAMP)
           ================================================================= */}
      <div
        id="openGatesButton"
        role="button"
        tabIndex={0}
        aria-label="اضغط لطرق الباب وفتح الدعوة"
        onClick={handleKnock}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleKnock();
          }
        }}
        className={`center-knocker-wrapper ${
          isKnocking ? 'knocker-striking' : 'knocker-idle'
        } absolute top-[55%] sm:top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center cursor-pointer group select-none focus:outline-none`}
      >
        {/* Sound Shockwave Ripples when the Knocker Strikes */}
        <div className="knock-ripple knock-ripple-1 absolute top-[48%] left-1/2 w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.9)]" />
        <div className="knock-ripple knock-ripple-2 absolute top-[48%] left-1/2 w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.95)]" />
        <div className="knock-ripple knock-ripple-3 absolute top-[48%] left-1/2 w-40 h-40 sm:w-56 sm:h-56 rounded-full border-4 border-white shadow-[0_0_50px_rgba(255,255,255,1)]" />

        {/* Sculpted Antique Brass & Gold Door Knocker + Bell Assembly */}
        <div className="relative w-44 h-56 sm:w-56 sm:h-68 flex flex-col items-center justify-start">
          <svg viewBox="0 0 220 270" className="w-full h-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.65)] overflow-visible">
            <defs>
              {/* Brushed Antique Gold Gradients */}
              <linearGradient id="antiqueGoldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="30%" stopColor="#eab308" />
                <stop offset="65%" stopColor="#a16207" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
              <linearGradient id="knockerRingGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="40%" stopColor="#d97706" />
                <stop offset="75%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
              <radialGradient id="strikeAnvilGrad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>
            </defs>

            {/* 1. Ornate Backplate Mounted on the Doors (Fixed) */}
            <g>
              {/* Outer Baroque Backplate Shield */}
              <path
                d="M 110 12 C 148 12, 174 42, 174 88 C 174 138, 152 184, 110 202 C 68 184, 46 138, 46 88 C 46 42, 72 12, 110 12 Z"
                fill="url(#antiqueGoldPlate)"
                stroke="#451a03"
                strokeWidth="3"
              />
              <path
                d="M 110 22 C 141 22, 162 48, 162 88 C 162 132, 143 172, 110 188 C 77 172, 58 132, 58 88 C 58 48, 79 22, 110 22 Z"
                fill="none"
                stroke="#fef08a"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />

              {/* Top Vintage Doorbell Dome & Clapper Crown */}
              <path d="M 88 16 C 88 2, 132 2, 132 16 Z" fill="url(#knockerRingGold)" stroke="#451a03" strokeWidth="2" />
              <circle cx="110" cy="4" r="5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />

              {/* Mounting Screws */}
              <circle cx="110" cy="32" r="4" fill="#78350f" stroke="#fef08a" strokeWidth="1" />
              <circle cx="68" cy="88" r="4" fill="#78350f" stroke="#fef08a" strokeWidth="1" />
              <circle cx="152" cy="88" r="4" fill="#78350f" stroke="#fef08a" strokeWidth="1" />

              {/* Bottom Strike Anvil Stud (Where the Knocker Hits) */}
              <circle cx="110" cy="162" r="18" fill="url(#strikeAnvilGrad)" stroke="#fef08a" strokeWidth="2" />
              <circle cx="110" cy="162" r="10" fill="#78350f" stroke="#fde047" strokeWidth="1.2" />

              {/* Upper Hinge Mount Pivot */}
              <rect x="86" y="48" width="48" height="24" rx="10" fill="url(#strikeAnvilGrad)" stroke="#fef08a" strokeWidth="2" />
              <circle cx="110" cy="60" r="8" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
            </g>

            {/* 2. Vintage Side Bell Pull Chain (Bounces on Knock) */}
            <g className="bell-pull-cord">
              <line x1="166" y1="75" x2="166" y2="175" stroke="#fde047" strokeWidth="2.5" strokeDasharray="4 3" />
              <path d="M 158 175 L 174 175 L 178 192 L 154 192 Z" fill="url(#knockerRingGold)" stroke="#451a03" strokeWidth="1.8" />
              <circle cx="166" cy="196" r="5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
            </g>

            {/* 3. ANIMATED HINGED HEAVY GOLDEN KNOCKER RING (Lifts & Knocks 3 Times!) */}
            <g className="knocker-hinge-arm">
              {/* Drop Shadow of the Ring */}
              <ellipse cx="110" cy="122" rx="46" ry="52" fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="16" />
              {/* Main Heavy Sculpted Ring */}
              <ellipse cx="110" cy="116" rx="46" ry="52" fill="none" stroke="url(#knockerRingGold)" strokeWidth="15" />
              {/* Inner Highlight Rim of the Knocker Ring */}
              <ellipse cx="110" cy="116" rx="46" ry="52" fill="none" stroke="#fef9c3" strokeWidth="2.2" opacity="0.85" />
              {/* Decorative Filigree Bosses on Left, Right, and Bottom Striker Hammer */}
              <circle cx="64" cy="116" r="10" fill="url(#strikeAnvilGrad)" stroke="#fef08a" strokeWidth="1.8" />
              <circle cx="156" cy="116" r="10" fill="url(#strikeAnvilGrad)" stroke="#fef08a" strokeWidth="1.8" />
              {/* Heavy Bottom Hammer Head that strikes the anvil at y=162 */}
              <rect x="92" y="154" width="36" height="20" rx="9" fill="url(#strikeAnvilGrad)" stroke="#fef9c3" strokeWidth="2.2" />
              {/* Couple Initials Engraved on Hammer */}
              <text x="110" y="168" textAnchor="middle" fill="#fef9c3" fontSize="11" fontWeight="bold" fontFamily="serif">
                A&amp;A
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
