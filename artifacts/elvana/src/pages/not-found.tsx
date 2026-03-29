import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 bg-grain">
      <h1 className="font-serif text-8xl md:text-[12rem] text-primary/10 tracking-tighter select-none">
        404
      </h1>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h2 className="font-serif text-3xl md:text-5xl mb-6 text-primary">Lost in the void.</h2>
        <p className="font-sans text-muted-foreground mb-12 max-w-md">
          The page you are looking for has drifted out of reach. Let's get you back on track.
        </p>
        <Link href="/" className="inline-block">
          <Button variant="outline" size="lg" className="border-border/30">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
