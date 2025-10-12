// src/components/SearchScreen.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeatherStore } from '../store/weatherStore';
import { Search, MapPin, Clock, X, Navigation, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface AutoCompleteResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchScreenProps {
  onNavigate: (screen: string) => void;
}

export function SearchScreen({ onNavigate }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutoCompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { searchHistory, fetchWeather, setLocation, isLoading: isWeatherLoading } = useWeatherStore();

  const API_KEY = '1eb52e59e8f94824b4020622251110';

  // Fungsi untuk mendapatkan lokasi pengguna
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Gunakan setLocation dari store yang sudah ada
            setLocation({ lat: latitude, lon: longitude });
            setSearchQuery('');
            setSuggestions([]);
            
            setTimeout(() => {
              onNavigate('home');
            }, 300);
          } catch (error) {
            console.error('Kesalahan mengambil lokasi:', error);
            alert('Terjadi kesalahan saat mengambil lokasi.');
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error('Kesalahan geolocation:', error);
          let errorMessage = 'Tidak dapat mengakses lokasi saat ini.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Permintaan lokasi timeout.';
              break;
          }
          
          alert(errorMessage);
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Browser tidak mendukung geolocation.');
    }
  };

  // Efek untuk pencarian otomatis yang lebih baik
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const handler = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Gagal mengambil saran`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Filter dan batasi hasil
          const filteredResults = data
            .filter((city: AutoCompleteResult) => 
              city.name && city.country && city.lat && city.lon
            )
            .slice(0, 8); // Batasi hingga 8 hasil
          
          setSuggestions(filteredResults);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Kesalahan mengambil autocomplete:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, API_KEY]);

  const handleCitySelect = async (city: AutoCompleteResult) => {
    try {
      // Gunakan koordinat dari hasil autocomplete untuk akurasi yang lebih baik
      await fetchWeather(city.name);
      setSearchQuery('');
      setSuggestions([]);
      
      setTimeout(() => {
        onNavigate('home');
      }, 300);
    } catch (error) {
      console.error('Kesalahan memilih kota:', error);
      alert('Terjadi kesalahan saat memilih kota.');
    }
  };

  const handleHistorySelect = async (cityName: string) => {
    try {
      await fetchWeather(cityName);
      setSearchQuery('');
      setSuggestions([]);
      
      setTimeout(() => {
        onNavigate('home');
      }, 300);
    } catch (error) {
      console.error('Kesalahan memilih kota dari riwayat:', error);
      alert('Terjadi kesalahan saat memilih kota dari riwayat.');
    }
  };

  // Format tampilan lokasi yang lebih informatif
  const formatLocationDisplay = (city: AutoCompleteResult) => {
    const parts = [city.name];
    if (city.region && city.region !== city.name) {
      parts.push(city.region);
    }
    if (city.country) {
      parts.push(city.country);
    }
    return parts.join(', ');
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24 pt-6 px-6">
      {/* Search Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Cari Lokasi</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ketik nama kota, daerah, atau kode pos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12 rounded-xl text-base border-2 focus:border-blue-500 transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        <Card
          className="p-4 cursor-pointer hover:bg-accent transition-colors mb-6 border-2 border-dashed border-blue-200 hover:border-blue-300"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation || isWeatherLoading}
        >
          <div className="flex items-center gap-3 text-blue-600">
            {isGettingLocation ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            <div className="font-medium">
              {isGettingLocation ? 'Mendeteksi Lokasi...' : 'Gunakan Lokasi Saat Ini'}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-8">
            Deteksi otomatis lokasi Anda saat ini
          </p>
        </Card>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
          >
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-muted-foreground">Mencari lokasi...</span>
          </motion.div>
        )}

        {/* Search Results */}
        {searchQuery.length > 1 && suggestions.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm text-muted-foreground font-medium">Hasil Pencarian</h2>
            </div>
            <div className="space-y-2">
              {suggestions.map((city, index) => (
                <motion.div
                  key={`${city.id}-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:bg-accent transition-all duration-200 hover:shadow-md border"
                    onClick={() => handleCitySelect(city)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-gray-800">
                          {formatLocationDisplay(city)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {city.lat.toFixed(4)}°N, {city.lon.toFixed(4)}°E
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results Found */}
        {searchQuery.length > 1 && !isLoading && suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-muted-foreground font-medium">Tidak ada hasil ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Coba dengan kata kunci yang berbeda atau lebih spesifik
            </p>
          </motion.div>
        )}

        {/* Search Tips */}
        {searchQuery.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="max-w-sm mx-auto">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tips Pencarian</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Ketik minimal 2 karakter</p>
                <p>• Gunakan nama kota lengkap</p>
                <p>• Tambahkan nama negara untuk hasil lebih akurat</p>
                <p>• Contoh: "Jakarta, Indonesia"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search History */}
      <AnimatePresence>
        {searchQuery.length === 0 && searchHistory.length > 0 && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm text-muted-foreground font-medium">Pencarian Terakhir</h2>
            </div>
            <div className="space-y-2">
              {searchHistory.map((city, index) => (
                <motion.div
                  key={`${city}-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:bg-accent transition-all duration-200 hover:shadow-md border"
                    onClick={() => handleHistorySelect(city)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      <div className="truncate font-medium text-gray-800">{city}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Clear History Button */}
            {searchHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center"
              >
                <button
                  onClick={() => {
                    // Tambahkan fungsi clear history di store jika diperlukan
                    console.log('Fungsi hapus riwayat akan diimplementasikan');
                  }}
                  className="text-sm text-muted-foreground hover:text-gray-700 underline transition-colors"
                >
                  Hapus Riwayat
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Cities Suggestion */}
      {searchQuery.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-sm text-muted-foreground font-medium mb-3">Kota Populer</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Jakarta', 'Surabaya', 'Bandung', 'Bali'].map((city) => (
              <Card
                key={city}
                className="p-3 cursor-pointer hover:bg-accent transition-colors text-center border"
                onClick={() => handleHistorySelect(city)}
              >
                <span className="text-sm font-medium text-gray-700">{city}</span>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}