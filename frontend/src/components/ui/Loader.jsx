import { motion } from 'framer-motion';

/** Full-screen loading animation shown while the app first boots. */
const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-primary"
          animate={{ rotate: 360, borderRadius: ['20%', '50%', '20%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.p
          className="text-slate-400 text-sm tracking-widest uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          Loading portfolio
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
