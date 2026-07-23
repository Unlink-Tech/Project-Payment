"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Button } from "@/components/ui/Button";
import { RevealWords, Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { stats } from "@/lib/site";

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-tracked gradient position.
  const px = useMotionValue(50);
  const py = useMotionValue(28);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  const glow = useMotionTemplate`
    radial-gradient(48rem 34rem at ${sx}% ${sy}%, var(--glow-1), transparent 62%),
    radial-gradient(40rem 30rem at ${useMotionTemplate`calc(100% - ${sx}%)`} 62%, var(--glow-2), transparent 60%)
  `;

  // Parallax drift of the whole glow layer on scroll.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 100);
      py.set((e.clientY / window.innerHeight) * 60);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-[clamp(var(--spacing-12),14vw,var(--spacing-13))] pb-[var(--spacing-12)]"
    >
      {/* Ambient gradient + blueprint grid. Both sit behind content: a blurred
          layer is composited and would otherwise paint over the copy. */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { background: glow, y: glowY }}
        className="pointer-events-none absolute inset-0 -top-40 -z-10 blur-[40px] opacity-90"
      />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      <motion.div
        className="container-site relative z-10"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <Reveal as="p" className="tag tag-accent" y={10}>
          Payments &amp; e-commerce advisory, est. 2021
        </Reveal>

        <RevealWords
          as="h1"
          id="hero-title"
          text="Clarity drives growth."
          className="t-display mt-[var(--spacing-8)] text-fg-strong"
          delay={0.1}
        />

        <Reveal delay={0.35} className="mt-[var(--spacing-8)]">
          <p className="t-lead">
            We partner with organisations to navigate the complexity of digital commerce through
            strategic technology and payment infrastructure that is independent, vendor-neutral, and
            built to hold under growth.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-[var(--spacing-10)] flex flex-wrap items-center gap-[var(--spacing-6)]">
          <Button href="/contact" size="lg">
            Start a conversation
          </Button>
          <Button href="/services" size="lg" variant="secondary">
            Explore services
          </Button>
        </Reveal>

        <Reveal
          delay={0.55}
          className="mt-[var(--spacing-12)] grid grid-cols-2 gap-[var(--spacing-8)] border-t
                     border-line pt-[var(--spacing-9)] lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="grid gap-[var(--spacing-1)]">
              <span className="text-2xl font-bold tracking-[-0.03em] text-fg-strong tabular-nums">
                <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </span>
              <span className="text-sm text-fg-muted">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </motion.div>
    </section>
  );
}
