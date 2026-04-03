import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Clock,
  Crown,
  LogIn,
  PlayCircle,
  Zap,
} from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMembership } from "../hooks/useMembership";

interface Props {
  navigate: (p: Page) => void;
}

function MembershipStatusCard({
  navigate,
}: {
  navigate: (p: Page) => void;
}) {
  const { hasActiveMembership, hasActiveTrial, trialExpiresAt, isLoading } =
    useMembership();

  if (isLoading) {
    return (
      <div data-ocid="dashboard.membership.loading_state" className="mb-8">
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  const msRemaining = trialExpiresAt ? trialExpiresAt - Date.now() : 0;
  const trialMinutesLeft = Math.max(0, Math.ceil(msRemaining / 60_000));

  if (hasActiveMembership) {
    return (
      <div
        data-ocid="dashboard.membership.card"
        className="mb-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Crown className="h-6 w-6 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-bold text-foreground text-base">
              Active Membership
            </span>
            <Badge className="bg-amber-500 text-white text-xs">Premium</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Enjoy unlimited access to all workout videos.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate({ name: "videos" })}
          data-ocid="dashboard.membership.primary_button"
        >
          Browse Videos
        </Button>
      </div>
    );
  }

  if (hasActiveTrial && msRemaining > 0) {
    return (
      <div
        data-ocid="dashboard.trial.card"
        className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-bold text-foreground text-base">
              Free Trial Active
            </span>
            <Badge className="bg-primary text-primary-foreground text-xs">
              {trialMinutesLeft} min{trialMinutesLeft !== 1 ? "s" : ""} left
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Your 15-minute free trial is running. Upgrade to keep watching.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate({ name: "membership" })}
          data-ocid="dashboard.trial.primary_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
        >
          Upgrade
        </Button>
      </div>
    );
  }

  // No access
  return (
    <div
      data-ocid="dashboard.noaccess.card"
      className="mb-8 bg-muted/50 border border-border rounded-2xl p-5 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-display font-bold text-foreground text-base block mb-1">
          No Active Access
        </span>
        <p className="text-sm text-muted-foreground">
          Your free trial has ended. Upgrade to continue watching.
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => navigate({ name: "membership" })}
        data-ocid="dashboard.noaccess.primary_button"
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
      >
        <Zap className="h-3.5 w-3.5 mr-1" />
        Upgrade
      </Button>
    </div>
  );
}

export default function DashboardPage({ navigate }: Props) {
  const { identity, login } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() ?? "";

  if (!identity) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-card rounded-2xl border border-border p-12">
          <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-foreground mb-3">
            Sign In to View Your Dashboard
          </h2>
          <p className="text-muted-foreground mb-6">
            Track your fitness activity and access your personal profile.
          </p>
          <Button
            onClick={login}
            data-ocid="dashboard.signin.primary_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sign In with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">
          My Dashboard
        </h1>
        <p className="text-muted-foreground text-sm font-mono">
          {userId.slice(0, 20)}...
        </p>
      </div>

      {/* Membership status */}
      <MembershipStatusCard navigate={navigate} />

      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <PlayCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">
          Explore Workout Videos
        </h2>
        <p className="text-muted-foreground mb-6">
          Browse 100+ expert-led videos across 24 categories.
        </p>
        <Button
          onClick={() => navigate({ name: "videos" })}
          data-ocid="dashboard.videos.primary_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Browse Videos
        </Button>
      </div>
    </div>
  );
}
