import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

persistent actor {
  // Types
  type UserId = Principal;
  type Ms = Int;
  type PlanType = { #monthly; #annual };
  type MembershipPlan = {
    planType : PlanType;
    startTime : Ms;
    endTime : Ms;
  };
  type TrialInfo = {
    startTime : Ms;
    duration : Ms;
  };
  type UserAccessStatus = {
    hasActiveMembership : Bool;
    hasActiveTrial : Bool;
    canAccess : Bool;
  };
  public type UserProfile = {
    name : Text;
  };

  // Membership Plans
  let plans = Map.empty<UserId, MembershipPlan>();

  // Trials
  let trials = Map.empty<UserId, TrialInfo>();

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Memberships
  public shared ({ caller }) func activateMembership(user : UserId, planType : PlanType) : async MembershipPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can activate memberships");
    };

    let startTime = Time.now();
    let duration = switch (planType) {
      case (#monthly) { 30 * 86_400_000_000_000 };
      case (#annual) { 365 * 86_400_000_000_000 };
    };
    let newPlan : MembershipPlan = {
      planType;
      startTime;
      endTime = duration + startTime;
    };
    plans.add(user, newPlan);
    newPlan;
  };

  public query ({ caller }) func getAllMemberships() : async [(UserId, MembershipPlan)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all memberships");
    };
    plans.toArray();
  };

  // Trials
  public shared ({ caller }) func startTrial() : async TrialInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start a trial");
    };
    switch (trials.get(caller)) {
      case (?existing) { existing };
      case (null) {
        let newTrial : TrialInfo = {
          startTime = Time.now();
          duration = 900_000_000_000; // 15 minutes in nanoseconds
        };
        trials.add(caller, newTrial);
        newTrial;
      };
    };
  };

  public query ({ caller }) func getTrialInfo() : async ?TrialInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get trial info");
    };
    trials.get(caller);
  };

  // Access Status
  public query ({ caller }) func getUserAccessStatus() : async UserAccessStatus {
    if (caller.isAnonymous()) {
      return {
        hasActiveMembership = false;
        hasActiveTrial = false;
        canAccess = false;
      };
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check access status");
    };

    let now = Time.now();

    let hasActiveMembership = switch (plans.get(caller)) {
      case (null) { false };
      case (?plan) { now < plan.endTime };
    };

    let hasActiveTrial = switch (trials.get(caller)) {
      case (null) { false };
      case (?trial) { now < (trial.startTime + trial.duration) };
    };

    {
      hasActiveMembership;
      hasActiveTrial;
      canAccess = hasActiveMembership or hasActiveTrial;
    };
  };
};
