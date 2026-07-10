import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiCode,
  FiTerminal,
  FiExternalLink,
} from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";

const PROFILE_META = {
  github: {
    label: "GitHub",
    icon: FiGithub,
    color: "from-slate-600 to-slate-800",
  },
  linkedin: {
    label: "LinkedIn",
    icon: FiLinkedin,
    color: "from-blue-600 to-blue-800",
  },
  leetcode: {
    label: "LeetCode",
    icon: FiCode,
    color: "from-amber-500 to-orange-600",
  },
  hackerrank: {
    label: "HackerRank",
    icon: FiTerminal,
    color: "from-green-500 to-emerald-700",
  },
};

const CodingProfiles = ({ profiles }) => {
  const entries = Object.entries(PROFILE_META).filter(
    ([key]) => profiles?.[key],
  );
  if (!entries.length) return null;

  return (
    <section id="coding-profiles" className="section-container">
      <SectionHeading
        eyebrow="Find me online"
        title="Coding Profiles"
        subtitle="Check out my activity and progress on these platforms."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {entries.map(([key, meta], i) => {
          const Icon = meta.icon;
          return (
            <motion.a
              key={key}
              href={profiles[key]}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card-hover p-6 flex flex-col items-center text-center gap-3"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}
              >
                <Icon className="text-white" size={22} />
              </div>
              <p className="font-medium">{meta.label}</p>
              <span className="inline-flex items-center gap-1 text-xs text-primary-400">
                Visit Profile <FiExternalLink size={11} />
              </span>
            </motion.a>
          );
        })}
        {entries.length === 0 && (
          <p className="col-span-full text-center text-slate-500 text-sm">
            Coding profile links coming soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default CodingProfiles;
