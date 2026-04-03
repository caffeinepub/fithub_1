import { Button } from "@/components/ui/button";
import { Clock, Crown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import { useMembership } from "../hooks/useMembership";

interface Props {
  navigate: (p: Page) => void;
}

function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return "0:00";
  const totalSeconds = Math.floor(msRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TrialBanner({ navigate }: Props) {
  const { hasActiveTrial, hasActiveMembership, trialExpiresAt, isLoading } =
    useMembership();
  const [now, setNow] = useState(() => Date.now());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Reset dismissed when trial ends so the "upgrade" message shows
  useEffect(() => {
    if (!hasActiveTrial) {
      setDismissed(false);
    }
  });

  if (isLoading || hasActiveMembership || dismissed) return null;

  const msRemaining = trialExpiresAt ? trialExpiresAt - now : 0;
  const trialExpired =
    !hasActiveTrial && trialExpiresAt !== null && msRemaining <= 0;
  const trialActive = hasActiveTrial && msRemaining > 0;

  if (!trialActive && !trialExpired) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -48, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        data-ocid="trial.panel"
        className={`sticky top-0 z-40 w-full ${
          trialActive
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
            : "bg-gradient-to-r from-slate-700 to-slate-800"
        } text-white shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {trialActive ? (
              <Clock className="h-4 w-4 flex-shrink-0 animate-pulse" />
            ) : (
              <Crown className="h-4 w-4 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold truncate">
              {trialActive ? (
                <>
                  Free trial:{" "}
                  <span
                    data-ocid="trial.loading_state"
                    className="font-mono font-bold"
                  >
                    {formatCountdown(msRemaining)}
                  </span>{" "}
                  remaining
                </>
              ) : (
                "Your free trial has ended \u2014 upgrade to continue watching"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {trialExpired && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate({ name: "membership" })}
                data-ocid="trial.primary_button"
                className="bg-white text-slate-900 hover:bg-white/90 font-semibold text-xs h-7 px-3"
              >
                Upgrade Now
              </Button>
            )}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              data-ocid="trial.close_button"
              aria-label="Dismiss banner"
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
