import { useState, useEffect } from 'react';
import { parseISO, isToday } from 'date-fns';
import { PasswordGate } from './components/PasswordGate';
import { Timeline } from './components/Timeline';
import { LoveMeter } from './components/LoveMeter';
import { FloatingHeartCursor } from './components/FloatingHeartCursor';
import { ParallaxPetals } from './components/ParallaxPetals';
import { BirthdaySurprise } from './components/BirthdaySurprise';
import { EasterEgg } from './components/EasterEgg';
import { AudioPlayer } from './components/AudioPlayer';
import { EntryBanner } from './components/EntryBanner';
import { NOTES } from './data/notes';

function App() {
  // Password is always required - no persistence
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showMainSite, setShowMainSite] = useState(false);
  const [showBirthdaySurprise, setShowBirthdaySurprise] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    // Check if today is October 21, 2025 (birthday)
    const birthday = parseISO('2025-10-21');
    if (isToday(birthday)) {
      setShowBirthdaySurprise(true);
    }
  }, []);

  const handleUnlock = () => {
    // Unlock for current session only - no localStorage
    setIsUnlocked(true);
    // Show entry banner first
    setShowBanner(true);
    // Trigger audio auto-play after unlock (respects reduced motion in AudioPlayer)
    setShouldAutoPlay(true);
  };

  const handleBannerComplete = () => {
    // Hide banner and show main site
    setShowBanner(false);
    setShowMainSite(true);
  };

  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  if (showBanner) {
    return <EntryBanner onComplete={handleBannerComplete} />;
  }

  if (!showMainSite) {
    return null; // Brief pause while transitioning
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParallaxPetals />
      <FloatingHeartCursor />
      <LoveMeter />
      <AudioPlayer shouldAutoPlay={shouldAutoPlay} />
      <EasterEgg />

      <main className="relative z-10">
        <Timeline notes={NOTES} />
        <BirthdaySurprise show={showBirthdaySurprise} />
      </main>
    </div>
  );
}

export default App;
