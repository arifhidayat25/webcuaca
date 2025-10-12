import { motion } from 'motion/react';
import { WeatherCondition } from '../store/weatherStore';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
}

export function WeatherBackground({ condition }: WeatherBackgroundProps) {
  const getGradient = () => {
    switch (condition) {
      case 'sunny':
        return 'from-blue-400 via-blue-300 to-blue-200';
      case 'cloudy':
        return 'from-gray-400 via-gray-300 to-gray-200';
      case 'rainy':
        return 'from-slate-600 via-slate-500 to-slate-400';
      case 'stormy':
        return 'from-gray-700 via-gray-600 to-gray-500';
      case 'night':
        return 'from-indigo-900 via-indigo-800 to-indigo-700';
      default:
        return 'from-blue-400 via-blue-300 to-blue-200';
    }
  };

  return (
    <>
      <motion.div
        key={condition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`fixed inset-0 bg-gradient-to-b ${getGradient()}`}
      />

      {/* Animated Elements Based on Weather */}
      {condition === 'sunny' && (
        <>
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-yellow-200/30"
              style={{
                height: '100px',
                top: '10%',
                left: '50%',
                transformOrigin: 'top center',
                rotate: `${i * 45}deg`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      {condition === 'cloudy' && (
        <>
          {/* Floating clouds */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-16 bg-white/40 rounded-full blur-xl"
              style={{
                top: `${20 + i * 25}%`,
              }}
              animate={{
                x: [-100, window.innerWidth + 100],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}

      {condition === 'rainy' && (
        <>
          {/* Rain drops */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-6 bg-white/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, window.innerHeight + 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}

      {condition === 'night' && (
        <>
          {/* Stars */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </>
  );
}
