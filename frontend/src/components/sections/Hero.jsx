import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiMail, FiArrowDown } from 'react-icons/fi';
import ParticleBackground from '../ui/ParticleBackground';
import { getUploadUrl } from '../../api/axios';

/** Simple typewriter effect cycling through a list of role strings. */
const useTypingEffect = (words) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words?.length) return undefined;
    const current = words[wordIndex % words.length];
    const speed = deleting ? 35 : 70;

    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setDeleting(false);
          setWordIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words]);

  return text;
};

const Hero = ({ about }) => {
  const typingText = useTypingEffect(about?.typingRoles);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="relative z-10 section-container !py-0 text-center flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="badge mb-6"
        >
          👋 Welcome to my portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4"
        >
          Hi, I&apos;m <span className="gradient-text">{about?.name || 'Dhruv Patel'}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 mb-2"
        >
          {about?.title || 'Full Stack Developer | MCA Student'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-8 mb-8 text-primary-400 font-mono text-base sm:text-lg"
        >
          <span>{typingText}</span>
          <span className="animate-pulse">|</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {about?.resume && (
            <a
              href={getUploadUrl(about.resume)}
              download
              className="btn-primary"
            >
              <FiDownload /> Download Resume
            </a>
          )}
          <button onClick={() => scrollTo('contact')} className="btn-secondary">
            <FiMail /> Contact Me
          </button>
        </motion.div>

        <motion.button
          onClick={() => scrollTo('about')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute -bottom-16 sm:bottom-8 text-slate-400 hover:text-white"
          aria-label="Scroll down"
        >
          <FiArrowDown size={24} />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
