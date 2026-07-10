import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

/** Generic slide-up modal shell used to wrap admin add/edit forms. */
const FormModal = ({ open, title, onClose, children, maxWidth = 'max-w-lg' }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`glass-card bg-surface/95 ${maxWidth} w-full max-h-[88vh] overflow-y-auto`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-surface/95 backdrop-blur z-10">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FormModal;
