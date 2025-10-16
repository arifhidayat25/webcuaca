import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function PwaReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker terdaftar:', r);
    },
    onRegisterError(error) {
      console.log('Error pendaftaran Service Worker:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed right-4 bottom-24 z-50 p-4 rounded-lg shadow-xl bg-card border text-card-foreground"
          role="alert"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {offlineReady ? (
                <p>Aplikasi siap digunakan secara offline.</p>
              ) : (
                <p>Pembaruan tersedia, muat ulang untuk versi terbaru!</p>
              )}
            </div>
            {needRefresh && (
              <Button onClick={() => updateServiceWorker(true)} size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Muat Ulang
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={close}>
              Tutup
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PwaReloadPrompt;
