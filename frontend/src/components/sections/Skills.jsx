import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import Skeleton from "../ui/Skeleton";

const CATEGORIES = [
  "Programming",
  "Frontend",
  "Backend",
  "Database",
  "Tools",
  "Currently Learning",
];

const SkillCard = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="glass-card-hover px-4 py-3"
  >
    <span className="text-sm font-medium text-slate-200">{skill.name}</span>
  </motion.div>
);

const Skills = ({ skills, loading }) => {
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: (skills || []).filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  if (!loading && grouped.length === 0) return null;

  return (
    <section id="skills" className="section-container">
      <SectionHeading
        eyebrow="What I work with"
        title="Skills & Technologies"
        subtitle="Tools and technologies I use to bring ideas to life."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.category}>
              <h3 className="text-base font-semibold mb-3 text-slate-200">
                {group.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {group.items.map((skill, i) => (
                  <SkillCard key={skill._id} skill={skill} index={i} />
                ))}
              </div>
            </div>
          ))}
          {grouped.length === 0 && (
            <p className="text-center text-slate-500 text-sm">
              Skills coming soon.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default Skills;
