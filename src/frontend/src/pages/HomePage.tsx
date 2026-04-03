import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Trophy, Users, Zap } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CATEGORIES = [
  { name: "Yoga", icon: "🧘", color: "from-violet-400 to-indigo-500" },
  { name: "HIIT", icon: "⚡", color: "from-orange-400 to-red-500" },
  { name: "Strength", icon: "🏋️", color: "from-zinc-600 to-slate-700" },
  { name: "Pilates", icon: "🤸", color: "from-pink-400 to-rose-500" },
  { name: "Cardio", icon: "🏃", color: "from-cyan-400 to-blue-500" },
  { name: "Meditation", icon: "🌿", color: "from-teal-400 to-emerald-500" },
];

interface Props {
  navigate: (p: Page) => void;
}

export default function HomePage({ navigate }: Props) {
  const { login } = useInternetIdentity();

  return (
    <div>
      {/* Animated hero background styles */}
      <style>{`
        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.12); }
          66% { transform: translate(-30px, 50px) scale(0.92); }
        }
        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-80px, 60px) scale(1.18); }
          75% { transform: translate(50px, -30px) scale(0.88); }
        }
        @keyframes orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(40px, 70px) scale(1.08); }
          70% { transform: translate(-60px, -50px) scale(1.15); }
        }
        @keyframes orb-drift-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -60px) scale(1.2); }
        }
        @keyframes shimmer-slide {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .orb-1 {
          animation: orb-drift-1 18s ease-in-out infinite;
        }
        .orb-2 {
          animation: orb-drift-2 22s ease-in-out infinite;
        }
        .orb-3 {
          animation: orb-drift-3 16s ease-in-out infinite;
        }
        .orb-4 {
          animation: orb-drift-4 20s ease-in-out infinite;
        }
        .cta-shimmer {
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.08) 50%,
            transparent 70%
          );
          background-size: 200% 100%;
          animation: shimmer-slide 4s linear infinite;
        }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Orange orb */}
          <div
            className="orb-1 absolute -top-24 left-1/4 w-[500px] h-[500px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, oklch(0.62 0.22 38 / 0.9) 0%, oklch(0.55 0.25 30 / 0.3) 60%, transparent 80%)",
              filter: "blur(60px)",
            }}
          />
          {/* Violet orb */}
          <div
            className="orb-2 absolute top-1/3 -right-20 w-[480px] h-[480px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, oklch(0.55 0.19 290 / 0.9) 0%, oklch(0.4 0.22 280 / 0.3) 60%, transparent 80%)",
              filter: "blur(70px)",
            }}
          />
          {/* Cyan orb */}
          <div
            className="orb-3 absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.18 200 / 0.9) 0%, oklch(0.6 0.2 210 / 0.3) 60%, transparent 80%)",
              filter: "blur(65px)",
            }}
          />
          {/* Rose accent orb */}
          <div
            className="orb-4 absolute top-10 right-1/3 w-[320px] h-[320px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, oklch(0.65 0.22 15 / 0.9) 0%, oklch(0.55 0.2 20 / 0.2) 60%, transparent 80%)",
              filter: "blur(50px)",
            }}
          />

          {/* Dot-grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Diagonal mesh lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
              <Zap className="h-3.5 w-3.5" />
              Transform Your Fitness Journey
            </div>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
              Level Up Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">
                Fitness Today
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Explore hundreds of expert-led workout videos across every
              category — from HIIT and Strength to Yoga and Recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => navigate({ name: "videos" })}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
                data-ocid="hero.primary_button"
              >
                Browse Videos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={login}
                className="border-white/30 text-white hover:bg-white/10 text-base px-8"
                data-ocid="hero.secondary_button"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg">
            {[
              { icon: Users, value: "500+", label: "Active Members" },
              { icon: Trophy, value: "24", label: "Categories" },
              { icon: Clock, value: "100+", label: "Videos" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-2xl">{value}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            Explore by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find the perfect workout style for your goals
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.name}
              onClick={() => navigate({ name: "videos" })}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-card"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <span className="font-medium text-sm text-foreground">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "oklch(0.62 0.22 38)" }}
      >
        {/* Shimmer overlay */}
        <div className="cta-shimmer absolute inset-0 pointer-events-none" />
        {/* Background orbs */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, white 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-15 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.9 0.1 60) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-white">
            Start Your Transformation Today
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of members achieving their fitness goals with
            expert-led workout videos.
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ name: "videos" })}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-10 text-base"
            data-ocid="cta.primary_button"
          >
            Browse Videos
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-display font-bold text-white text-xl">
              ⚡ urtrainer
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
