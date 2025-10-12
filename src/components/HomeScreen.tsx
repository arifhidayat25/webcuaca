// src/components/HomeScreen.tsx

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { Droplets, Wind, ArrowRight, Navigation, RefreshCw } from 'lucide-react';
import { WeatherBackground } from './WeatherBackground';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { currentWeather, hourlyForecast, settings, isLoading, error, fetchWeather } = useWeatherStore();
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh data ketika component mount
  useEffect(() => {
    if ((!currentWeather || error) && !isLoading && retryCount < 3) {
      const loadDefaultWeather = async () => {
        try {
          await fetchWeather('Jakarta');
        } catch (error) {
          console.error('Gagal memuat cuaca default:', error);
          setRetryCount(prev => prev + 1);
        }
      };
      
      loadDefaultWeather();
    }
  }, [currentWeather, error, isLoading, retryCount, fetchWeather]);

  // Refresh data setiap 10 menit
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentWeather?.city && !isLoading) {
        fetchWeather(currentWeather.city);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentWeather?.city, isLoading, fetchWeather]);

  const handleRefresh = async () => {
    if (isLoading || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (currentWeather?.city) {
        await fetchWeather(currentWeather.city);
      } else {
        await fetchWeather('Jakarta');
      }
    } catch (error) {
      console.error('Gagal refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const convertTemp = (temp: number) => {
    if (!settings.isCelsius) {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  // 1. Tampilan saat data sedang dimuat (Loading State)
  if (isLoading && !currentWeather) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-200 p-6 pt-12 flex flex-col items-center gap-6">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200" />
        
        {/* Loading Content */}
        <div className="relative z-10 w-full max-w-sm">
          {/* Weather Icon Skeleton */}
          <div className="flex justify-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          
          {/* Temperature Skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-20 w-40 mx-auto mb-4" />
            <Skeleton className="h-6 w-56 mx-auto mb-2" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </div>

          {/* Details Card Skeleton */}
          <Skeleton className="h-48 w-full rounded-3xl mb-6" />

          {/* Hourly Forecast Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-16 rounded-2xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // 2. Tampilan jika terjadi kesalahan (Error State)
  if (error && !currentWeather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-slate-100 to-slate-200">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-6xl mb-4"
        >
          😢
        </motion.div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Terjadi Kesalahan</h2>
        <p className="text-muted-foreground max-w-sm mb-1">{error}</p>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm mb-6">
          Silakan periksa koneksi internet Anda atau coba cari kota lain.
        </p>
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setRetryCount(0);
              fetchWeather('Jakarta');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Coba Lagi
          </Button>
          <Button 
            onClick={() => onNavigate('search')}
            variant="outline"
          >
            Cari Kota Lain
          </Button>
        </div>
      </div>
    );
  }

  // 3. Tampilan utama jika data berhasil dimuat
  return (
    <div className="relative min-h-screen overflow-hidden">
      <WeatherBackground condition={currentWeather?.weatherType || 'sunny'} />
      
      {/* Refresh Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors disabled:opacity-50"
      >
        <RefreshCw 
          className={`w-5 h-5 text-white ${isRefreshing ? 'animate-spin' : ''}`} 
        />
      </motion.button>
      
      <div className="relative z-10 h-full pb-24 pt-12 px-6">
        {/* Main Weather Display */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-8"
        >
          {currentWeather && (
            <>
              <AnimatedWeatherIcon condition={currentWeather.weatherType} />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mt-6"
              >
                <div className="text-7xl text-white mb-2 font-light drop-shadow-lg">
                  {convertTemp(currentWeather.temp)}°
                  <span className="text-2xl ml-1">{settings.isCelsius ? 'C' : 'F'}</span>
                </div>
                <div className="text-2xl text-white/90 mb-1 font-medium drop-shadow">
                  {currentWeather.city}, {currentWeather.country}
                </div>
                <div className="text-lg text-white/80 drop-shadow capitalize">
                  {currentWeather.condition.toLowerCase()}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Temperature Range & Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-md bg-white/20 rounded-3xl p-6 mb-6 border border-white/30 shadow-lg"
        >
          <div className="flex justify-around items-center mb-4">
            <div className="text-center">
              <div className="text-white/70 text-sm mb-1">Suhu Min</div>
              <div className="text-white text-xl font-semibold">
                {currentWeather ? convertTemp(currentWeather.minTemp) : '--'}°
              </div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-white/70 text-sm mb-1">Suhu Maks</div>
              <div className="text-white text-xl font-semibold">
                {currentWeather ? convertTemp(currentWeather.maxTemp) : '--'}°
              </div>
            </div>
          </div>

          <div className="flex justify-around items-center pt-4 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <div className="text-white/70 text-xs">Kelembapan</div>
                <div className="text-white font-semibold">{currentWeather?.humidity || '--'}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <div className="text-white/70 text-xs">Kecepatan Angin</div>
                <div className="text-white font-semibold">{currentWeather?.windSpeed || '--'} km/h</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hourly Forecast */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <div className="text-white/90 mb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            <span className="font-medium">Prakiraan Hari Ini</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {hourlyForecast.slice(0, 8).map((hour, index) => (
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="backdrop-blur-md bg-white/20 rounded-2xl p-4 min-w-[80px] border border-white/30 flex flex-col items-center text-center flex-shrink-0"
              >
                <div className="text-white/80 text-sm mb-2 font-medium">
                  {index === 0 ? 'Sekarang' : hour.time}
                </div>
                <img 
                  src={hour.icon} 
                  alt="weather icon" 
                  className="w-8 h-8 mb-2 drop-shadow"
                />
                <div className="text-white font-semibold text-lg drop-shadow">
                  {convertTemp(hour.temp)}°
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7-Day Forecast Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={() => onNavigate('forecast')}
            className="w-full bg-white/30 backdrop-blur-md text-white border border-white/40 hover:bg-white/40 rounded-2xl h-14 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Lihat Prakiraan 7 Hari
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Last Updated */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-4"
          >
            <p className="text-white/60 text-sm">
              Diperbarui: {new Date().toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
              })}
            </p>
          </motion.div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}