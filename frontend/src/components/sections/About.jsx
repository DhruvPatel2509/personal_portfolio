import { motion } from "framer-motion";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
} from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import { getUploadUrl } from "../../api/axios";

const socialIconMap = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  instagram: FiInstagram,
};

const socialLabelMap = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  instagram: "Instagram",
};

const getSocialUsername = (key, url) => {
  const formatFromParts = (parts) => {
    if (!parts.length) return socialLabelMap[key] || key;
    if (key === "linkedin") {
      const linkedinPrefixes = ["in", "pub", "company", "school", "groups"];
      if (linkedinPrefixes.includes(parts[0]) && parts.length > 1) {
        return parts.slice(1).join("/");
      }
    }
    return parts[parts.length - 1] || socialLabelMap[key] || key;
  };

  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return formatFromParts(parts);
  } catch {
    const cleaned = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    const parts = cleaned.split("/").filter(Boolean);
    if (key === "linkedin" && parts.length > 2) {
      return formatFromParts(parts.slice(1));
    }
    return formatFromParts(parts);
  }
};

const InfoRow = ({ icon: Icon, label, value }) =>
  value ? (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-primary-400">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  ) : null;

const About = ({ about }) => {
  const socialLinks = about?.socialLinks || {};
  const hasDetails = Boolean(
    about &&
    (about.bio ||
      about.location ||
      about.email ||
      about.phone ||
      about.resume ||
      Object.values(about.socialLinks || {}).some(Boolean)),
  );

  if (!hasDetails) return null;

  return (
    <section id="about" className="section-container">
      <SectionHeading
        eyebrow="Get to know me"
        title="About Me"
        subtitle="A quick introduction to who I am and what I do."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 flex justify-center"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl rotate-6 opacity-30 blur-xl" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card">
              {about?.profilePhoto ? (
                <img
                  src={getUploadUrl(about.profilePhoto)}
                  alt={about?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold gradient-text">
                  {(about?.name || "DP").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 glass-card p-8"
        >
          <p className="text-slate-300 leading-relaxed mb-8">
            {about?.bio ||
              "A passionate Full Stack Developer pursuing an MCA degree, focused on building performant, elegant web applications with the MERN stack."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <InfoRow icon={FiMapPin} label="Location" value={about?.location} />
            <InfoRow icon={FiMail} label="Email" value={about?.email} />
            <InfoRow icon={FiPhone} label="Phone" value={about?.phone} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {about?.resume && (
              <a
                href={getUploadUrl(about.resume)}
                download
                className="btn-primary !py-2.5"
              >
                <FiDownload size={15} /> Resume
              </a>
            )}
            <div className="flex gap-3">
              {Object.entries(socialLinks)
                .filter(([, url]) => url)
                .map(([key, url]) => {
                  const Icon = socialIconMap[key];
                  const username = getSocialUsername(key, url);
                  if (!Icon) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full glass-card-hover px-3 py-2 text-sm text-slate-300 hover:text-white"
                      aria-label={`${socialLabelMap[key] || key}: ${username}`}
                    >
                      <Icon size={16} />
                      <span>{username}</span>
                    </a>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
