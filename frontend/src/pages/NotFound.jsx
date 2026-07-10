import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-5 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10"
    >
      <h1 className="text-8xl sm:text-9xl font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-slate-300 mb-2">Page not found</p>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary inline-flex">
        <FiHome size={15} /> Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
