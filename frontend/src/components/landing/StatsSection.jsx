import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 100, suffix: "K+", label: "Lines Reviewed" },
  { value: 98, suffix: "%", label: "Detection Accuracy" },
  { value: 10, suffix: "×", label: "Faster Reviews" },
  { value: 24, suffix: "/7", label: "AI Assistance" },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1.6, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toString();
    });
  }, [spring]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative border-y border-white/5 px-6 py-20 lg:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="bg-gradient-to-b from-[#F8FAFC] to-[#94A3B8] bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-[#94A3B8]">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
