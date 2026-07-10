import { motion } from 'framer-motion';

/** Standardized title + subtitle used at the top of every public section. */
const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
  >
    {eyebrow && (
      <p className="text-center text-primary-400 font-medium tracking-widest uppercase text-xs mb-3">
        {eyebrow}
      </p>
    )}
    <h2 className="section-title">
      <span className="gradient-text">{title}</span>
    </h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </motion.div>
);

export default SectionHeading;
