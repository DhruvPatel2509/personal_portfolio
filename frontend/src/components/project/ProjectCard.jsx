import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiEye } from 'react-icons/fi';
import { getUploadUrl } from '../../api/axios';

const ProjectCard = ({ project, index, onOpen }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
    className="glass-card-hover overflow-hidden group flex flex-col"
  >
    <div className="relative aspect-video overflow-hidden bg-black/30">
      {project.images?.[0] ? (
        <img
          src={getUploadUrl(project.images[0])}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl font-bold gradient-text opacity-40">
          {project.title?.slice(0, 2).toUpperCase()}
        </div>
      )}
      {project.featured && (
        <span className="absolute top-3 left-3 badge !bg-gradient-primary !text-white !border-0 text-[10px]">
          Featured
        </span>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
        <button
          onClick={() => onOpen(project)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-primary-500"
          aria-label="View details"
        >
          <FiEye size={16} />
        </button>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-primary-500"
          >
            <FiGithub size={16} />
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-primary-500"
          >
            <FiExternalLink size={16} />
          </a>
        )}
      </div>
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.techStack?.slice(0, 4).map((tech) => (
          <span key={tech} className="badge text-[11px]">
            {tech}
          </span>
        ))}
        {project.techStack?.length > 4 && (
          <span className="badge text-[11px]">+{project.techStack.length - 4}</span>
        )}
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;
