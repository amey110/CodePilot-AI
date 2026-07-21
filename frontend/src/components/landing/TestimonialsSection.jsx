import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "CodePilot caught a SQL injection risk in a pull request our team had already approved. It's now a required check before merge.",
    name: "Maya Reyes",
    role: "Backend Lead, Fintech Startup",
  },
  {
    quote:
      "The complexity scores gave us a real number to point to when arguing for refactoring time — not just a gut feeling.",
    name: "Daniel Okafor",
    role: "Staff Engineer",
  },
  {
    quote:
      "It reviews faster than our slowest reviewer and explains its reasoning better than our fastest one.",
    name: "Priya Nandakumar",
    role: "Engineering Manager",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Trusted by developers who ship
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <Quote className="mb-4 h-5 w-5 text-[#6366F1]" />
              <blockquote className="text-sm leading-relaxed text-[#F8FAFC]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-white/5 pt-4">
                <p className="text-sm font-semibold text-[#F8FAFC]">{t.name}</p>
                <p className="text-xs text-[#94A3B8]">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
