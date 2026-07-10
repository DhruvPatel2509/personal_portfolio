import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSend, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { messagesAPI } from '../../api/services';

const initialForm = { name: '', email: '', subject: '', message: '' };

const Contact = ({ about }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await messagesAPI.send(form);
      toast.success("Message sent! I'll get back to you soon.");
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-container">
      <SectionHeading eyebrow="Let's talk" title="Get In Touch" subtitle="Have a project in mind or just want to say hi? Drop a message." />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          {about?.email && (
            <div className="glass-card-hover p-5 flex items-center gap-4">
              <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-primary-400">
                <FiMail />
              </span>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm">{about.email}</p>
              </div>
            </div>
          )}
          {about?.phone && (
            <div className="glass-card-hover p-5 flex items-center gap-4">
              <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-primary-400">
                <FiPhone />
              </span>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm">{about.phone}</p>
              </div>
            </div>
          )}
          {about?.location && (
            <div className="glass-card-hover p-5 flex items-center gap-4">
              <span className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-primary-400">
                <FiMapPin />
              </span>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm">{about.location}</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="lg:col-span-3 glass-card p-7 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="input-field"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="input-field"
            />
          </div>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="input-field"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="input-field resize-none"
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
            <FiSend size={15} /> {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
