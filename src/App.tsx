import React, { useState, useEffect } from 'react';
import { Invitation } from './types';
import { fetchInvitation } from './api';
import { MusicProvider, useWeddingMusic, FloatingMusicButton } from './components/MusicPlayer';
import { CelestialCanvas } from './components/CelestialCanvas';
import { HeavenDoors } from './components/HeavenDoors';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { GallerySection } from './components/GallerySection';
import { SketchSection } from './components/SketchSection';
import { LocationSection } from './components/LocationSection';
import { KindWordsSection } from './components/KindWordsSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const AppContent: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const { startMusic } = useWeddingMusic();

  useEffect(() => {
    fetchInvitation('adham-amal').then((data) => {
      if (data) {
        setInvitation(data);
      }
    });
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;

    // Side appearance animation observer for sections & cards
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('side-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const animatedElements = document.querySelectorAll('.side-from-left, .side-from-right');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isUnlocked]);

  const handleOpenDoors = () => {
    setIsUnlocked(true);
    startMusic();
    document.body.classList.add('invitation-unlocked');
  };

  const handleReplayDoors = () => {
    setIsUnlocked(false);
    document.body.classList.remove('invitation-unlocked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const groomAr = invitation?.groomNameAr || 'أدهم';
  const groomEn = invitation?.groomNameEn || 'Adham';
  const brideAr = invitation?.brideNameAr || 'أمل';
  const brideEn = invitation?.brideNameEn || 'Aml';
  const venueAr = invitation?.venueNameAr || 'قاعة جراند ستار 2';
  const venueAddress = invitation?.venueAddress || 'طريق منقباد — قاعة جراند ستار 2 (52PV+MP)، بني غالب، أسيوط، محافظة أسيوط';
  const venueMapUrl = invitation?.venueMapUrl || 'https://www.google.com/maps/search/?api=1&query=52PV%2BMP%2C+Bani+Ghaleb%2C+Asyut%2C+Assiut+Governorate';

  return (
    <div className="relative min-h-screen selection:bg-amber-500/30 selection:text-amber-200">
      {/* Ambient Celestial Particles Canvas with Falling A Monograms */}
      <CelestialCanvas isUnlocked={isUnlocked} />

      {/* 3D Heaven Doors Entrance Overlay */}
      <HeavenDoors
        isOpen={isUnlocked}
        onOpen={handleOpenDoors}
        groomNameAr={groomAr}
        groomNameEn={groomEn}
        brideNameAr={brideAr}
        brideNameEn={brideEn}
      />

      {/* Top Floating Bar */}
      <TopBar
        isVisible={isUnlocked}
        onReplayDoors={handleReplayDoors}
        groomNameEn={groomEn}
        brideNameEn={brideEn}
      />

      {/* Floating Bottom Music Button */}
      <FloatingMusicButton isUnlocked={isUnlocked} />

      {/* Main Invitation Sections */}
      <main id="invitationMain" className="relative z-10 pt-20 pb-24 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <HeroSection
          groomNameAr={groomAr}
          groomNameEn={groomEn}
          brideNameAr={brideAr}
          brideNameEn={brideEn}
          venueNameAr={venueAr}
        />

        <CountdownSection
          initialDate={invitation?.eventDate}
          onToast={onToast}
        />

        <GallerySection
          onToast={onToast}
          groomNameEn={groomEn}
          brideNameEn={brideEn}
        />

        <SketchSection />

        <LocationSection
          onToast={onToast}
          venueNameAr={venueAr}
          venueAddress={venueAddress}
          venueMapUrl={venueMapUrl}
        />

        <KindWordsSection
          slug="adham-amal"
          onToast={onToast}
          groomNameAr={groomAr}
          brideNameAr={brideAr}
          groomNameEn={groomEn}
          brideNameEn={brideEn}
        />

        <Footer
          groomNameAr={groomAr}
          brideNameAr={brideAr}
          groomNameEn={groomEn}
          brideNameEn={brideEn}
          venueNameAr={venueAr}
        />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <MusicProvider onToast={showToast}>
      <AppContent onToast={showToast} />
      <Toast message={toastMessage} />
    </MusicProvider>
  );
};

export default App;

