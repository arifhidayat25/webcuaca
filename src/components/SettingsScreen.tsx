import { motion } from 'motion/react';
import { useWeatherStore } from '../store/weatherStore';
import { Moon, Thermometer, Bell, Info, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export function SettingsScreen() {
  const { settings, toggleAutoTheme, toggleUnit, toggleNotifications } = useWeatherStore();

  const settingsItems = [
    {
      icon: Moon,
      title: 'Tema Otomatis',
      description: 'Sesuaikan tema dengan waktu siang/malam',
      value: settings.autoTheme,
      onChange: toggleAutoTheme,
    },
    {
      icon: Thermometer,
      title: 'Satuan Suhu',
      description: settings.isCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)',
      value: settings.isCelsius,
      onChange: toggleUnit,
    },
    {
      icon: Bell,
      title: 'Notifikasi Cuaca Ekstrem',
      description: 'Dapatkan peringatan untuk cuaca buruk',
      value: settings.notifications,
      onChange: toggleNotifications,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24 pt-6 px-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl mb-1">Pengaturan</h1>
        <p className="text-muted-foreground">
          Sesuaikan preferensi aplikasi Anda
        </p>
      </motion.div>

      {/* Settings Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-6"
      >
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onChange}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Separator className="my-6" />

      {/* About Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Info className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <div className="mb-0.5">Tentang Aplikasi</div>
                <div className="text-sm text-muted-foreground">
                  SkyNow v1.0.0
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        <p className="mb-1">SkyNow - Cuaca Anda, Hidup di Layar</p>
        <p>© 2025 Semua hak dilindungi</p>
      </motion.div>

      {/* Decorative Weather Elements */}
      <div className="fixed top-20 right-10 opacity-10 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-6xl"
        >
          ☁️
        </motion.div>
      </div>
      
      <div className="fixed bottom-32 left-10 opacity-10 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="text-5xl"
        >
          ☀️
        </motion.div>
      </div>
    </div>
  );
}
