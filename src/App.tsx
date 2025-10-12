import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { ForecastScreen } from './components/ForecastScreen';
import { SearchScreen } from './components/SearchScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeScreen, setActiveScreen] = useState('home');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onNavigate={setActiveScreen} />;
      case 'forecast':
        return <ForecastScreen onNavigate={setActiveScreen} />;
      case 'search':
        return <SearchScreen onNavigate={setActiveScreen} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="size-full bg-background">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : (
          <div key="main" className="size-full">
            <AnimatePresence mode="wait">
              <div key={activeScreen}>
                {renderScreen()}
              </div>
            </AnimatePresence>
            <BottomNavigation 
              activeScreen={activeScreen} 
              onNavigate={setActiveScreen}
            />
          </div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}
