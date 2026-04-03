import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Lock,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMembership } from "../hooks/useMembership";

interface Props {
  navigate: (p: Page) => void;
}

const PLAN_FEATURES = [
  "Unlimited access to 100+ workout videos",
  "24 categories — Yoga, HIIT, Strength & more",
  "AI Fitness Assistant",
  "Full-screen HD playback",
  "New videos added weekly",
  "Cancel anytime",
];

const TRIAL_FEATURES = [
  "15 minutes of full video access",
  "No credit card required",
  "Explore all 24 categories",
  "Starts automatically on sign-in",
];

export default function MembershipPage({ navigate }: Props) {
  const { identity, login } = useInternetIdentity();
  const {
    canAccess,
    hasActiveMembership,
    hasActiveTrial,
    trialExpiresAt,
    isLoading,
  } = useMembership();

  function handleChoosePlan(plan: "monthly" | "annual") {
    toast.info(
      `${plan === "monthly" ? "Monthly (₹100/mo)" : "Annual (₹1,200/yr)"} plan selected`,
      {
        description:
          "Currently in beta — contact us at support@fithub.ai to activate your membership.",
        duration: 6000,
        icon: <Mail className="h-4 w-4" />,
      },
    );
  }

  const msRemaining = trialExpiresAt ? trialExpiresAt - Date.now() : 0;
  const trialMinutesLeft = Math.max(0, Math.ceil(msRemaining / 60_000));

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Beta Pricing
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-foreground mb-4 leading-tight">
              Unlock Your Full
              <br />
              <span className="text-primary">Fitness Journey</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Get unlimited access to 100+ expert-led workout videos across 24
              categories — from ₹100/month.
            </p>

            {/* Current status pill */}
            {!isLoading && identity && (
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border mb-8">
                {hasActiveMembership ? (
                  <>
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="text-foreground">Active membership</span>
                  </>
                ) : hasActiveTrial ? (
                  <>
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-foreground">
                      {trialMinutesLeft} min{trialMinutesLeft !== 1 ? "s" : ""}{" "}
                      trial remaining
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Choose a plan to get started
                    </span>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {/* Monthly Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card
              data-ocid="membership.monthly.card"
              className="relative border-2 border-border bg-card h-full flex flex-col hover:border-primary/50 transition-colors duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Monthly
                    </span>
                  </div>
                </div>
                <CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">
                      ₹100
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Flexible monthly access. Cancel anytime.
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  onClick={() =>
                    identity ? handleChoosePlan("monthly") : login()
                  }
                  data-ocid="membership.monthly.primary_button"
                >
                  {identity ? "Choose Monthly" : "Sign In to Start"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Annual Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card
              data-ocid="membership.annual.card"
              className="relative border-2 border-primary bg-card h-full flex flex-col shadow-lg shadow-primary/10"
            >
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1 text-xs shadow-md">
                  <Flame className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Annual
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Save 16%
                  </Badge>
                </div>
                <CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">
                      ₹1,200
                    </span>
                    <span className="text-muted-foreground text-sm">/year</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal mt-1">
                    ₹100/month billed annually
                  </p>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Best value for committed fitness enthusiasts.
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  onClick={() =>
                    identity ? handleChoosePlan("annual") : login()
                  }
                  data-ocid="membership.annual.primary_button"
                >
                  {identity ? "Choose Annual" : "Sign In to Start"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* ── Free Trial Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card
            data-ocid="membership.trial.card"
            className="border-dashed border-2 border-border bg-muted/30"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">
                    15-Minute Free Trial
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    New users get a 15-minute free trial automatically when they
                    sign in. No credit card needed — just sign in and start
                    watching.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TRIAL_FEATURES.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  {identity ? (
                    canAccess ? (
                      <Button
                        onClick={() => navigate({ name: "videos" })}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        data-ocid="membership.trial.primary_button"
                      >
                        Browse Videos
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => navigate({ name: "videos" })}
                        data-ocid="membership.trial.secondary_button"
                      >
                        View Library
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={login}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-ocid="membership.trial.primary_button"
                    >
                      Start Free Trial
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Beta note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Currently in beta.{" "}
          <a
            href="mailto:support@fithub.ai"
            className="text-primary hover:underline"
          >
            Contact us
          </a>{" "}
          to activate your membership. Payments will be enabled soon.
        </motion.p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6 mt-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
