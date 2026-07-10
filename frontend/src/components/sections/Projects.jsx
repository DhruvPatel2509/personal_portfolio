import { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import Skeleton from "../ui/Skeleton";
import ProjectCard from "../project/ProjectCard";
import ProjectModal from "../project/ProjectModal";
import { projectsAPI } from "../../api/services";
import { useDebounce } from "../../hooks/useDebounce";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");
  const [selected, setSelected] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await projectsAPI.getAll({
          search: debouncedSearch || undefined,
          tech: tech || undefined,
          limit: 50,
        });
        if (!cancelled) setProjects(data.data);
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, tech]);

  const allTechs = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.techStack?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const shouldRenderProjects = loading || projects.length > 0 || search || tech;
  if (!shouldRenderProjects) return null;

  return (
    <section id="projects" className="section-container">
      <SectionHeading
        eyebrow="My work"
        title="Featured Projects"
        subtitle="A selection of projects showcasing my full-stack development skills."
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input-field !pl-11"
          />
        </div>
        <select
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="">All technologies</option>
          {allTechs.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-center text-slate-500 text-sm">
          No projects match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project._id}
              project={project}
              index={i}
              onOpen={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default Projects;
