import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[-14rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.24),transparent_65%)] blur-3xl"
        animate={{ x: [0, 40, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-12rem] top-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2),transparent_65%)] blur-3xl"
        animate={{ x: [0, -30, 20, 0], y: [0, 24, -12, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-10rem] top-64 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_65%)] blur-3xl"
        animate={{ x: [0, 24, -16, 0], y: [0, -16, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* fine grain / grid so the aurora reads as atmosphere, not a blob */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#070A13_92%)]" />
    </div>
  );
}

function FloatingDashboard() {
  // Cursor/Vercel-style subtle pointer-parallax tilt on the whole card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 120,
    damping: 16,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 120,
    damping: 16,
  });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative [perspective:1400px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <DashboardPreview />
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 pt-40 pb-28 lg:px-12">
      <AuroraBackground />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
        {/* Left column */}
        <div>
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-[#94A3B8] backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl"
          >
            Review Python Code{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent [background-size:200%_auto] animate-[gradientShift_6s_ease_infinite]">
                with AI.
              </span>
            </span>
            <br />
            Build Better Software Faster.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg leading-relaxed text-[#94A3B8]"
          >
            Analyze Python code using static analysis, security scanning and
            Google Gemini AI — catch bugs, vulnerabilities and complexity
            issues before they ship.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_8px_24px_-6px_rgba(59,130,246,0.55)] transition-shadow hover:shadow-[0_0_0_1px_rgba(59,130,246,0.6),0_12px_32px_-4px_rgba(59,130,246,0.7)]"
            >
              Start Reviewing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>

            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-[#F8FAFC] backdrop-blur-md transition-colors hover:bg-white/[0.06]"
            >
              <Code2 className="h-4 w-4" />
              View GitHub
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-12 flex items-center gap-6 text-xs text-[#94A3B8]"
          >
            <span>No credit card required</span>
            <span className="h-1 w-1 rounded-full bg-[#94A3B8]/40" />
            <span>Open source friendly</span>
          </motion.div>
        </div>

        {/* Right column */}
        <FloatingDashboard />
      </div>
    </section>
  );
}