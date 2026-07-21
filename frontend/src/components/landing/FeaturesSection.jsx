import { motion } from "framer-motion";
import { Bot, ShieldCheck, BarChart3, Zap, FileDown, History } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Code Review",
    description:
      "Google Gemini reads your code like a senior engineer — flagging logic issues, edge cases and style drift with plain-English explanations.",
  },
  {
    icon: ShieldCheck,
    title: "Security Analysis",
    description:
      "Bandit-powered scanning surfaces injection risks, hardcoded secrets and unsafe deserialization before they reach production.",
  },
  {
    icon: BarChart3,
    title: "Complexity Analysis",
    description:
      "Radon metrics visualize cyclomatic complexity and maintainability, so you know exactly which functions need refactoring.",
  },
  {
    icon: Zap,
    title: "Static Analysis",
    description:
      "Pylint and Flake8 run on every submission, catching unused imports, style violations and type mismatches instantly.",
  },
  {
    icon: FileDown,
    title: "Download Reports",
    description:
      "Export polished PDF and Markdown reports for code reviews, audits or handing off to your team.",
  },
  {
    icon: History,
    title: "Review History",
    description:
      "Track score trends over time across every commit, so quality improvements are visible, not just felt.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Everything a code review needs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#94A3B8]">
            Six focused tools, one pipeline — from the first static pass to
            the final AI-written recommendation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl p-[1px] transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.05) 60%)",
              }}
            >
              <div className="relative h-full rounded-2xl bg-[#111827] p-6 transition-colors duration-300 group-hover:bg-[#131c2e]">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/15 to-[#8B5CF6]/15 ring-1 ring-white/5">
                  <f.icon className="h-5 w-5 text-[#3B82F6] transition-colors group-hover:text-[#8B5CF6]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-[#F8FAFC]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#94A3B8]">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
