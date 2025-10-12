// src/store/weatherStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipe data untuk kondisi cuaca
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'night';

// Interface untuk forecast per jam
export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  condition: WeatherCondition;
}

// Interface untuk forecast harian
export interface DailyForecast {
  day: string;
  date: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
  condition: WeatherCondition;
}

// Interface untuk cuaca saat ini
export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  condition: string;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  weatherType: WeatherCondition;
  feelsLike: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  lastUpdated: string;
}

// Interface untuk pengaturan aplikasi
interface WeatherSettings {
  isCelsius: boolean;
  autoTheme: boolean;
  notifications: boolean;
}

// Interface utama untuk store
interface WeatherStore {
  // State
  currentWeather: CurrentWeather | null;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  searchHistory: string[];
  settings: WeatherSettings;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Actions
  fetchWeather: (location: string | { lat: number; lon: number }) => Promise<void>;
  setLocation: (coords: { lat: number; lon: number }) => void;
  toggleUnit: () => void;
  toggleAutoTheme: () => void;
  toggleNotifications: () => void;
  addToHistory: (city: string) => void;
  clearError: () => void;
  clearHistory: () => void;
  refreshWeather: () => Promise<void>;
}

// Constants
const API_KEY = '1eb52e59e8f94824b4020622251110';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// Helper function untuk memetakan kondisi cuaca
const mapWeatherCondition = (conditionText: string, isDay: number): WeatherCondition => {
  const text = conditionText.toLowerCase();
  
  // Prioritaskan night time
  if (isDay === 0) return 'night';
  
  // Mapping kondisi cuaca
  if (text.includes('sunny') || text.includes('clear')) return 'sunny';
  if (text.includes('storm') || text.includes('thunder')) return 'stormy';
  if (text.includes('rain') || text.includes('drizzle') || text.includes('sleet')) return 'rainy';
  if (text.includes('snow') || text.includes('blizzard')) return 'stormy'; // bisa diganti dengan 'snow' jika ada
  if (text.includes('fog') || text.includes('mist')) return 'cloudy'; // bisa diganti dengan 'fog' jika ada
  if (text.includes('cloud') || text.includes('overcast')) return 'cloudy';
  
  // Default ke sunny
  return 'sunny';
};

// Helper function untuk format waktu
const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.getHours().toString().padStart(2, '0') + ':00';
};

// Helper function untuk format hari
const formatDay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { weekday: 'long' });
};

// Helper function untuk format tanggal
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'short' 
  });
};

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentWeather: null,
      hourlyForecast: [],
      dailyForecast: [],
      searchHistory: [],
      settings: {
        isCelsius: true,
        autoTheme: true,
        notifications: true,
      },
      isLoading: true,
      error: null,
      lastUpdated: null,

      // Actions
      fetchWeather: async (location: string | { lat: number; lon: number }) => {
        set({ isLoading: true, error: null });
        
        // Build query berdasarkan tipe input
        let query = '';
        if (typeof location === 'string') {
          query = encodeURIComponent(location);
        } else {
          query = `${location.lat},${location.lon}`;
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=7&lang=id&aqi=no`
          );
          
          // Handle HTTP errors
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error?.message || 
              `Error ${response.status}: Gagal mengambil data cuaca`
            );
          }
          
          const data = await response.json();
          
          // Validasi data response
          if (!data.location || !data.current || !data.forecast) {
            throw new Error('Data cuaca tidak lengkap dari server');
          }

          const { location: loc, current, forecast } = data;
          const todayForecast = forecast.forecastday[0];

          if (!todayForecast) {
            throw new Error('Data prakiraan hari ini tidak tersedia');
          }

          // Process current weather data
          const newCurrentWeather: CurrentWeather = {
            city: loc.name,
            country: loc.country,
            temp: Math.round(current.temp_c),
            condition: current.condition.text,
            minTemp: Math.round(todayForecast.day.mintemp_c),
            maxTemp: Math.round(todayForecast.day.maxtemp_c),
            humidity: current.humidity,
            windSpeed: Math.round(current.wind_kph),
            weatherType: mapWeatherCondition(current.condition.text, current.is_day),
            feelsLike: Math.round(current.feelslike_c),
            pressure: current.pressure_mb,
            visibility: current.vis_km,
            uvIndex: current.uv,
            lastUpdated: current.last_updated
          };

          // Process hourly forecast (24 jam ke depan)
          const newHourlyForecast: HourlyForecast[] = todayForecast.hour
            .filter((_: any, index: number) => index % 3 === 0) // Ambil setiap 3 jam
            .slice(0, 8) // Batasi hingga 8 data
            .map((hour: any) => ({
              time: formatTime(hour.time),
              temp: Math.round(hour.temp_c),
              icon: `https:${hour.condition.icon}`,
              condition: mapWeatherCondition(hour.condition.text, hour.is_day),
            }));

          // Process daily forecast (7 hari)
          const newDailyForecast: DailyForecast[] = forecast.forecastday.map((day: any) => ({
            day: formatDay(day.date),
            date: formatDate(day.date),
            icon: `https:${day.day.condition.icon}`,
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            condition: mapWeatherCondition(day.day.condition.text, 1),
          }));

          // Update state
          set({
            currentWeather: newCurrentWeather,
            hourlyForecast: newHourlyForecast,
            dailyForecast: newDailyForecast,
            isLoading: false,
            error: null,
            lastUpdated: new Date().toISOString()
          });

          // Tambahkan ke history jika berupa nama kota
          if (typeof location === 'string') {
            get().addToHistory(loc.name);
          }

        } catch (err: any) {
          console.error("Gagal mengambil data cuaca:", err);
          set({ 
            error: err.message || 'Terjadi kesalahan tidak terduga', 
            isLoading: false,
            currentWeather: null,
            hourlyForecast: [],
            dailyForecast: []
          });
        }
      },

      setLocation: (coords) => {
        // Panggil fetchWeather dengan koordinat
        get().fetchWeather(coords);
      },

      toggleUnit: () => set((state) => ({
        settings: { 
          ...state.settings, 
          isCelsius: !state.settings.isCelsius 
        }
      })),

      toggleAutoTheme: () => set((state) => ({
        settings: { 
          ...state.settings, 
          autoTheme: !state.settings.autoTheme 
        }
      })),

      toggleNotifications: () => set((state) => ({
        settings: { 
          ...state.settings, 
          notifications: !state.settings.notifications 
        }
      })),

      addToHistory: (city: string) => set((state) => {
        // Hindari duplikasi dan batasi hingga 5 item
        const newHistory = [
          city, 
          ...state.searchHistory.filter(c => 
            c.toLowerCase() !== city.toLowerCase()
          )
        ].slice(0, 5);
        
        return { searchHistory: newHistory };
      }),

      clearError: () => set({ error: null }),

      clearHistory: () => set({ searchHistory: [] }),

      refreshWeather: async () => {
        const { currentWeather } = get();
        if (currentWeather?.city) {
          await get().fetchWeather(currentWeather.city);
        }
      }
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        settings: state.settings,
      }),
    }
  )
);

// Inisialisasi data default saat pertama kali load
const initializeWeather = async () => {
  const { fetchWeather } = useWeatherStore.getState();
  
  // Coba load weather untuk Jakarta sebagai default
  try {
    await fetchWeather('Jakarta');
  } catch (error) {
    console.error('Gagal memuat data cuaca default:', error);
    // Set state error jika gagal
    useWeatherStore.setState({ 
      isLoading: false, 
      error: 'Gagal memuat data cuaca. Pastikan koneksi internet aktif.' 
    });
  }
};



// Panggil inisialisasi
initializeWeather();