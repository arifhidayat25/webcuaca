import { motion } from 'motion/react';
import { Home, Calendar, Search, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'forecast', icon: Calendar, label: 'Prakiraan' },
    { id: 'search', icon: Search, label: 'Cari' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200"
    >
      <div className="max-w-lg mx-auto px-6 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-100 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <motion.div
                  animate={{
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10"
                >
                  <item.icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
                
                <motion.span
                  className={`text-xs relative z-10 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                  animate={{
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {item.label}
                </motion.span>
                
                {isActive && (
                  <motion.div
                    layoutId="indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
