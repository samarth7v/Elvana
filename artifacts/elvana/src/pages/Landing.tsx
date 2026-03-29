import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Play, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";
import { useJoinWaitlist } from "@workspace/api-client-react";

// Form Schema
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export default function Landing() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; position: number } | null>(null);

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
          setSuccessData({
            message: response.message,
            position: response.position,
          });
          form.reset();
        },
        onError: (error: any) => {
          // Attempt to extract the error message from the response
          const errorMessage = error?.response?.data?.error || "Failed to join waitlist. Please try again.";
          form.setError("email", { message: errorMessage });
        }
      }
    );
  };

  return (
    <div className="relative min-h-screen bg-background bg-grain selection:bg-accent/20">
      
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-texture.png`} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="absolute top-0 w-full p-6 md:p-12 flex justify-between items-center z-50 mix-blend-difference">
          <div className="font-serif text-2xl font-semibold tracking-wider text-primary">ELVANA</div>
          <Button variant="ghost" onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}>
            Join Waitlist
          </Button>
        </nav>

        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
          <div className="max-w-5xl mx-auto w-full">
            <Reveal>
              <p className="font-sans text-accent tracking-[0.2em] uppercase text-sm md:text-base mb-8 md:mb-12">
                Comfort wins now, Regret pays later.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.1] text-balance mb-12 text-primary">
                People don't fail because they lack <span className="italic text-muted-foreground">Goals</span> or <span className="italic text-muted-foreground">Knowledge</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-16">
                They fail because, in the moment, their brain chooses comfort and guilt comes later.
              </p>
            </Reveal>
            <Reveal delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Early Access
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-3 group border-border/30 hover:border-accent"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <Play className="w-4 h-4 fill-current group-hover:text-accent transition-colors" />
                  Watch Explainer
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROBLEM CYCLE SECTION */}
        <section className="py-32 px-6 md:px-12 lg:px-24 border-t border-border/10 bg-black/20">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <h2 className="font-serif text-4xl md:text-6xl mb-24 text-center">The Everyday Cycle</h2>
            </Reveal>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-border/30 -z-10" />
              
              {[
                { step: "01", title: "The Urge", desc: "A notification, a stressful moment, or sheer boredom." },
                { step: "02", title: "The Action", desc: "Scrolling, eating, skipping the workout, overspending." },
                { step: "03", title: "The Guilt", desc: "The immediate regret that slowly kills your self-trust." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.2} className="flex-1 w-full text-center">
                  <div className="bg-background border border-border/20 p-10 flex flex-col items-center gap-6 shadow-2xl relative group hover:border-accent/30 transition-colors duration-500">
                    <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center font-sans text-muted-foreground group-hover:text-accent transition-colors">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl mb-4 text-primary">{item.title}</h3>
                      <p className="text-muted-foreground font-sans leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CURRENT SOLUTIONS FAIL */}
        <section className="py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4 flex flex-col justify-center">
                <Reveal>
                  <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">Why Current Solutions Fail.</h2>
                  <p className="text-muted-foreground font-sans leading-relaxed">
                    The world is full of advice, blockers, and schedules. None of them understand human behavior in the critical moment of decision.
                  </p>
                </Reveal>
              </div>
              
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { 
                    title: "YouTube & Books", 
                    desc: "They work when you're motivated. But they are completely silent when the urge hits you at 3 AM."
                  },
                  { 
                    title: "App Blockers", 
                    desc: "They fight human behavior with friction. You just end up disabling them or finding workarounds."
                  },
                  { 
                    title: "Life Coaches", 
                    desc: "They run on weekly schedules and calendar invites. They don't run on your sudden impulses."
                  }
                ].map((block, i) => (
                  <Reveal key={i} delay={i * 0.15}>
                    <div className="p-8 border border-border/20 h-full flex flex-col justify-center hover:bg-white/[0.02] transition-colors duration-500">
                      <h3 className="font-serif text-xl mb-4 text-accent">{block.title}</h3>
                      <p className="text-muted-foreground font-sans leading-relaxed text-sm">{block.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* THE INSIGHT */}
        <section className="py-32 px-6 md:px-12 lg:px-24 bg-primary text-primary-foreground text-center">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.2] text-balance">
                "Intervention beats willpower. The right advice at the wrong time doesn't work. <span className="italic opacity-70">The right help at the right moment does.</span>"
              </h2>
            </Reveal>
          </div>
        </section>

        {/* HOW ELVANA WORKS */}
        <section className="py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <h2 className="font-serif text-4xl md:text-5xl mb-16 md:mb-24 text-center">How Elvana Works</h2>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 md:gap-y-24">
              {[
                { title: "Context Aware", desc: "Understands when, where and which apps pull you in." },
                { title: "Perfect Timing", desc: "Steps in exactly when a distracting urge appears, not before or after." },
                { title: "Personalized", desc: "Notifications based on your actual behavior, not generic reminders." },
                { title: "Actionable", desc: "Suggests the right next action for that specific time and situation." },
                { title: "Conversational", desc: "Chat, share your schedules, and watch it adapt to your life over time." },
                { title: "Growth Oriented", desc: "Helps you learn why you slipped to prevent it from happening next time." }
              ].map((feature, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex gap-6 items-start group">
                    <div className="mt-1 w-2 h-2 rounded-full bg-accent/30 group-hover:bg-accent transition-colors duration-300 shrink-0" />
                    <div>
                      <h3 className="font-serif text-2xl mb-3 text-primary">{feature.title}</h3>
                      <p className="font-sans text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WAITLIST SECTION */}
        <section id="waitlist" className="py-32 px-6 md:px-12 lg:px-24 border-t border-border/10 bg-black/40">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="font-serif text-4xl md:text-6xl mb-6">The right help, right when you need it.</h2>
              <p className="font-sans text-xl text-muted-foreground mb-16">
                Get early access to Elvana by joining the waitlist.
              </p>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  {!successData ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={form.handleSubmit(onSubmit)} 
                      className="flex flex-col gap-6"
                    >
                      <div className="flex flex-col gap-2 text-left">
                        <Input 
                          placeholder="Enter your email address" 
                          {...form.register("email")}
                          className={`text-lg py-6 ${form.formState.errors.email ? 'border-destructive' : ''}`}
                          disabled={joinWaitlistMutation.isPending}
                        />
                        {form.formState.errors.email && (
                          <span className="text-sm text-destructive font-sans">
                            {form.formState.errors.email.message}
                          </span>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full justify-between group"
                        disabled={joinWaitlistMutation.isPending}
                      >
                        {joinWaitlistMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing
                          </span>
                        ) : (
                          <>
                            <span>Request Access</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-accent/5 border border-accent/20 p-8 flex flex-col items-center gap-4"
                    >
                      <CheckCircle2 className="w-12 h-12 text-accent mb-2" />
                      <h3 className="font-serif text-2xl text-primary">{successData.message}</h3>
                      <p className="font-sans text-muted-foreground">
                        You are number <span className="text-accent font-medium">#{successData.position}</span> on the waitlist. We'll be in touch soon.
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
          <div className="font-serif text-xl tracking-wider text-muted-foreground">ELVANA</div>
          <div className="flex gap-8 text-sm font-sans uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="mailto:hello@elvana.in" className="hover:text-primary transition-colors">Email</a>
          </div>
        </footer>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-6 right-6 text-muted-foreground hover:text-primary"
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl aspect-video bg-black border border-border/30 shadow-2xl relative"
            >
              {/* YouTube Embed */}
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/4_M5WuR8fkA?autoplay=1" 
                title="Elvana Explainer" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
