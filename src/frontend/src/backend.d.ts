import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface TrialInfo {
    startTime: Ms;
    duration: Ms;
}
export type Ms = bigint;
export interface MembershipPlan {
    startTime: Ms;
    endTime: Ms;
    planType: PlanType;
}
export interface UserAccessStatus {
    canAccess: boolean;
    hasActiveTrial: boolean;
    hasActiveMembership: boolean;
}
export interface UserProfile {
    name: string;
}
export enum PlanType {
    annual = "annual",
    monthly = "monthly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateMembership(user: UserId, planType: PlanType): Promise<MembershipPlan>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllMemberships(): Promise<Array<[UserId, MembershipPlan]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTrialInfo(): Promise<TrialInfo | null>;
    getUserAccessStatus(): Promise<UserAccessStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startTrial(): Promise<TrialInfo>;
}
