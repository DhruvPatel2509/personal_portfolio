import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Certifications from '../components/sections/Certifications';
import Achievements from '../components/sections/Achievements';
import CodingProfiles from '../components/sections/CodingProfiles';
import Contact from '../components/sections/Contact';
import {
  aboutAPI,
  skillsAPI,
  educationAPI,
  experienceAPI,
  certificationsAPI,
  achievementsAPI,
  codingProfilesAPI,
  settingsAPI,
} from '../api/services';

const Home = () => {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState(null);
  const [settings, setSettings] = useState(null);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    // Fire all public data requests in parallel; each section degrades
    // gracefully (shows placeholder copy) if its request fails.
    aboutAPI.get().then(({ data }) => setAbout(data.data)).catch(() => {});
    skillsAPI
      .getAll()
      .then(({ data }) => setSkills(data.data))
      .catch(() => {})
      .finally(() => setSkillsLoading(false));
    educationAPI.getAll().then(({ data }) => setEducation(data.data)).catch(() => {});
    experienceAPI.getAll().then(({ data }) => setExperience(data.data)).catch(() => {});
    certificationsAPI.getAll().then(({ data }) => setCertifications(data.data)).catch(() => {});
    achievementsAPI.getAll().then(({ data }) => setAchievements(data.data)).catch(() => {});
    codingProfilesAPI.get().then(({ data }) => setCodingProfiles(data.data)).catch(() => {});
    settingsAPI.get().then(({ data }) => setSettings(data.data)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero about={about} />
        <About about={about} />
        <Skills skills={skills} loading={skillsLoading} />
        <Projects />
        <Education education={education} />
        <Experience experience={experience} />
        <Certifications certifications={certifications} />
        <Achievements achievements={achievements} />
        <CodingProfiles profiles={codingProfiles} />
        <Contact about={about} />
      </main>
      <Footer about={about} settings={settings} />
    </>
  );
};

export default Home;
