import { motion } from "framer-motion";
import { FiBriefcase } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";

const Experience = ({ experience }) => {
  if (!experience?.length) return null;

  return (
    <section id="experience" className="section-container">
      <SectionHeading
        eyebrow="My journey"
        title="Work Experience"
        subtitle="Where I've applied and grown my skills."
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {(experience || []).map((exp, i) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card-hover p-6 flex gap-5"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FiBriefcase className="text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                <h3 className="font-semibold text-lg">{exp.role}</h3>
                <span className="badge text-[11px]">{exp.duration}</span>
              </div>
              <p className="text-primary-400 text-sm mb-2">{exp.company}</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
        {(!experience || experience.length === 0) && (
          <p className="text-center text-slate-500 text-sm">
            Experience details coming soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default Experience;
