import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import { getUploadUrl } from "../../api/axios";

const Achievements = ({ achievements }) => {
  if (!achievements?.length) return null;

  return (
    <section id="achievements" className="section-container">
      <SectionHeading
        eyebrow="Milestones"
        title="Achievements"
        subtitle="Recognition and milestones along the way."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(achievements || []).map((ach, i) => (
          <motion.div
            key={ach._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
            className="glass-card-hover overflow-hidden"
          >
            <div className="aspect-video bg-black/30 flex items-center justify-center overflow-hidden">
              {ach.image ? (
                <img
                  src={getUploadUrl(ach.image)}
                  alt={ach.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiStar className="text-4xl text-accent-400 opacity-50" />
              )}
            </div>
            <div className="p-5">
              <h3 className="font-semibold mb-2">{ach.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {ach.description}
              </p>
            </div>
          </motion.div>
        ))}
        {(!achievements || achievements.length === 0) && (
          <p className="col-span-full text-center text-slate-500 text-sm">
            Achievements coming soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default Achievements;
