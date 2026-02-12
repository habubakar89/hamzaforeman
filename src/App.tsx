import { useState } from 'react';
import { PasswordGate } from './components/PasswordGate';
import { AnniversaryExperience } from './components/anniversary';

function App() {
  // Password is always required - no persistence
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return <AnniversaryExperience />;
}

export default App;
