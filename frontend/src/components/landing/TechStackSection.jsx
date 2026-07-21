import { motion } from "framer-motion";

const stack = [
  "React",
  "FastAPI",
  "Python",
  "Gemini AI",
  "PostgreSQL",
  "Docker",
  "JWT",
  "Pylint",
  "Bandit",
  "Flake8",
  "Radon",
];

export default function TechStackSection() {
  return (
    <section className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-[#94A3B8]"
        >
          Built on a modern, production-grade stack
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {stack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -3, borderColor: "rgba(99,102,241,0.5)" }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#F8FAFC] backdrop-blur-sm transition-colors"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
