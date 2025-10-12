// src/components/ForecastScreen.tsx

import { motion } from 'motion/react';
import { useWeatherStore } from '../store/weatherStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from './ui/card';
import { ArrowLeft, Thermometer, CloudRain, Wind, Droplets } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface ForecastScreenProps {
  onNavigate: (screen: string) => void;
}

export function ForecastScreen({ onNavigate }: ForecastScreenProps) {
  const { dailyForecast, hourlyForecast, settings, currentWeather, isLoading, error } = useWeatherStore();

  const convertTemp = (temp: number) => {
    if (!settings.isCelsius) {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  // Prepare chart data untuk 24 jam ke depan
  const chartData = hourlyForecast.slice(0, 8).map((hour, index) => ({
    name: hour.time,
    time: index === 0 ? 'Sekarang' : hour.time,
    temp: convertTemp(hour.temp),
    originalTemp: hour.temp,
  }));

  // Prepare weekly data
  const weeklyChartData = dailyForecast.map((day, index) => ({
    day: index === 0 ? 'Hari ini' : day.day.slice(0, 3),
    fullDay: day.day,
    date: day.date,
    max: convertTemp(day.maxTemp),
    min: convertTemp(day.minTemp),
    originalMax: day.maxTemp,
    originalMin: day.minTemp,
    icon: day.icon,
    condition: day.condition,
  }));

  // Loading state
  if (isLoading && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24 pt-6 px-6">
        {/* Header Skeleton */}
        <div className="flex items-center mb-8">
          <Skeleton className="w-10 h-10 rounded-full mr-3" />
          <div>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Chart Skeletons */}
        <Skeleton className="h-64 w-full rounded-2xl mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl mb-6" />

        {/* Daily Forecast Skeletons */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24 pt-6 px-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          ⚠️
        </motion.div>
        <h2 className="text-xl font-semibold mb-2 text-center">Data Tidak Tersedia</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">{error}</p>
        <Button 
          onClick={() => onNavigate('home')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Kembali ke Home
        </Button>
      </div>
    );
  }

  // Jika tidak ada data forecast
  if (dailyForecast.length === 0 || hourlyForecast.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24 pt-6 px-6">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('home')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Prakiraan Cuaca</h1>
            <p className="text-muted-foreground">{currentWeather?.city || 'Lokasi tidak diketahui'}</p>
          </div>
        </div>
        
        <div className="text-center py-16">
          <CloudRain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Data prakiraan tidak tersedia</p>
          <p className="text-sm text-muted-foreground mt-2">Coba refresh atau pilih lokasi lain</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24 pt-6 px-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center mb-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('home')}
          className="mr-3 hover:bg-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Prakiraan Cuaca</h1>
          <p className="text-muted-foreground">{currentWeather?.city}, {currentWeather?.country}</p>
        </div>
      </motion.div>

      {/* 24-Hour Temperature Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 mb-6 shadow-lg border-0">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Suhu 24 Jam ke Depan</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
                        <p className="font-medium text-gray-800">{label}</p>
                        <p className="text-blue-600 font-semibold">
                          {payload[0].value}°{settings.isCelsius ? 'C' : 'F'}
                        </p>
                        {payload[0].payload.originalTemp && (
                          <p className="text-xs text-gray-500">
                            Asli: {payload[0].payload.originalTemp}°C
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Weekly Temperature Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 mb-6 shadow-lg border-0">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Prakiraan 7 Hari</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border min-w-[140px]">
                        <p className="font-medium text-gray-800">{data.fullDay}</p>
                        <p className="text-sm text-gray-600 mb-2">{data.date}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <img src={data.icon} alt="weather" className="w-6 h-6" />
                          <span className="text-xs text-gray-600 capitalize">
                            {data.condition}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-red-500 text-sm">
                            Maks: {data.max}°{settings.isCelsius ? 'C' : 'F'}
                          </p>
                          <p className="text-blue-500 text-sm">
                            Min: {data.min}°{settings.isCelsius ? 'C' : 'F'}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="max" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Maks"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="min" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Min"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Daily Forecast List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Detail Harian</h2>
        </div>
        
        <div className="space-y-3">
          {weeklyChartData.map((day, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4 shadow-md border-0 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-20 flex-shrink-0">
                      <div className="font-medium text-gray-800 text-sm">{day.day}</div>
                      <div className="text-xs text-muted-foreground">{day.date}</div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img 
                        src={day.icon} 
                        alt="Ikon cuaca" 
                        className="w-10 h-10 flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="h-2 bg-gradient-to-r from-blue-400 to-red-400 rounded-full relative">
                          <div 
                            className="absolute w-2 h-4 bg-blue-600 rounded-full -top-1 border border-white"
                            style={{ 
                              left: `${((day.min - Math.min(...weeklyChartData.map(d => d.min))) / 
                                     (Math.max(...weeklyChartData.map(d => d.max)) - Math.min(...weeklyChartData.map(d => d.min)))) * 80 + 10}%` 
                            }}
                          />
                          <div 
                            className="absolute w-2 h-4 bg-red-600 rounded-full -top-1 border border-white"
                            style={{ 
                              left: `${((day.max - Math.min(...weeklyChartData.map(d => d.min))) / 
                                     (Math.max(...weeklyChartData.map(d => d.max)) - Math.min(...weeklyChartData.map(d => d.min)))) * 80 + 10}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-muted-foreground text-xs">Maks</div>
                      <div className="text-lg font-semibold text-red-500">{day.max}°</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground text-xs">Min</div>
                      <div className="text-lg font-semibold text-blue-500">{day.min}°</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Current Weather Summary */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Data diperbarui: {new Date().toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Jakarta'
            })}
          </p>
        </motion.div>
      )}
    </div>
  );
}