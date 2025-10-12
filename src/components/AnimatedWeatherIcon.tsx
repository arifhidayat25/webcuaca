import { motion } from 'motion/react';
import { Sun, Cloud, CloudRain, CloudLightning, Moon } from 'lucide-react';
import { WeatherCondition } from '../store/weatherStore';

interface AnimatedWeatherIconProps {
  condition: WeatherCondition;
  size?: number;
}

export function AnimatedWeatherIcon({ condition, size = 120 }: AnimatedWeatherIconProps) {
  const renderIcon = () => {
    switch (condition) {
      case 'sunny':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="text-yellow-300" size={size} strokeWidth={1.5} />
          </motion.div>
        );
      
      case 'cloudy':
        return (
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="text-white" size={size} strokeWidth={1.5} />
          </motion.div>
        );
      
      case 'rainy':
        return (
          <div className="relative">
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <CloudRain className="text-white" size={size} strokeWidth={1.5} />
            </motion.div>
            {/* Rain drops */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-3 bg-white/60 rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: '70%',
                }}
                animate={{
                  y: [0, 20],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      
      case 'stormy':
        return (
          <div className="relative">
            <motion.div
              animate={{ 
                x: [-3, 3, -3],
                rotate: [-2, 2, -2]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <CloudLightning className="text-white" size={size} strokeWidth={1.5} />
            </motion.div>
            {/* Lightning flash */}
            <motion.div
              className="absolute inset-0 bg-yellow-200/0 rounded-full"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          </div>
        );
      
      case 'night':
        return (
          <motion.div
            animate={{ 
              rotate: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon className="text-blue-100" size={size} strokeWidth={1.5} />
          </motion.div>
        );
      
      default:
        return <Sun className="text-yellow-300" size={size} />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="flex items-center justify-center"
    >
      {renderIcon()}
    </motion.div>
  );
}
