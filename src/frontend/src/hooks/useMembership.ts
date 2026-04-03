import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { UserRole } from "../backend";
import type {
  TrialInfo,
  UserAccessStatus,
} from "../declarations/backend.did.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export interface MembershipState {
  canAccess: boolean;
  hasActiveTrial: boolean;
  hasActiveMembership: boolean;
  trialInfo: TrialInfo | null;
  trialExpiresAt: number | null; // ms timestamp
  isLoading: boolean;
}

export function useMembership(): MembershipState {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorLoading } = useActor();
  const initDoneRef = useRef(false);

  // Step 1: Assign user role + start trial on first login
  const initQuery = useQuery({
    queryKey: ["membership-init", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const principal = identity.getPrincipal();
      // Assign user role (idempotent on backend)
      await actor.assignCallerUserRole(principal, UserRole.user);
      // Start trial (idempotent)
      const trial = await actor.startTrial();
      return trial;
    },
    enabled: !!actor && !!identity && !actorLoading,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 2,
  });

  // Step 2: Get access status (poll every 30s)
  const accessQuery = useQuery<UserAccessStatus>({
    queryKey: ["membership-access", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) {
        return {
          canAccess: false,
          hasActiveTrial: false,
          hasActiveMembership: false,
        };
      }
      return actor.getUserAccessStatus();
    },
    enabled: !!actor && !!identity && !actorLoading && initQuery.isSuccess,
    refetchInterval: 30_000,
    staleTime: 0,
  });

  // Step 3: Get trial info
  const trialQuery = useQuery<TrialInfo | null>({
    queryKey: ["membership-trial", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const result = await actor.getTrialInfo();
      // result is [] | [TrialInfo] in Candid
      if (Array.isArray(result)) {
        return result[0] ?? null;
      }
      return result ?? null;
    },
    enabled: !!actor && !!identity && !actorLoading && initQuery.isSuccess,
    refetchInterval: 30_000,
    staleTime: 0,
  });

  // Track init state
  useEffect(() => {
    if (identity && !initDoneRef.current) {
      initDoneRef.current = true;
    }
    if (!identity) {
      initDoneRef.current = false;
    }
  }, [identity]);

  const trialInfo = trialQuery.data ?? null;
  let trialExpiresAt: number | null = null;
  if (trialInfo) {
    // nanoseconds bigint -> milliseconds number
    const expiresNs = trialInfo.startTime + trialInfo.duration;
    trialExpiresAt = Number(expiresNs / BigInt(1_000_000));
  }

  const accessData = accessQuery.data;
  const isLoading =
    actorLoading ||
    (!!identity && (initQuery.isPending || accessQuery.isPending));

  if (!identity || !accessData) {
    return {
      canAccess: false,
      hasActiveTrial: false,
      hasActiveMembership: false,
      trialInfo,
      trialExpiresAt,
      isLoading,
    };
  }

  return {
    canAccess: accessData.canAccess,
    hasActiveTrial: accessData.hasActiveTrial,
    hasActiveMembership: accessData.hasActiveMembership,
    trialInfo,
    trialExpiresAt,
    isLoading,
  };
}
