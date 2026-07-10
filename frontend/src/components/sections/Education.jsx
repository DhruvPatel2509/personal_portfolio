import { motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";

const Education = ({ education }) => {
  if (!education?.length) return null;

  return (
    <section id="education" className="section-container">
      <SectionHeading
        eyebrow="My background"
        title="Education"
        subtitle="My academic journey so far."
      />

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-500 to-transparent sm:-translate-x-1/2" />

        <div className="space-y-10">
          {(education || []).map((edu, i) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col sm:flex-row items-start gap-5 pl-14 sm:pl-0 ${
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              <div className="absolute left-5 sm:left-1/2 top-1 w-4 h-4 rounded-full bg-gradient-primary sm:-translate-x-1/2 ring-4 ring-background" />

              <div
                className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:pl-10"}`}
              >
                <div className="glass-card-hover p-6 inline-block w-full text-left">
                  <div className="flex items-center gap-2 text-primary-400 text-xs font-medium mb-2">
                    <FiBookOpen /> {edu.duration}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{edu.degree}</h3>
                  <p className="text-slate-300 text-sm">{edu.college}</p>
                  {edu.university && (
                    <p className="text-slate-500 text-xs mt-1">
                      {edu.university}
                    </p>
                  )}
                  {edu.grade && (
                    <p className="text-primary-400 text-xs mt-2">
                      Grade: {edu.grade}
                    </p>
                  )}
                </div>
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </motion.div>
          ))}
          {(!education || education.length === 0) && (
            <p className="text-center text-slate-500 text-sm">
              Education details coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;
