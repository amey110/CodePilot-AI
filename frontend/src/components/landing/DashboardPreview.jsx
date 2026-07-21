import { motion } from "framer-motion";
import {
  ShieldCheck,
  Gauge,
  GitBranch,
  Bot,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const metrics = [
  { label: "Quality", value: 96, icon: Gauge, color: "#3B82F6" },
  { label: "Security", value: 92, icon: ShieldCheck, color: "#22C55E" },
  { label: "Complexity", value: 88, icon: GitBranch, color: "#8B5CF6" },
];

const suggestions = [
  "Extract nested loop into helper function",
  "Add input validation on `parse_config()`",
  "Replace bare `except:` with explicit type",
];

export default function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-md sm:max-w-lg">
      {/* ambient glow behind everything */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[#3B82F6]/25 via-[#6366F1]/10 to-[#8B5CF6]/25 blur-3xl" />

      {/* floating micro-card: live status */}
      <motion.div
        initial={{ opacity: 0, y: -10, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute -left-6 -top-5 z-20 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#111827]/80 px-3.5 py-2 text-xs font-medium text-[#F8FAFC] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:flex"
        style={{ transform: "translateZ(40px)" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
        </span>
        Live review in progress
      </motion.div>

      {/* floating micro-card: security passed */}
      <motion.div
        initial={{ opacity: 0, y: 10, x: 10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="absolute -bottom-6 -right-4 z-20 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#111827]/80 px-3.5 py-2.5 text-xs font-medium text-[#F8FAFC] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:flex"
        style={{ transform: "translateZ(40px)" }}
      >
        <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" />
        0 critical vulnerabilities
      </motion.div>

      {/* main glass card */}
      <div
        className="relative rounded-2xl border border-white/10 bg-[#111827]/60 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-6"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* subtle top sheen for glass effect */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* window chrome */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F8FAFC]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F8FAFC]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F8FAFC]/15" />
          </div>
          <span className="text-[11px] font-medium text-[#94A3B8]">
            review_report.py
          </span>
        </div>

        {/* Overall score */}
        <div className="mb-6 flex items-center gap-5 rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#1E293B" strokeWidth="8" />
              <motion.circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                whileInView={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - 0.94) }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-lg font-bold text-[#F8FAFC]">9.4</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F8FAFC]">Overall Score</p>
            <p className="text-xs text-[#94A3B8]">9.4 / 10 — Excellent</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-6 space-y-4">
          {metrics.map((m, i) => (
            <div key={m.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
                  <m.icon className="h-3.5 w-3.5" style={{ color: m.color }} />
                  {m.label}
                </span>
                <span className="text-[#94A3B8]">{m.value}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: m.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.15 * i, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC]">
            <Bot className="h-3.5 w-3.5 text-[#6366F1]" />
            AI Suggestions
            <Sparkles className="ml-auto h-3.5 w-3.5 text-[#8B5CF6]" />
          </div>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="flex items-start gap-2 text-[11.5px] leading-snug text-[#94A3B8]"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                {s}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
