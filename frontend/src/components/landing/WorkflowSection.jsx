import { motion } from "framer-motion";
import { UploadCloud, ScanSearch, Bot, FileCheck2 } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Code",
    description: "Drop in a file, a repo URL, or paste a snippet directly.",
  },
  {
    icon: ScanSearch,
    title: "Static Analysis",
    description: "Pylint, Flake8, Bandit and Radon run in parallel across the codebase.",
  },
  {
    icon: Bot,
    title: "Gemini AI",
    description: "Contextual reasoning layers on top to explain the 'why' behind every flag.",
  },
  {
    icon: FileCheck2,
    title: "Professional Report",
    description: "A scored, exportable report lands in your dashboard in seconds.",
  },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl">
            From code to report in four steps
          </h2>
          <p className="mt-4 text-base text-[#94A3B8]">
            A pipeline designed to be fast enough to run on every commit.
          </p>
        </motion.div>

        <div className="relative">
          {/* connecting line */}
          <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]/30 sm:left-7" />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#111827] shadow-[0_0_20px_-4px_rgba(59,130,246,0.4)] sm:h-14 sm:w-14">
                  <s.icon className="h-5 w-5 text-[#3B82F6] sm:h-6 sm:w-6" />
                </div>
                <div className="pt-1.5">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#6366F1]">
                    Step {i + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-[#F8FAFC]">
                    {s.title}
                  </h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-[#94A3B8]">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
