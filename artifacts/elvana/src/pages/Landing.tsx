import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { Loader2, ArrowRight, Play, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";
import { Marquee, ParallaxMarquee } from "@/components/Marquee";
import { useJoinWaitlist } from "@workspace/api-client-react";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type WaitlistFormValues = z.infer<typeof waitlistSchema>;

function MagneticButton({ children, className, onClick, ...props }: React.ComponentProps<"button"> & { onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

export default function Landing() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; position: number } | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroSubY = useTransform(heroScrollProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: "" },
  });
  const joinWaitlistMutation = useJoinWaitlist();

  const onSubmit = async (data: WaitlistFormValues) => {
    joinWaitlistMutation.mutate(
      { data: { email: data.email } },
      {
        onSuccess: (response) => {
          setSuccessData({ message: response.message, position: response.position });
          form.reset();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.error || "Failed to join waitlist. Please try again.";
          form.setError("email", { message: errorMessage });
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen bg-background cursor-none">

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-20 overflow-hidden">
        {/* Ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#DED4E6]/3 blur-[120px]" />
        </div>

        {/* Nav */}
        <nav className="absolute top-0 w-full px-6 md:px-12 py-8 flex justify-between items-center z-50">
          <motion.div
            className="font-serif text-xl tracking-widest text-primary uppercase"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Elvana
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 cursor-none"
            >
              Join Waitlist
            </MagneticButton>
          </motion.div>
        </nav>

        {/* Hero text parallax */}
        <div className="max-w-5xl mx-auto w-full">
          <motion.div style={{ y: heroTextY, opacity: heroOpacity, scale: heroScale }}>
            <Reveal>
              <p className="font-sans text-accent tracking-[0.25em] uppercase text-xs mb-10">
                Comfort wins now, Regret pays later.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-[88px] leading-[1.05] text-balance mb-10 text-primary">
                People don't fail because they lack{" "}
                <em className="not-italic text-muted-foreground italic">Goals</em>{" "}
                or{" "}
                <em className="not-italic text-muted-foreground italic">Knowledge</em>.
              </h1>
            </Reveal>
          </motion.div>

          <motion.div style={{ y: heroSubY, opacity: heroOpacity }}>
            <Reveal delay={0.3}>
              <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-14">
                They fail because, in the moment, their brain chooses comfort — and guilt comes later.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-5">
                <MagneticButton
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center gap-3 group font-sans text-[11px] tracking-[0.25em] uppercase px-9 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 cursor-none"
                >
                  Get Early Access
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </MagneticButton>
                <MagneticButton
                  onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center justify-center gap-3 group font-sans text-[11px] tracking-[0.25em] uppercase px-9 py-4 border border-border/30 text-muted-foreground hover:text-primary hover:border-border/60 transition-all duration-300 cursor-none"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Watch Video
                </MagneticButton>
              </div>
            </Reveal>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          style={{ opacity: useTransform(heroScrollProgress, [0, 0.3], [1, 0]) }}
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Scroll</span>
          <motion.div
            className="w-[1px] h-10 bg-gradient-to-b from-muted-foreground/40 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* MARQUEE STRIP */}
      <Marquee />

      {/* PROBLEM CYCLE */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">The Everyday Cycle</h2>
            <p className="font-sans text-muted-foreground text-sm tracking-widest uppercase mb-20 border-b border-border/10 pb-6">
              The pattern that repeats until you break it
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/10">
            {[
              { num: "01", title: "The Urge", desc: "A notification. A stressful moment. Boredom. The trigger is always there." },
              { num: "02", title: "The Action", desc: "Scrolling, eating what you promised you wouldn't, skipping the workout, overspending." },
              { num: "03", title: "The Guilt", desc: "The immediate regret. The slow erosion of self-trust. Repeat tomorrow." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <motion.div
                  className="bg-background p-10 group relative overflow-hidden"
                  whileHover={{ backgroundColor: "rgba(222,212,230,0.03)" }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  <span className="font-sans text-[11px] tracking-[0.3em] text-muted-foreground/40 block mb-8">{item.num}</span>
                  <h3 className="font-serif text-2xl mb-4 text-primary group-hover:text-accent transition-colors duration-500">{item.title}</h3>
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX MARQUEE STRIP */}
      <ParallaxMarquee />

      {/* WHY SOLUTIONS FAIL */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 block mb-6">The problem</span>
                <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">Why what you've tried doesn't work.</h2>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  The world is full of advice, blockers, and schedules. None of them understand human behavior in the critical moment of decision.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8 space-y-px">
              {[
                {
                  title: "YouTube & Books",
                  detail: "Work only when you're motivated, calm, and already trying to change. But when the urge hits at 3 AM — you don't remember a single line. Impulse takes over.",
                },
                {
                  title: "App Blockers",
                  detail: "They fight human behavior instead of working with it. The moment restriction feels forced, your brain looks for a way out — and always finds one.",
                },
                {
                  title: "Life Coaches",
                  detail: "They listen, adapt, and give personal guidance. But they run on schedules, not impulses. When the urge shows up, the right help isn't there.",
                },
              ].map((block, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <motion.div
                    className="group border-b border-border/10 py-10 flex gap-8 items-start"
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <span className="font-sans text-[11px] tracking-[0.3em] text-muted-foreground/30 shrink-0 mt-1">0{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-xl mb-3 text-primary group-hover:text-accent transition-colors duration-400">{block.title}</h3>
                      <p className="font-sans text-muted-foreground text-sm leading-relaxed">{block.detail}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE INSIGHT — full bleed quote */}
      <section className="py-40 px-6 md:px-12 lg:px-24 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_#DED4E6_0%,_transparent_70%)]" />
        </div>
        <div className="max-w-4xl mx-auto relative text-center">
          <Reveal>
            <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary-foreground/40 block mb-10">The insight</span>
            <blockquote className="font-serif text-3xl md:text-5xl lg:text-[56px] leading-[1.2] text-balance">
              Intervention beats willpower.{" "}
              <span className="italic opacity-60">The right advice at the wrong time doesn't work. The right help at the right moment does.</span>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* HOW ELVANA WORKS */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 block mb-6">The solution</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-20">How Elvana works.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            {[
              { title: "Context Aware", desc: "Understands when, where, and which apps pull you in based on your actual behavior patterns." },
              { title: "Perfect Timing", desc: "Steps in exactly when a distracting urge appears — not after, not before." },
              { title: "Behavior-Based Alerts", desc: "Notifications triggered by your patterns, not generic daily reminders nobody reads." },
              { title: "Actionable Guidance", desc: "Suggests the right next action for that exact time, context, and emotional state." },
              { title: "Conversational", desc: "Chat, share your schedule, and watch it adapt deeply to how you actually live your life." },
              { title: "Growth Oriented", desc: "Helps you understand why you slipped — so it can help prevent it from happening next time." },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  className="group flex gap-6 items-start"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/20 shrink-0"
                    whileHover={{ scale: 2 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <div>
                    <h3 className="font-serif text-xl mb-3 text-primary group-hover:text-accent transition-colors duration-400">{feature.title}</h3>
                    <p className="font-sans text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE — reversed */}
      <Marquee direction="right" speed={80} />

      {/* WAITLIST */}
      <section id="waitlist" className="py-40 px-6 md:px-12 lg:px-24 bg-black/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#DED4E6]/4 blur-[150px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 block mb-8">Early access</span>
            <h2 className="font-serif text-4xl md:text-6xl mb-6">The right help, right when you need it.</h2>
            <p className="font-sans text-lg text-muted-foreground mb-16 max-w-lg mx-auto leading-relaxed">
              Get early access to Elvana by joining the waitlist.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="max-w-sm mx-auto">
              <AnimatePresence mode="wait">
                {!successData ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2 text-left">
                      <Input
                        placeholder="your@email.com"
                        {...form.register("email")}
                        className={`text-base cursor-none ${form.formState.errors.email ? "border-destructive" : ""}`}
                        disabled={joinWaitlistMutation.isPending}
                      />
                      <AnimatePresence>
                        {form.formState.errors.email && (
                          <motion.span
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-destructive font-sans tracking-wide"
                          >
                            {form.formState.errors.email.message}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={joinWaitlistMutation.isPending}
                      className="w-full inline-flex items-center justify-center gap-3 group font-sans text-[11px] tracking-[0.25em] uppercase px-9 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 cursor-none"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {joinWaitlistMutation.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          Request Access
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-accent/20 bg-accent/5 p-10 flex flex-col items-center gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-accent" />
                    </motion.div>
                    <p className="font-serif text-xl text-primary">{successData.message}</p>
                    <p className="font-sans text-sm text-muted-foreground">
                      You are <span className="text-accent">#{successData.position}</span> on the list.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-serif text-lg tracking-widest text-muted-foreground/60 uppercase">Elvana</div>
        <div className="flex gap-10 text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground/50">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300 cursor-none"
            whileHover={{ y: -2 }}
          >
            Instagram
          </motion.a>
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300 cursor-none"
            whileHover={{ y: -2 }}
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="mailto:hello@elvana.in"
            className="hover:text-primary transition-colors duration-300 cursor-none"
            whileHover={{ y: -2 }}
          >
            Email
          </motion.a>
        </div>
        <div className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground/30 uppercase">elvana.in</div>
      </footer>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-background/97 backdrop-blur-md flex items-center justify-center p-4 md:p-16 cursor-none"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.button
              className="absolute top-8 right-8 text-muted-foreground hover:text-primary transition-colors cursor-none"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl aspect-video bg-black border border-border/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/4_M5WuR8fkA?autoplay=1"
                title="Elvana Explainer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
