import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ITEMS = [
  "INTERVENTION BEATS WILLPOWER",
  "THE RIGHT HELP AT THE RIGHT MOMENT",
  "COMFORT WINS NOW",
  "REGRET PAYS LATER",
  "ELVANA",
];

interface MarqueeProps {
  direction?: "left" | "right";
  speed?: number;
}

export function Marquee({ direction = "left", speed = 60 }: MarqueeProps) {
  const text = ITEMS.join(" · ") + " · ";
  const repeated = text.repeat(4);

  return (
    <div className="relative flex overflow-hidden border-y border-border/10 py-5 bg-black/20 select-none">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? [0, "-50%"] : ["-50%", 0],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-muted-foreground pr-0">
          {repeated}
        </span>
        <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-muted-foreground pr-0">
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}

export function ParallaxMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <div ref={ref} className="overflow-hidden py-1">
      <div className="border-y border-border/10 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap border-b border-border/10 py-4 bg-black/10"
          style={{ x: xLeft }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-sans text-[10px] tracking-[0.35em] uppercase text-muted-foreground/50 px-8">
              INTERVENTION BEATS WILLPOWER · THE RIGHT HELP AT THE RIGHT MOMENT · ELVANA ·
            </span>
          ))}
        </motion.div>
        <motion.div
          className="flex whitespace-nowrap py-4 bg-black/10"
          style={{ x: xRight }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-sans text-[10px] tracking-[0.35em] uppercase text-accent/30 px-8">
              COMFORT WINS NOW · REGRET PAYS LATER · ELVANA.IN ·
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
