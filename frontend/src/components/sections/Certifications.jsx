import { motion } from "framer-motion";
import { FiExternalLink, FiAward } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import { getUploadUrl } from "../../api/axios";

const formatIssuedDate = (d) =>
  d
    ? `Issued ${new Date(d).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`
    : "";

const Certifications = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <section id="certifications" className="section-container">
      <SectionHeading
        eyebrow="Verified skills"
        title="Certifications"
        subtitle="Courses and certifications I've completed."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {(certifications || []).map((cert, i) => (
          <motion.div
            key={cert._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
            className="glass-card-hover p-5"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-36 md:w-44 aspect-[4/3] shrink-0 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                {cert.image ? (
                  <img
                    src={getUploadUrl(cert.image)}
                    alt={cert.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiAward className="text-2xl text-primary-300" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg leading-snug">{cert.name}</h3>
                <p className="text-slate-300 text-sm mt-1">{cert.organization}</p>
                <p className="text-slate-500 text-sm mt-1">{formatIssuedDate(cert.issueDate)}</p>
                {cert.credentialId && (
                  <p className="text-slate-500 text-sm mt-1">Credential ID {cert.credentialId}</p>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white hover:border-primary-300 hover:text-primary-200 transition-colors"
                >
                  Show credential <FiExternalLink size={15} />
                </a>
              )}

              {cert.skills?.length > 0 && (
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Skills:</span> {cert.skills.join(", ")}
                </p>
              )}

              {cert.description && (
                <p className="text-slate-300 text-sm leading-relaxed">
                  {cert.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        {(!certifications || certifications.length === 0) && (
          <p className="col-span-full text-center text-slate-500 text-sm">
            Certifications coming soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default Certifications;
