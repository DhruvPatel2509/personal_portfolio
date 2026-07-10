import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getUploadUrl } from '../../api/axios';

const ProjectModal = ({ project, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);
  if (!project) return null;

  const images = project.images?.length ? project.images : [];

  const next = () => setImgIndex((i) => (i + 1) % images.length);
  const prev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card bg-surface/95 max-w-3xl w-full max-h-[88vh] overflow-y-auto"
        >
          <div className="relative">
            {images.length > 0 && (
              <div className="relative aspect-video bg-black/30">
                <img
                  src={getUploadUrl(images[imgIndex])}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white"
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white"
                    >
                      <FiChevronRight />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
            >
              <FiX />
            </button>
          </div>

          <div className="p-7">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              {project.featured && (
                <span className="badge !bg-gradient-primary !text-white !border-0">Featured</span>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed mb-5">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack?.map((tech) => (
                <span key={tech} className="badge">
                  {tech}
                </span>
              ))}
            </div>

            {project.features?.length > 0 && (
              <div className="mb-5">
                <h4 className="font-semibold text-sm text-slate-200 mb-2">Features</h4>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.challenges && (
              <div className="mb-5">
                <h4 className="font-semibold text-sm text-slate-200 mb-2">Challenges</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{project.challenges}</p>
              </div>
            )}

            {project.learnings && (
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-slate-200 mb-2">What I Learned</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{project.learnings}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5">
                  <FiGithub size={15} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5">
                  <FiExternalLink size={15} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
