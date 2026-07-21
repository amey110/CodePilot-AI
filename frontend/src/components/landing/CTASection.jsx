import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="get-started" className="relative px-6 py-24 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 px-8 py-16 text-center sm:px-16"
      >
        <div className="absolute inset-0 -z-10 bg-[#111827]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.25),transparent_55%)]" />

        <h2 className="text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Ready to build better software?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-[#94A3B8]">
          Start reviewing your first repository in under two minutes. No
          setup, no config files.
        </p>

        <motion.a
          href="#"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_8px_24px_-6px_rgba(59,130,246,0.6)]"
        >
          Start Reviewing
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
