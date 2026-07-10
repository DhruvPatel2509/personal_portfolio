import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiArrowUp } from 'react-icons/fi';

const socialIconMap = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  instagram: FiInstagram,
};

const QUICK_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
];

const Footer = ({ about, settings }) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const socialLinks = about?.socialLinks || {};

  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="section-container !py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-xl font-bold gradient-text mb-3">{about?.name || 'Dhruv Patel'}</p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            {settings?.footerText ||
              'Full Stack Developer crafting clean, performant web experiences with the MERN stack.'}
          </p>
        </div>

        <div>
          <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
            Quick Links
          </p>
          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-slate-400 hover:text-primary-400 text-sm transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
            Connect
          </p>
          <div className="flex gap-3">
            {Object.entries(socialLinks)
              .filter(([, url]) => url)
              .map(([key, url]) => {
                const Icon = socialIconMap[key];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full glass-card-hover text-slate-300 hover:text-white"
                    aria-label={key}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 px-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} {about?.name || 'Dhruv Patel'}. All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            className="w-9 h-9 flex items-center justify-center rounded-full glass-card-hover text-slate-300"
            aria-label="Back to top"
          >
            <FiArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
