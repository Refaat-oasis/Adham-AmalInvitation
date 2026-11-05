import React from 'react';
import { useWeddingMusic } from './MusicPlayer';

interface TopBarProps {
  isVisible: boolean;
  onReplayDoors: () => void;
  groomNameEn?: string;
  brideNameEn?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  isVisible,
  onReplayDoors,
  groomNameEn = 'Adham',
  brideNameEn = 'Aml',
}) => {
  const { isPlaying, toggleMusic } = useWeddingMusic();

  return (
    <header
      id="topBar"
      className={`fixed top-0 left-0 right-0 z-40 px-2.5 sm:px-4 py-2.5 transition-all duration-700 ${
        isVisible ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-2 rounded-2xl sm:rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-400/40 shadow-2xl">
        {/* Couple Brand */}
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-xs shadow shrink-0">
            A&amp;A
          </span>
          <div className="leading-tight">
            <span className="name-italic-script text-amber-200 text-lg sm:text-xl block" dir="ltr">
              {groomNameEn} &amp; {brideNameEn}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-ui-ar font-semibold text-amber-100/90">
          <a href="#heroSection" className="hover:text-amber-300 transition">العروسين</a>
          <a href="#countdownSection" className="hover:text-amber-300 transition">العد التنازلي</a>
          <a href="#gallerySection" className="hover:text-amber-300 transition">ألبوم الصور</a>
          <a href="#sketchSection" className="hover:text-amber-300 transition">رسم القاعة</a>
          <a href="#locationSection" className="hover:text-amber-300 transition">موقع الفرح</a>
          <a href="#rsvpSection" className="hover:text-amber-300 transition">التهاني</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleMusic}
            className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-ui-ar font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-amber-400/50 transition flex items-center gap-2 shadow"
          >
            <span className={`flex items-end gap-0.5 h-3.5 ${isPlaying ? '' : 'eq-paused'}`}>
              <span className="eq-bar"></span>
              <span className="eq-bar"></span>
              <span className="eq-bar"></span>
            </span>
            <span>{isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}</span>
          </button>

          <button
            type="button"
            onClick={onReplayDoors}
            className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-ui-ar font-medium bg-slate-900 hover:bg-slate-800 text-amber-200 border border-amber-400/35 transition flex items-center gap-1"
            title="إغلاق وإعادة فتح أبواب السماء"
          >
            <svg className="w-3.5 h-3.5 text-amber-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span className="hidden sm:inline">أبواب الدعوة</span>
          </button>
        </div>
      </div>
    </header>
  );
};

