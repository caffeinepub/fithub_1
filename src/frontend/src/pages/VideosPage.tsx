import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Lock, Play, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMembership } from "../hooks/useMembership";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Video {
  id: string;
  title: string;
  description: string;
  group: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  youtubeId: string;
}

interface CategoryGroup {
  name: string;
  icon: string;
  color: string;
  categories: { name: string; icon: string }[];
}

// ─── Category Groups ──────────────────────────────────────────────────────────

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: "All",
    icon: "🎬",
    color: "from-slate-500 to-slate-700",
    categories: [],
  },
  {
    name: "Muscle Groups",
    icon: "💪",
    color: "from-orange-500 to-red-600",
    categories: [
      { name: "Chest", icon: "🏋️" },
      { name: "Back", icon: "🔙" },
      { name: "Shoulders", icon: "🤷" },
      { name: "Biceps", icon: "💪" },
      { name: "Triceps", icon: "🦾" },
      { name: "Abs/Core", icon: "⬡" },
      { name: "Legs", icon: "🦵" },
      { name: "Glutes", icon: "🍑" },
      { name: "Calves", icon: "🏃" },
      { name: "Full Body", icon: "🧍" },
    ],
  },
  {
    name: "Training Style",
    icon: "⚡",
    color: "from-amber-500 to-orange-600",
    categories: [
      { name: "HIIT", icon: "⚡" },
      { name: "Strength", icon: "🏋️" },
      { name: "Cardio", icon: "🏃" },
      { name: "Calisthenics", icon: "🤸" },
      { name: "CrossFit", icon: "🔥" },
      { name: "Boxing/MMA", icon: "🥊" },
      { name: "Dance Fitness", icon: "💃" },
      { name: "Barre", icon: "🩰" },
      { name: "Cycling/Spin", icon: "🚴" },
      { name: "Running", icon: "👟" },
    ],
  },
  {
    name: "Mind & Body",
    icon: "🧘",
    color: "from-violet-500 to-indigo-600",
    categories: [
      { name: "Yoga", icon: "🧘" },
      { name: "Pilates", icon: "🤸" },
      { name: "Meditation", icon: "🌿" },
      { name: "Breathwork", icon: "🌬️" },
      { name: "Stretching", icon: "🙆" },
      { name: "Mobility", icon: "🔄" },
    ],
  },
  {
    name: "Recovery",
    icon: "🛌",
    color: "from-teal-500 to-cyan-600",
    categories: [
      { name: "Warm-Up/Cool-Down", icon: "🌅" },
      { name: "Foam Rolling", icon: "🧻" },
      { name: "Sleep & Rest", icon: "😴" },
      { name: "Beginner Workouts", icon: "🌱" },
    ],
  },
];

// ─── Category Gradients ────────────────────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<string, string> = {
  // Muscle Groups
  Chest: "from-orange-400 to-red-500",
  Back: "from-blue-500 to-indigo-600",
  Shoulders: "from-amber-400 to-orange-500",
  Biceps: "from-red-400 to-rose-600",
  Triceps: "from-pink-400 to-fuchsia-600",
  "Abs/Core": "from-yellow-400 to-amber-600",
  Legs: "from-green-500 to-emerald-600",
  Glutes: "from-rose-400 to-pink-600",
  Calves: "from-lime-500 to-green-600",
  "Full Body": "from-purple-500 to-violet-700",
  // Training Style
  HIIT: "from-red-500 to-orange-600",
  Strength: "from-zinc-600 to-slate-700",
  Cardio: "from-cyan-400 to-blue-500",
  Calisthenics: "from-emerald-500 to-teal-600",
  CrossFit: "from-orange-500 to-red-700",
  "Boxing/MMA": "from-slate-600 to-red-700",
  "Dance Fitness": "from-fuchsia-400 to-purple-500",
  Barre: "from-pink-300 to-rose-400",
  "Cycling/Spin": "from-sky-400 to-blue-600",
  Running: "from-lime-400 to-green-500",
  // Mind & Body
  Yoga: "from-violet-400 to-indigo-500",
  Pilates: "from-pink-400 to-rose-500",
  Meditation: "from-teal-400 to-emerald-500",
  Breathwork: "from-sky-300 to-cyan-500",
  Stretching: "from-indigo-400 to-purple-500",
  Mobility: "from-blue-400 to-cyan-600",
  // Recovery
  "Warm-Up/Cool-Down": "from-amber-300 to-yellow-500",
  "Foam Rolling": "from-slate-400 to-slate-600",
  "Sleep & Rest": "from-indigo-600 to-purple-800",
  "Beginner Workouts": "from-green-400 to-teal-500",
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

// ─── Video Data ────────────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  // ── MUSCLE GROUPS ── Chest ────────────────────────────────
  {
    id: "mg-chest-1",
    title: "Science-Based Chest Workout",
    description:
      "Jeff Nippard's evidence-based chest training for maximum muscle growth.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "16 min",
    level: "Intermediate",
    youtubeId: "gRVjAtPip0Y",
  },
  {
    id: "mg-chest-2",
    title: "Perfect Chest Workout (Sets & Reps)",
    description:
      "Athlean-X complete chest training with optimal exercise selection.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "cbB6cKPoFqk",
  },
  {
    id: "mg-chest-3",
    title: "Beginner Chest Workout at Home",
    description:
      "No equipment chest workout perfect for beginners starting their fitness journey.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "IODxDxX7oi4",
  },
  // ── MUSCLE GROUPS ── Back ─────────────────────────────────
  {
    id: "mg-back-1",
    title: "Complete Back Workout for Width & Thickness",
    description:
      "Build a wide, powerful back with rows, pulldowns, and deadlifts.",
    group: "Muscle Groups",
    category: "Back",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "CljAHo9l4uQ",
  },
  {
    id: "mg-back-2",
    title: "Pull Day Workout - Back & Biceps",
    description: "Comprehensive pull session for back and bicep hypertrophy.",
    group: "Muscle Groups",
    category: "Back",
    duration: "45 min",
    level: "Advanced",
    youtubeId: "dU2x1DGGUcY",
  },
  {
    id: "mg-back-3",
    title: "How To Lat Pulldown Correctly",
    description: "Perfect your lat pulldown form to sculpt a V-tapered back.",
    group: "Muscle Groups",
    category: "Back",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "eGo4IYlbE5g",
  },
  // ── MUSCLE GROUPS ── Shoulders ────────────────────────────
  {
    id: "mg-shoulders-1",
    title: "Best Shoulder Workout for All 3 Heads",
    description: "Target all three deltoid heads for round, capped shoulders.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "qEwKCR5JCog",
  },
  {
    id: "mg-shoulders-2",
    title: "Overhead Press - The Science",
    description: "Build serious shoulder strength with the overhead press.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "2yjwXTZQDDI",
  },
  {
    id: "mg-shoulders-3",
    title: "Perfect Lateral Raise Technique",
    description:
      "Add width and definition with perfect lateral raise technique.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "XPPfnSEATJA",
  },
  // ── MUSCLE GROUPS ── Biceps ───────────────────────────────
  {
    id: "mg-biceps-1",
    title: "Best Bicep Curl Variations",
    description:
      "6 curl variations to hit every part of your biceps for maximum growth.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "ykJmrZ5v0Oo",
  },
  {
    id: "mg-biceps-2",
    title: "Bicep Workout for Mass & Size",
    description: "High-volume bicep training for maximum muscle growth.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "kwG2ipFRgfo",
  },
  {
    id: "mg-biceps-3",
    title: "Hammer Curls for Bicep Peaks",
    description: "Build bicep peaks and forearm thickness with hammer curls.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "TwD-YGVP4Bk",
  },
  // ── MUSCLE GROUPS ── Triceps ──────────────────────────────
  {
    id: "mg-triceps-1",
    title: "Best Tricep Exercises for Size",
    description: "Blast all three tricep heads for bigger, more defined arms.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "25 min",
    level: "Intermediate",
    youtubeId: "skD7KfFD17c",
  },
  {
    id: "mg-triceps-2",
    title: "Dip Progressions for Beginners to Advanced",
    description: "Master dips — the king of tricep exercises — step by step.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "0326dy_-CzM",
  },
  {
    id: "mg-triceps-3",
    title: "Skull Crushers & Tricep Extensions",
    description:
      "Isolate the triceps with skull crushers and EZ bar extensions.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "ir5PsbniVSc",
  },
  // ── MUSCLE GROUPS ── Abs/Core ─────────────────────────────
  {
    id: "mg-abs-1",
    title: "10-Minute Ab Workout (No Equipment)",
    description:
      "10-minute core circuit targeting upper abs, lower abs, and obliques.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "AnYl6Mv5pl0",
  },
  {
    id: "mg-abs-2",
    title: "Six Pack Abs Science-Based Routine",
    description: "Science-backed ab routine to build visible six-pack abs.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "DHD1-2P-Csg",
  },
  {
    id: "mg-abs-3",
    title: "Plank Variations for Core Strength",
    description: "Master the plank and its variations for a rock-solid core.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "kp1ePfSHl1U",
  },
  // ── MUSCLE GROUPS ── Legs ─────────────────────────────────
  {
    id: "mg-legs-1",
    title: "Ultimate Leg Day Workout",
    description:
      "Quads, hamstrings, and calves — complete lower body training.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "45 min",
    level: "Advanced",
    youtubeId: "U4s4mEQ5VOU",
  },
  {
    id: "mg-legs-2",
    title: "How to Squat Correctly",
    description:
      "Fix your squat technique for maximum gains and injury prevention.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "ultWZbUMPL8",
  },
  {
    id: "mg-legs-3",
    title: "Leg Press & Isolation Work",
    description: "Target quads and hamstrings with leg press and machine work.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "lLXwFP0M9jE",
  },
  // ── MUSCLE GROUPS ── Glutes ───────────────────────────────
  {
    id: "mg-glutes-1",
    title: "Glute Workout for Growth & Shape",
    description: "Evidence-based glute training for shape and strength.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "wPH5VQPUXBU",
  },
  {
    id: "mg-glutes-2",
    title: "Hip Thrust - Complete Tutorial",
    description:
      "Build powerful glutes with progressive hip thrust variations.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "xDmFkJxPzeM",
  },
  {
    id: "mg-glutes-3",
    title: "Glute Bridge for Beginners",
    description:
      "From basic bridge to single-leg variations for glute activation.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "hDGCa35KFjI",
  },
  // ── MUSCLE GROUPS ── Calves ───────────────────────────────
  {
    id: "mg-calves-1",
    title: "How to Do Calf Raises Correctly",
    description:
      "Standing and seated calf raises for full lower leg development.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "p-pMSCRRdco",
  },
  {
    id: "mg-calves-2",
    title: "Calf Workout for Stubborn Calves",
    description: "High-rep calf protocol to build stubborn lower leg muscle.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "Ev20B0j51Yk",
  },
  {
    id: "mg-calves-3",
    title: "Calf Raise Variations for Development",
    description:
      "Maximize calf recruitment with tempo and range-of-motion focus.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "MkYL1gYEnvo",
  },
  // ── MUSCLE GROUPS ── Full Body ────────────────────────────
  {
    id: "mg-fullbody-1",
    title: "45-Minute Full Body Workout",
    description: "Hit every muscle group in one efficient total-body workout.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "45 min",
    level: "Intermediate",
    youtubeId: "oAPCPjnU1wA",
  },
  {
    id: "mg-fullbody-2",
    title: "Full Body Strength Training",
    description: "Progressive full-body workout for strength and conditioning.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "50 min",
    level: "Advanced",
    youtubeId: "UBMk30rjy0o",
  },
  {
    id: "mg-fullbody-3",
    title: "Functional Full Body Training",
    description: "Movement-pattern-based training for athletic performance.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "40 min",
    level: "Intermediate",
    youtubeId: "sTANio_2E0Q",
  },
  // ── TRAINING STYLE ── HIIT ────────────────────────────────
  {
    id: "ts-hiit-1",
    title: "20-Minute Full Body HIIT",
    description:
      "Torch calories with high-intensity intervals — no equipment needed.",
    group: "Training Style",
    category: "HIIT",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "ml6cT4AZdqI",
  },
  {
    id: "ts-hiit-2",
    title: "Beginner HIIT Workout",
    description: "Low-impact HIIT intervals — perfect for fitness newcomers.",
    group: "Training Style",
    category: "HIIT",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "TkaYafQ-XC4",
  },
  {
    id: "ts-hiit-3",
    title: "Advanced HIIT Challenge",
    description: "Push your limits with this brutal full-body HIIT circuit.",
    group: "Training Style",
    category: "HIIT",
    duration: "35 min",
    level: "Advanced",
    youtubeId: "M0uO8X3_tEA",
  },
  // ── TRAINING STYLE ── Strength ────────────────────────────
  {
    id: "ts-strength-1",
    title: "Upper Body Strength Workout",
    description: "Build strong arms, chest, and back with compound movements.",
    group: "Training Style",
    category: "Strength",
    duration: "40 min",
    level: "Intermediate",
    youtubeId: "IODxDxX7oi4",
  },
  {
    id: "ts-strength-2",
    title: "Lower Body Power Training",
    description: "Squats, deadlifts, and lunges for powerful legs and glutes.",
    group: "Training Style",
    category: "Strength",
    duration: "45 min",
    level: "Intermediate",
    youtubeId: "RjexvOAsVtI",
  },
  {
    id: "ts-strength-3",
    title: "Full Body Strength Program",
    description:
      "Progressive overload compound training for total muscle growth.",
    group: "Training Style",
    category: "Strength",
    duration: "55 min",
    level: "Advanced",
    youtubeId: "UBMk30rjy0o",
  },
  // ── TRAINING STYLE ── Cardio ──────────────────────────────
  {
    id: "ts-cardio-1",
    title: "Dance Cardio Workout",
    description: "Fun, high-energy dance cardio to get your heart pumping.",
    group: "Training Style",
    category: "Cardio",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "AZQ0MAtR5t0",
  },
  {
    id: "ts-cardio-2",
    title: "Indoor Cardio Blast",
    description: "No equipment cardio circuit for maximum calorie burn.",
    group: "Training Style",
    category: "Cardio",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "gC_L9qAHVJ8",
  },
  {
    id: "ts-cardio-3",
    title: "Step Aerobics Workout",
    description:
      "Classic step aerobics for sustained cardio endurance training.",
    group: "Training Style",
    category: "Cardio",
    duration: "40 min",
    level: "Intermediate",
    youtubeId: "it0kKnJBXws",
  },
  // ── TRAINING STYLE ── Calisthenics ────────────────────────
  {
    id: "ts-calisthenics-1",
    title: "Calisthenics for Beginners",
    description:
      "Start your bodyweight journey with fundamental movement patterns.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "dvmDlnMFTQc",
  },
  {
    id: "ts-calisthenics-2",
    title: "Bodyweight Strength Flow",
    description: "Build real functional strength with zero equipment needed.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "Uqfg2z1sIMU",
  },
  {
    id: "ts-calisthenics-3",
    title: "Advanced Calisthenics Workout",
    description: "Muscle-ups, planche progressions, and advanced bar work.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "45 min",
    level: "Advanced",
    youtubeId: "T_k0bqBJY_o",
  },
  // ── TRAINING STYLE ── CrossFit ────────────────────────────
  {
    id: "ts-crossfit-1",
    title: "CrossFit WOD Workout",
    description:
      "A high-intensity workout of the day combining strength and conditioning.",
    group: "Training Style",
    category: "CrossFit",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "Rb44JqXxknE",
  },
  {
    id: "ts-crossfit-2",
    title: "CrossFit AMRAP Challenge",
    description:
      "As many rounds as possible — test your fitness with this WOD.",
    group: "Training Style",
    category: "CrossFit",
    duration: "20 min",
    level: "Advanced",
    youtubeId: "Wv6GnxnmFJw",
  },
  {
    id: "ts-crossfit-3",
    title: "CrossFit for Beginners",
    description: "Introduction to CrossFit movements, scaling, and workouts.",
    group: "Training Style",
    category: "CrossFit",
    duration: "35 min",
    level: "Beginner",
    youtubeId: "zXLDiChpFlw",
  },
  // ── TRAINING STYLE ── Boxing/MMA ──────────────────────────
  {
    id: "ts-boxing-1",
    title: "Boxing Cardio Workout",
    description:
      "Jabs, crosses, hooks, and combos for a full-body cardio session.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "qCqfYwVsoQg",
  },
  {
    id: "ts-boxing-2",
    title: "Shadow Boxing Technique",
    description: "Work on footwork, combinations, and head movement solo.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "25 min",
    level: "Intermediate",
    youtubeId: "ek3MJElBpTI",
  },
  {
    id: "ts-boxing-3",
    title: "MMA Conditioning Circuit",
    description:
      "Fight-camp-style conditioning for explosive power and endurance.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "40 min",
    level: "Advanced",
    youtubeId: "MtrdOOiKBug",
  },
  // ── TRAINING STYLE ── Dance Fitness ───────────────────────
  {
    id: "ts-dance-1",
    title: "Dance Cardio Party",
    description: "High-energy dance moves set to upbeat music for maximum fun.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "AZQ0MAtR5t0",
  },
  {
    id: "ts-dance-2",
    title: "Zumba Dance Fitness",
    description: "Latin-inspired dance fitness for a full-body cardio blast.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "40 min",
    level: "Beginner",
    youtubeId: "LS-MCsNQgJY",
  },
  {
    id: "ts-dance-3",
    title: "Full Dance Workout Routine",
    description: "Choreographed dance sequences for fitness and coordination.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "ZONgqxrHpXM",
  },
  // ── TRAINING STYLE ── Barre ───────────────────────────────
  {
    id: "ts-barre-1",
    title: "Barre Beginner Class",
    description:
      "Ballet-inspired toning with tiny pulses for beginner-level grace.",
    group: "Training Style",
    category: "Barre",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "Pz6P4CzgFhg",
  },
  {
    id: "ts-barre-2",
    title: "Barre Legs & Seat",
    description:
      "Focus on thighs, glutes, and core with classical barre movements.",
    group: "Training Style",
    category: "Barre",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "Xt0lWqsIAUE",
  },
  {
    id: "ts-barre-3",
    title: "Barre Arms & Abs",
    description: "Sculpt lean arms and flat abs with isometric barre training.",
    group: "Training Style",
    category: "Barre",
    duration: "25 min",
    level: "Intermediate",
    youtubeId: "NHkRTJdT3lc",
  },
  // ── TRAINING STYLE ── Cycling/Spin ────────────────────────
  {
    id: "ts-cycling-1",
    title: "Spin Class Indoor Ride",
    description: "Energetic spin workout with intervals, climbs, and sprints.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "45 min",
    level: "Intermediate",
    youtubeId: "kdbI6shJf_Y",
  },
  {
    id: "ts-cycling-2",
    title: "Cycling Interval Training",
    description: "Structured intervals to boost VO2 max and cycling power.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "2-M4jPCz5Ek",
  },
  {
    id: "ts-cycling-3",
    title: "Bike HIIT Session",
    description:
      "High-intensity bike intervals for maximum caloric expenditure.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "25 min",
    level: "Advanced",
    youtubeId: "LnVBD8_TXRQ",
  },
  // ── TRAINING STYLE ── Running ─────────────────────────────
  {
    id: "ts-running-1",
    title: "Running Form & Technique",
    description:
      "Run faster, farther, and injury-free with proper running mechanics.",
    group: "Training Style",
    category: "Running",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "6v-a_aUISeo",
  },
  {
    id: "ts-running-2",
    title: "Run Faster: Speed Tips",
    description:
      "Science-backed tips and drills to significantly improve your pace.",
    group: "Training Style",
    category: "Running",
    duration: "25 min",
    level: "Intermediate",
    youtubeId: "jkRR92J3mYE",
  },
  {
    id: "ts-running-3",
    title: "5K Training Plan",
    description:
      "8-week plan walkthrough to get you to your first 5K finish line.",
    group: "Training Style",
    category: "Running",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "qBBr4JbqKFs",
  },
  // ── MIND & BODY ── Yoga ───────────────────────────────────
  {
    id: "mb-yoga-1",
    title: "Morning Yoga Flow",
    description:
      "Gentle 20-minute morning sequence to energize your whole day.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "v7AYKMP6rOE",
  },
  {
    id: "mb-yoga-2",
    title: "Full Body Yoga Stretch",
    description: "Deep stretching session targeting every major muscle group.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "oBu-pQG6sTY",
  },
  {
    id: "mb-yoga-3",
    title: "Power Vinyasa Yoga",
    description: "Dynamic flow to build strength, balance, and flexibility.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "45 min",
    level: "Advanced",
    youtubeId: "b1H3xO3x_Js",
  },
  // ── MIND & BODY ── Pilates ────────────────────────────────
  {
    id: "mb-pilates-1",
    title: "Mat Pilates for Beginners",
    description: "Learn Pilates fundamentals with this gentle intro class.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "k6SGKR_WkV0",
  },
  {
    id: "mb-pilates-2",
    title: "Core Pilates Flow",
    description:
      "Strengthen your core and improve posture with controlled movement.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "g_tea8ZNk5A",
  },
  {
    id: "mb-pilates-3",
    title: "Advanced Pilates Total Body",
    description:
      "Challenge your stability and strength with advanced Pilates exercises.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "45 min",
    level: "Advanced",
    youtubeId: "hN9_aDFMVQQ",
  },
  // ── MIND & BODY ── Meditation ─────────────────────────────
  {
    id: "mb-meditation-1",
    title: "5-Minute Breathing Reset",
    description:
      "Quick breathwork session to calm your mind anywhere, anytime.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "5 min",
    level: "Beginner",
    youtubeId: "inpok4MKVLM",
  },
  {
    id: "mb-meditation-2",
    title: "Guided Body Scan Meditation",
    description: "Progressive relaxation from head to toe for deep rest.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "T0nuKzNKLg8",
  },
  {
    id: "mb-meditation-3",
    title: "Mindfulness Meditation",
    description:
      "Build present-moment focus and inner calm with guided mindfulness.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "ZToicYcHIOU",
  },
  // ── MIND & BODY ── Breathwork ─────────────────────────────
  {
    id: "mb-breathwork-1",
    title: "Wim Hof Breathing Method",
    description:
      "The legendary cold-exposure breathing technique for energy and immunity.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "tybOi4hjZFQ",
  },
  {
    id: "mb-breathwork-2",
    title: "Pranayama Breathing Practice",
    description:
      "Ancient yogic breathwork for energy, calm, and mental clarity.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "aNXKjGFUlMs",
  },
  {
    id: "mb-breathwork-3",
    title: "Breath Meditation & Relaxation",
    description: "Use focused breathwork to enter a deep meditative state.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "acUZdGd_3Gk",
  },
  // ── MIND & BODY ── Stretching ─────────────────────────────
  {
    id: "mb-stretching-1",
    title: "Full Body Flexibility Routine",
    description:
      "Improve flexibility from head to toe with this comprehensive stretch.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "L_xrDAtykMI",
  },
  {
    id: "mb-stretching-2",
    title: "Morning Full Body Stretch",
    description:
      "Start every day right with this rejuvenating morning stretch sequence.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "sPbSuaqkxJ4",
  },
  {
    id: "mb-stretching-3",
    title: "Flexibility Transformation Routine",
    description:
      "Progressive flexibility training to achieve splits and deep ranges.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "40 min",
    level: "Advanced",
    youtubeId: "iN-FyyNpFhc",
  },
  // ── MIND & BODY ── Mobility ───────────────────────────────
  {
    id: "mb-mobility-1",
    title: "Hip Mobility Unlock",
    description: "Open tight hips and improve movement quality for athletes.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "NXa0hmtBHBw",
  },
  {
    id: "mb-mobility-2",
    title: "Full Body Mobility Routine",
    description:
      "Joint-by-joint mobility work for pain-free movement and performance.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "hAmD6exj6Ao",
  },
  {
    id: "mb-mobility-3",
    title: "Joint Mobility Flow",
    description:
      "Circling through every joint to restore range of motion and health.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "AqOlHxvGq-w",
  },
  // ── RECOVERY ── Warm-Up/Cool-Down ─────────────────────────
  {
    id: "rec-warmup-1",
    title: "Dynamic Warm-Up Routine",
    description:
      "Activate muscles and prep joints for any workout with this warm-up.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "HDkMDnMsHAc",
  },
  {
    id: "rec-cooldown-1",
    title: "Post-Workout Cool Down",
    description:
      "Lower heart rate and prevent soreness with this essential cool-down.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "Fm_KGMWHsng",
  },
  {
    id: "rec-warmup-2",
    title: "Pre-Workout Dynamic Activation",
    description: "Full-body dynamic warm-up to prime your CNS before lifting.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "1vx8iUvfyCY",
  },
  // ── RECOVERY ── Foam Rolling ──────────────────────────────
  {
    id: "rec-foam-1",
    title: "Full Body Foam Rolling",
    description:
      "Myofascial release routine covering every major muscle group.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "m1tKMGGqhgg",
  },
  {
    id: "rec-foam-2",
    title: "Foam Roller Back Relief",
    description: "Target the thoracic spine and erectors for back pain relief.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "nAhIx5zN-DY",
  },
  {
    id: "rec-foam-3",
    title: "IT Band & Leg Foam Roll",
    description:
      "Release tight IT bands, quads, and hamstrings for runners and cyclists.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "bqJqI3TsBvA",
  },
  // ── RECOVERY ── Sleep & Rest ──────────────────────────────
  {
    id: "rec-sleep-1",
    title: "Bedtime Yoga for Sleep",
    description:
      "Gentle yin yoga sequence to relax your body and prepare for sleep.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "sTY6bqLoiEo",
  },
  {
    id: "rec-sleep-2",
    title: "Bedtime Stretch Routine",
    description:
      "Wind down your nervous system with this pre-sleep stretching flow.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "WFPpazAvOwE",
  },
  {
    id: "rec-sleep-3",
    title: "Wind Down & Rest Practice",
    description: "A restorative evening practice for deep, quality sleep.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "kAzTjV2WQGI",
  },
  // ── RECOVERY ── Beginner Workouts ─────────────────────────
  {
    id: "rec-beginner-1",
    title: "Beginner Full Body Workout",
    description:
      "Start your fitness journey with this approachable, fun routine.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "oAPCPjnU1wA",
  },
  {
    id: "rec-beginner-2",
    title: "Beginner Chest & Upper Body",
    description:
      "Perfect introduction to upper body training — no gym required.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "cbB6cKPoFqk",
  },
  {
    id: "rec-beginner-3",
    title: "Beginner Strength Foundations",
    description:
      "Learn the fundamental lifts safely before adding serious weight.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "IODxDxX7oi4",
  },

  // ── MUSCLE GROUPS ── Chest (additions) ───────────────────
  {
    id: "mg-chest-4",
    title: "Push-Up Variations for Chest",
    description:
      "Master every push-up variation to build a full, thick chest without equipment.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "Dkbl0KPGPJY",
  },
  {
    id: "mg-chest-5",
    title: "Chest Fly Variations for Width",
    description:
      "Cable and dumbbell fly variations to stretch and build the chest.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "VlBbSEivWOA",
  },
  {
    id: "mg-chest-6",
    title: "Incline Bench Press Tutorial",
    description:
      "Perfect incline bench technique to target the upper chest for a complete look.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "WzMrSfOxSlk",
  },
  {
    id: "mg-chest-7",
    title: "Chest Day Science — Athlean-X",
    description:
      "Science-based chest day covering exercises, sets, and rep ranges for hypertrophy.",
    group: "Muscle Groups",
    category: "Chest",
    duration: "18 min",
    level: "Advanced",
    youtubeId: "l9goHpPaYN0",
  },
  // ── MUSCLE GROUPS ── Back (additions) ────────────────────
  {
    id: "mg-back-4",
    title: "Pull-Up Progression Guide",
    description:
      "Go from zero to ten pull-ups with this step-by-step beginner progression.",
    group: "Muscle Groups",
    category: "Back",
    duration: "14 min",
    level: "Beginner",
    youtubeId: "vT5GjXkNdrg",
  },
  {
    id: "mg-back-5",
    title: "Bent Over Row Masterclass",
    description:
      "Fix your bent-over row form for maximum lat and mid-back engagement.",
    group: "Muscle Groups",
    category: "Back",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "iNoHJTHVH7E",
  },
  {
    id: "mg-back-6",
    title: "Full Back Day Training",
    description:
      "Comprehensive back day covering rows, pulldowns, and deadlifts for thickness.",
    group: "Muscle Groups",
    category: "Back",
    duration: "45 min",
    level: "Intermediate",
    youtubeId: "yZmx_Ac3880",
  },
  {
    id: "mg-back-7",
    title: "Deadlift Tutorial for Beginners",
    description:
      "Learn the deadlift safely and build a massive back and posterior chain.",
    group: "Muscle Groups",
    category: "Back",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "HcDNElaWH7w",
  },
  // ── MUSCLE GROUPS ── Shoulders (additions) ───────────────
  {
    id: "mg-shoulders-4",
    title: "Shoulder Press Tutorial",
    description:
      "Overhead press mechanics and cues for building big, strong shoulders.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "11 min",
    level: "Beginner",
    youtubeId: "gXPFmEPJEg0",
  },
  {
    id: "mg-shoulders-5",
    title: "Shoulder Workout Without Equipment",
    description:
      "Build well-rounded delts with bodyweight and band shoulder exercises.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "VcGBJvBXmEI",
  },
  {
    id: "mg-shoulders-6",
    title: "Face Pulls for Shoulder Health",
    description:
      "The best rear delt and rotator cuff exercise for healthy, pain-free shoulders.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "hrT5rCx4KSA",
  },
  {
    id: "mg-shoulders-7",
    title: "Military Press — Perfect Form",
    description:
      "Master the strict military press for maximum shoulder strength and size.",
    group: "Muscle Groups",
    category: "Shoulders",
    duration: "14 min",
    level: "Advanced",
    youtubeId: "EP2g4WLXP04",
  },
  // ── MUSCLE GROUPS ── Biceps (additions) ──────────────────
  {
    id: "mg-biceps-4",
    title: "Spider Curls for Bicep Peak",
    description:
      "Spider curls isolate the bicep peak for that impressive arm shape.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "B_SLOQJZM_I",
  },
  {
    id: "mg-biceps-5",
    title: "Cable Bicep Workout",
    description:
      "Use cable machines for constant tension bicep training and superior pumps.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "soxrZlIl35U",
  },
  {
    id: "mg-biceps-6",
    title: "Incline Dumbbell Curls",
    description:
      "Stretch the long head of the bicep with incline curls for maximum growth.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "nLVSAVVXjIc",
  },
  {
    id: "mg-biceps-7",
    title: "Preacher Curl Technique",
    description:
      "Lock in your preacher curl form to eliminate cheating and maximize bicep tension.",
    group: "Muscle Groups",
    category: "Biceps",
    duration: "9 min",
    level: "Beginner",
    youtubeId: "w_KiXfXSWyo",
  },
  // ── MUSCLE GROUPS ── Triceps (additions) ─────────────────
  {
    id: "mg-triceps-4",
    title: "Overhead Tricep Extension",
    description:
      "Fully stretch the long head of the tricep with overhead extensions.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "kiuVA0gs3EI",
  },
  {
    id: "mg-triceps-5",
    title: "Cable Tricep Pushdown",
    description:
      "Perfect cable pushdown form for constant tricep tension and definition.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "AOPjFfaJQ-Q",
  },
  {
    id: "mg-triceps-6",
    title: "Close Grip Bench Press",
    description:
      "Build tricep mass and chest width with the close-grip bench press.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "eGo4IYlbE5g",
  },
  {
    id: "mg-triceps-7",
    title: "Tricep Dip Tutorial",
    description:
      "Master dips for overall tricep development and upper body strength.",
    group: "Muscle Groups",
    category: "Triceps",
    duration: "11 min",
    level: "Intermediate",
    youtubeId: "6SS6K3lAwZ8",
  },
  // ── MUSCLE GROUPS ── Abs/Core (additions) ────────────────
  {
    id: "mg-abs-4",
    title: "Plank Hold Challenge",
    description:
      "Core-shaking plank progressions to build iron-clad stability.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "wqzrb67Mf3Q",
  },
  {
    id: "mg-abs-5",
    title: "Hanging Leg Raises",
    description:
      "Lower ab isolation with hanging leg raises — the ultimate core builder.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "tSMbWLJJmFg",
  },
  {
    id: "mg-abs-6",
    title: "Oblique Core Workout",
    description:
      "Carve your obliques and side abs with targeted rotational movements.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "UUyVzFbfgZI",
  },
  {
    id: "mg-abs-7",
    title: "Cable Crunch How-To",
    description:
      "Add resistance to your core training with proper cable crunch technique.",
    group: "Muscle Groups",
    category: "Abs/Core",
    duration: "8 min",
    level: "Intermediate",
    youtubeId: "jDwoBqPH0jk",
  },
  // ── MUSCLE GROUPS ── Legs (additions) ────────────────────
  {
    id: "mg-legs-4",
    title: "Romanian Deadlift Technique",
    description: "Hinge properly with the RDL to build hamstrings and glutes.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "Dy28eq2PjcM",
  },
  {
    id: "mg-legs-5",
    title: "Bulgarian Split Squat Masterclass",
    description:
      "The most effective single-leg exercise for quad and glute development.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "6vS-PDBCVGE",
  },
  {
    id: "mg-legs-6",
    title: "Front Squat Tutorial",
    description:
      "Build quad dominance and improve posture with the front squat.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "13 min",
    level: "Advanced",
    youtubeId: "1A93sqNQJoY",
  },
  {
    id: "mg-legs-7",
    title: "Hack Squat Variations",
    description:
      "Hit the quads from multiple angles with hack squat machine variations.",
    group: "Muscle Groups",
    category: "Legs",
    duration: "18 min",
    level: "Intermediate",
    youtubeId: "YMujLuBu2kE",
  },
  // ── MUSCLE GROUPS ── Glutes (additions) ──────────────────
  {
    id: "mg-glutes-4",
    title: "Booty Workout — Pamela Reif",
    description:
      "Popular glute-burning routine for shape and tone from Pamela Reif.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "2taPeAtMoEI",
  },
  {
    id: "mg-glutes-5",
    title: "Single Leg Deadlift for Glutes",
    description: "Balance and posterior chain challenge with single-leg RDL.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "LM8XfHCCCXc",
  },
  {
    id: "mg-glutes-6",
    title: "Cable Glute Kickback",
    description:
      "Sculpt and isolate the glutes with cable kickback variations.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "YnfO-z4QL9s",
  },
  {
    id: "mg-glutes-7",
    title: "Glute Activation Exercises",
    description:
      "Wake up lazy glutes with targeted activation drills before training.",
    group: "Muscle Groups",
    category: "Glutes",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "Mm6JjOzOeCE",
  },
  // ── MUSCLE GROUPS ── Calves (additions) ──────────────────
  {
    id: "mg-calves-4",
    title: "Donkey Calf Raises",
    description: "Old-school donkey calf raises for serious lower leg mass.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "10 min",
    level: "Intermediate",
    youtubeId: "gwLzBv3aScI",
  },
  {
    id: "mg-calves-5",
    title: "Seated Calf Raise Form Guide",
    description: "Target the soleus with perfect seated calf raise technique.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "5WMGZ_OdEJo",
  },
  {
    id: "mg-calves-6",
    title: "Jump Rope for Calves",
    description:
      "Build explosive calves and cardiovascular fitness with jump rope training.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "aKqgjBfH7x4",
  },
  {
    id: "mg-calves-7",
    title: "Tibialis Anterior Training",
    description:
      "Train the often-neglected tibialis anterior for complete lower leg balance.",
    group: "Muscle Groups",
    category: "Calves",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "x0PG4DGxLCM",
  },
  // ── MUSCLE GROUPS ── Full Body (additions) ───────────────
  {
    id: "mg-fullbody-4",
    title: "Dumbbell Full Body Workout",
    description: "Complete full-body training with just a pair of dumbbells.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "40 min",
    level: "Intermediate",
    youtubeId: "Mvo2snJGhtM",
  },
  {
    id: "mg-fullbody-5",
    title: "Resistance Band Full Body",
    description: "Train every muscle group anywhere with resistance bands.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "35 min",
    level: "Beginner",
    youtubeId: "cbKkB3POqaY",
  },
  {
    id: "mg-fullbody-6",
    title: "Total Body Conditioning",
    description:
      "High-rep conditioning circuit hitting every muscle for endurance and tone.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "DHD1-2P-Csg",
  },
  {
    id: "mg-fullbody-7",
    title: "60-Min Full Body Strength",
    description:
      "Long-format strength session targeting all major muscle groups.",
    group: "Muscle Groups",
    category: "Full Body",
    duration: "60 min",
    level: "Advanced",
    youtubeId: "jxbIbHY7x2E",
  },
  // ── TRAINING STYLE ── HIIT (additions) ───────────────────
  {
    id: "ts-hiit-4",
    title: "4-Minute Tabata Workout",
    description:
      "Maximum effort Tabata intervals — short, savage, and effective.",
    group: "Training Style",
    category: "HIIT",
    duration: "4 min",
    level: "Advanced",
    youtubeId: "vc1E5CfRfos",
  },
  {
    id: "ts-hiit-5",
    title: "Jump Training HIIT",
    description:
      "Plyometric jump training to boost power and spike your heart rate.",
    group: "Training Style",
    category: "HIIT",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "CkFzgR3H_5I",
  },
  {
    id: "ts-hiit-6",
    title: "No Equipment HIIT Cardio",
    description:
      "High-intensity cardio with zero equipment — burn fat anywhere.",
    group: "Training Style",
    category: "HIIT",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "LxQLMO9WJrY",
  },
  {
    id: "ts-hiit-7",
    title: "Burpee Variations Challenge",
    description:
      "Destroy calories with burpee variations that torch the whole body.",
    group: "Training Style",
    category: "HIIT",
    duration: "15 min",
    level: "Advanced",
    youtubeId: "K-CrELwqPvQ",
  },
  // ── TRAINING STYLE ── Strength (additions) ───────────────
  {
    id: "ts-strength-4",
    title: "Powerlifting for Beginners",
    description:
      "Start your powerlifting journey with squat, bench, and deadlift fundamentals.",
    group: "Training Style",
    category: "Strength",
    duration: "35 min",
    level: "Beginner",
    youtubeId: "8eSxNFnSJWo",
  },
  {
    id: "ts-strength-5",
    title: "Push Pull Legs Program",
    description:
      "The complete guide to structuring your training with the PPL split.",
    group: "Training Style",
    category: "Strength",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "Vcwe8XqUFQE",
  },
  {
    id: "ts-strength-6",
    title: "5x5 Strength Training",
    description: "The classic 5×5 program for building raw strength fast.",
    group: "Training Style",
    category: "Strength",
    duration: "50 min",
    level: "Intermediate",
    youtubeId: "zxHqZKyG3qE",
  },
  {
    id: "ts-strength-7",
    title: "Strength Training for Women",
    description:
      "Debunk myths and build real strength with this women-focused program.",
    group: "Training Style",
    category: "Strength",
    duration: "40 min",
    level: "Beginner",
    youtubeId: "rT7DgCr-3pg",
  },
  // ── TRAINING STYLE ── Cardio (additions) ─────────────────
  {
    id: "ts-cardio-4",
    title: "30-Min Cardio at Home",
    description: "Effective no-equipment cardio workout to boost heart health.",
    group: "Training Style",
    category: "Cardio",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "BQhLBiaBXJo",
  },
  {
    id: "ts-cardio-5",
    title: "Kickboxing Cardio Workout",
    description:
      "High-energy kickboxing cardio to burn fat and build coordination.",
    group: "Training Style",
    category: "Cardio",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "UItWltVZgDQ",
  },
  {
    id: "ts-cardio-6",
    title: "Jump Rope Cardio Workout",
    description: "Jump rope intervals for elite cardiovascular fitness.",
    group: "Training Style",
    category: "Cardio",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "qr6L-6oiwDc",
  },
  {
    id: "ts-cardio-7",
    title: "March in Place Cardio",
    description:
      "Low-impact cardio you can do anywhere — perfect for all fitness levels.",
    group: "Training Style",
    category: "Cardio",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "3p8EBPVZ2Iw",
  },
  // ── TRAINING STYLE ── Calisthenics (additions) ───────────
  {
    id: "ts-calisthenics-4",
    title: "0 to 10 Pull-Ups Progression",
    description:
      "Systematic pull-up progression from absolute beginner to 10 reps.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "trHBMGlbGCw",
  },
  {
    id: "ts-calisthenics-5",
    title: "Muscle-Up Tutorial",
    description:
      "Step-by-step muscle-up breakdown for intermediate calisthenics athletes.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "15 min",
    level: "Advanced",
    youtubeId: "qmgELWG4QXI",
  },
  {
    id: "ts-calisthenics-6",
    title: "Handstand Tutorial",
    description:
      "Learn the freestanding handstand with this progressive wall drill system.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "18 min",
    level: "Advanced",
    youtubeId: "Aec2s39-mFk",
  },
  {
    id: "ts-calisthenics-7",
    title: "L-Sit Progression",
    description:
      "Build core and compression strength with the L-sit step-by-step.",
    group: "Training Style",
    category: "Calisthenics",
    duration: "12 min",
    level: "Intermediate",
    youtubeId: "Y9BSE0Z_p0k",
  },
  // ── TRAINING STYLE ── CrossFit (additions) ────────────────
  {
    id: "ts-crossfit-4",
    title: "Wall Ball Shots Tutorial",
    description:
      "Master wall ball shots for full-body conditioning and CrossFit scoring.",
    group: "Training Style",
    category: "CrossFit",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "MkfX9-xAyZY",
  },
  {
    id: "ts-crossfit-5",
    title: "Box Jump Tutorial",
    description:
      "Safe box jump technique for explosive power and CrossFit performance.",
    group: "Training Style",
    category: "CrossFit",
    duration: "8 min",
    level: "Intermediate",
    youtubeId: "ztbqpMGiaps",
  },
  {
    id: "ts-crossfit-6",
    title: "Power Clean — Olympic Lift",
    description:
      "Learn the power clean for explosive CrossFit and athletic performance.",
    group: "Training Style",
    category: "CrossFit",
    duration: "15 min",
    level: "Advanced",
    youtubeId: "Bth_DpI-qOI",
  },
  {
    id: "ts-crossfit-7",
    title: "CrossFit Open Prep",
    description:
      "Get ready for the CrossFit Open with targeted workout preparation.",
    group: "Training Style",
    category: "CrossFit",
    duration: "30 min",
    level: "Advanced",
    youtubeId: "mMW2gPYKfE8",
  },
  // ── TRAINING STYLE ── Boxing/MMA (additions) ──────────────
  {
    id: "ts-boxing-4",
    title: "Boxing Combinations Drill",
    description:
      "Sharpen your striking with essential 1-2-3-4 combination drills.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "yl9rHyL7T9U",
  },
  {
    id: "ts-boxing-5",
    title: "Kickboxing Workout",
    description:
      "Combine punches and kicks in a calorie-crushing kickboxing session.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "d_4Wb3NKkiY",
  },
  {
    id: "ts-boxing-6",
    title: "Muay Thai Basics",
    description: "Learn fundamental Muay Thai strikes, clinch, and footwork.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "1FUr8fFiQS0",
  },
  {
    id: "ts-boxing-7",
    title: "Heavy Bag Workout",
    description:
      "Release aggression and build power with a full heavy bag session.",
    group: "Training Style",
    category: "Boxing/MMA",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "c7CbRRlKkxQ",
  },
  // ── TRAINING STYLE ── Dance Fitness (additions) ──────────
  {
    id: "ts-dance-4",
    title: "Hip Hop Dance Workout",
    description:
      "Street-style hip hop choreography turned into a serious calorie burn.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "o_AcxnlLkCQ",
  },
  {
    id: "ts-dance-5",
    title: "Belly Dance Fitness",
    description:
      "Core-activating belly dance routine for a fun, exotic workout.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "VDsKcIQjRW8",
  },
  {
    id: "ts-dance-6",
    title: "Salsa Cardio Workout",
    description:
      "Salsa-inspired cardio dance to build coordination and burn calories.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "1Uul6Rj8ULk",
  },
  {
    id: "ts-dance-7",
    title: "TikTok Dance Workout",
    description:
      "Trending TikTok dances compiled into a fun and sweaty workout.",
    group: "Training Style",
    category: "Dance Fitness",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "CLef5IaJXgk",
  },
  // ── TRAINING STYLE ── Barre (additions) ──────────────────
  {
    id: "ts-barre-4",
    title: "Barre Full Body Sculpt",
    description: "Total-body barre class for lean muscle and graceful posture.",
    group: "Training Style",
    category: "Barre",
    duration: "45 min",
    level: "Intermediate",
    youtubeId: "H1j9LPTmDPY",
  },
  {
    id: "ts-barre-5",
    title: "Barre Core Workout",
    description: "Isometric barre moves to carve a strong, stable core.",
    group: "Training Style",
    category: "Barre",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "9wJqkzLYiHo",
  },
  {
    id: "ts-barre-6",
    title: "Barre Cardio Dance",
    description:
      "Combine barre toning with cardio bursts for maximum calorie burn.",
    group: "Training Style",
    category: "Barre",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "GJbSFSg6Jqo",
  },
  {
    id: "ts-barre-7",
    title: "Beginner Barre Basics",
    description:
      "Your first barre class — proper technique and foundational movements.",
    group: "Training Style",
    category: "Barre",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "MUnOqgTSVBo",
  },
  // ── TRAINING STYLE ── Cycling/Spin (additions) ───────────
  {
    id: "ts-cycling-4",
    title: "Peloton-Style Ride",
    description:
      "High-energy indoor cycling class with motivating music and coaching.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "45 min",
    level: "Intermediate",
    youtubeId: "X9GlhQ-XyDM",
  },
  {
    id: "ts-cycling-5",
    title: "Beginner Spin Class",
    description:
      "Your first spin class — set up your bike and ride at your own pace.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "LNnHHBTLLqc",
  },
  {
    id: "ts-cycling-6",
    title: "Cadence Intervals Cycling",
    description:
      "Improve pedaling efficiency with structured cadence interval training.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "sXe7K1QHSOI",
  },
  {
    id: "ts-cycling-7",
    title: "Hill Climb Bike Workout",
    description:
      "Simulate climbing with resistance intervals that build power and endurance.",
    group: "Training Style",
    category: "Cycling/Spin",
    duration: "40 min",
    level: "Advanced",
    youtubeId: "rklLf4t6zq4",
  },
  // ── TRAINING STYLE ── Running (additions) ────────────────
  {
    id: "ts-running-4",
    title: "Beginner Running Plan",
    description:
      "Walk-to-run beginner plan to get you running non-stop in weeks.",
    group: "Training Style",
    category: "Running",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "D4jzSGiRbXc",
  },
  {
    id: "ts-running-5",
    title: "Race Pace Training",
    description:
      "Dial in your race pace with tempo runs and structured speed work.",
    group: "Training Style",
    category: "Running",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "zGiCRfRbMnk",
  },
  {
    id: "ts-running-6",
    title: "Running Cadence Drills",
    description:
      "Increase your stride rate and running economy with cadence drills.",
    group: "Training Style",
    category: "Running",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "sLRPt6MShFQ",
  },
  {
    id: "ts-running-7",
    title: "10K Training Guide",
    description:
      "Structured 10K training plan from beginner to confident finisher.",
    group: "Training Style",
    category: "Running",
    duration: "25 min",
    level: "Intermediate",
    youtubeId: "N2TfDBPbH1M",
  },
  // ── MIND & BODY ── Yoga (additions) ──────────────────────
  {
    id: "mb-yoga-4",
    title: "Sun Salutation Flow",
    description:
      "A complete sun salutation sequence to energize body and mind.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "sTANio_2E0Q",
  },
  {
    id: "mb-yoga-5",
    title: "Yin Yoga Full Body",
    description:
      "Deeply passive stretches held for minutes to target connective tissue.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "60 min",
    level: "Beginner",
    youtubeId: "fONR7HzbPhU",
  },
  {
    id: "mb-yoga-6",
    title: "Yoga for Back Pain",
    description:
      "Targeted yoga poses to relieve and prevent chronic back pain.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "iSaLKECdBiU",
  },
  {
    id: "mb-yoga-7",
    title: "Ashtanga Primary Series",
    description:
      "Traditional Ashtanga yoga primary series for strength and flexibility.",
    group: "Mind & Body",
    category: "Yoga",
    duration: "60 min",
    level: "Advanced",
    youtubeId: "lODDzIXCUSA",
  },
  // ── MIND & BODY ── Pilates (additions) ───────────────────
  {
    id: "mb-pilates-4",
    title: "Reformer Pilates Simulation",
    description:
      "Get the reformer pilates experience using just a mat and resistance.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "40 min",
    level: "Intermediate",
    youtubeId: "qvYVRGE7dgo",
  },
  {
    id: "mb-pilates-5",
    title: "Pilates for Back Pain",
    description:
      "Gentle Pilates movements to strengthen the spine and relieve back pain.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "rCWmM0F7b38",
  },
  {
    id: "mb-pilates-6",
    title: "Pilates Legs & Glutes",
    description:
      "Sculpt the lower body with precise Pilates leg and glute work.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "gZkGHD6SaTE",
  },
  {
    id: "mb-pilates-7",
    title: "Pilates Arms & Shoulders",
    description:
      "Tone the upper body with Pilates-based arm and shoulder exercises.",
    group: "Mind & Body",
    category: "Pilates",
    duration: "25 min",
    level: "Intermediate",
    youtubeId: "CqNXuJnBxpc",
  },
  // ── MIND & BODY ── Meditation (additions) ────────────────
  {
    id: "mb-meditation-4",
    title: "Loving Kindness Meditation",
    description:
      "Cultivate compassion for yourself and others with this metta practice.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "O-6f5wCopsU",
  },
  {
    id: "mb-meditation-5",
    title: "Morning Meditation 10-Min",
    description:
      "Start your day centered and calm with this morning awareness practice.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "MIr3RsUWrdo",
  },
  {
    id: "mb-meditation-6",
    title: "Sleep Meditation for Deep Rest",
    description:
      "Drift off to deep, restorative sleep with this guided relaxation.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "1vx8iUvfyCY",
  },
  {
    id: "mb-meditation-7",
    title: "Visualization Meditation",
    description:
      "Use vivid visualization to achieve goals and build mental resilience.",
    group: "Mind & Body",
    category: "Meditation",
    duration: "20 min",
    level: "Intermediate",
    youtubeId: "Ez3GsypNDDY",
  },
  // ── MIND & BODY ── Breathwork (additions) ────────────────
  {
    id: "mb-breathwork-4",
    title: "Box Breathing Technique",
    description:
      "Navy SEAL box breathing technique for stress relief and focus.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "nzCaZQqAs9I",
  },
  {
    id: "mb-breathwork-5",
    title: "4-7-8 Breathing Method",
    description:
      "The 4-7-8 breathing technique to fall asleep faster and reduce anxiety.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "0BNejY1e9ik",
  },
  {
    id: "mb-breathwork-6",
    title: "Kapalbhati Pranayama",
    description:
      "Energizing skull-shining breath to detoxify and boost mental clarity.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "gz4G31ty-8I",
  },
  {
    id: "mb-breathwork-7",
    title: "Alternate Nostril Breathing",
    description: "Balance your nervous system with nadi shodhana pranayama.",
    group: "Mind & Body",
    category: "Breathwork",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "lEYfuOI1OJo",
  },
  // ── MIND & BODY ── Stretching (additions) ────────────────
  {
    id: "mb-stretching-4",
    title: "Hip Flexor Stretches",
    description:
      "Release tight hip flexors for better posture and reduced back pain.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "0Rc3aCJP0eg",
  },
  {
    id: "mb-stretching-5",
    title: "Hamstring Flexibility Stretches",
    description:
      "Lengthen tight hamstrings to improve movement and prevent injury.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "g6LNmQFVJhU",
  },
  {
    id: "mb-stretching-6",
    title: "Upper Body Office Stretch",
    description: "Relieve desk tension in shoulders, neck, and upper back.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "p_ETFMzAPg0",
  },
  {
    id: "mb-stretching-7",
    title: "Chest Opener Stretches",
    description:
      "Open your chest and counteract forward posture with these stretches.",
    group: "Mind & Body",
    category: "Stretching",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "dioFc8KY_Iw",
  },
  // ── MIND & BODY ── Mobility (additions) ──────────────────
  {
    id: "mb-mobility-4",
    title: "Ankle Mobility Drills",
    description:
      "Improve ankle range of motion for squatting depth and athletic agility.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "RoGzJeS3kkQ",
  },
  {
    id: "mb-mobility-5",
    title: "Thoracic Spine Mobility",
    description:
      "Unlock your upper back for better posture and pressing performance.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "15 min",
    level: "Intermediate",
    youtubeId: "mBJHaqKJ7bQ",
  },
  {
    id: "mb-mobility-6",
    title: "Shoulder Mobility Routine",
    description:
      "Restore full shoulder range of motion for pain-free pressing and pulling.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "1FU6h2PNjcU",
  },
  {
    id: "mb-mobility-7",
    title: "Wrist Mobility Exercises",
    description:
      "Protect and strengthen your wrists for push-ups, gymnastics, and lifting.",
    group: "Mind & Body",
    category: "Mobility",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "LCq1TFmpbAg",
  },
  // ── RECOVERY ── Warm-Up/Cool-Down (additions) ─────────────
  {
    id: "rec-warmup-3",
    title: "10-Min Morning Warm-Up",
    description:
      "Quick morning activation to wake up your body and prepare for the day.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "ec3BUCMr4TM",
  },
  {
    id: "rec-warmup-4",
    title: "Static Cool Down Stretches",
    description:
      "Essential post-workout stretching to reduce soreness and improve recovery.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "GZJF0HOzJQU",
  },
  {
    id: "rec-warmup-5",
    title: "Post Leg Day Cool Down",
    description: "Targeted cool-down for heavy lower body training days.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "12 min",
    level: "Beginner",
    youtubeId: "Fm_KGMWHsng",
  },
  {
    id: "rec-warmup-6",
    title: "Yoga Cool Down 15-Min",
    description: "Gentle yoga poses to decompress after any workout.",
    group: "Recovery",
    category: "Warm-Up/Cool-Down",
    duration: "15 min",
    level: "Beginner",
    youtubeId: "ywH4lx_3rn4",
  },
  // ── RECOVERY ── Foam Rolling (additions) ─────────────────
  {
    id: "rec-foam-4",
    title: "Foam Roll Upper Back",
    description:
      "Decompress the thoracic spine and upper traps with foam rolling.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "Hj8FktLqmaM",
  },
  {
    id: "rec-foam-5",
    title: "Foam Roll Hip Flexors",
    description:
      "Release tight hip flexors and TFL with targeted foam rolling.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "GG4yQhiP3MM",
  },
  {
    id: "rec-foam-6",
    title: "Foam Roll Calves",
    description:
      "Reduce lower leg tightness and improve ankle mobility with calf rolling.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "8 min",
    level: "Beginner",
    youtubeId: "EYmHOvqMwX4",
  },
  {
    id: "rec-foam-7",
    title: "Foam Roll Glutes & Piriformis",
    description:
      "Target the piriformis and glutes to relieve sciatica-like tightness.",
    group: "Recovery",
    category: "Foam Rolling",
    duration: "10 min",
    level: "Beginner",
    youtubeId: "qFziMHdHqoo",
  },
  // ── RECOVERY ── Sleep & Rest (additions) ──────────────────
  {
    id: "rec-sleep-4",
    title: "Yoga Nidra for Sleep",
    description:
      "Enter the hypnagogic state with yoga nidra for the deepest rest.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "O-6f5wCopsU",
  },
  {
    id: "rec-sleep-5",
    title: "Progressive Muscle Relaxation",
    description:
      "Release tension from head to toe with progressive muscle relaxation.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "inpok4MKVLM",
  },
  {
    id: "rec-sleep-6",
    title: "Guided Sleep Meditation",
    description:
      "A gentle guided meditation to quiet the mind and drift into sleep.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "1FU6h2PNjcU",
  },
  {
    id: "rec-sleep-7",
    title: "Restorative Yoga 30-Min",
    description:
      "Deeply supported restorative poses to heal and recharge the body.",
    group: "Recovery",
    category: "Sleep & Rest",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "U4s4mEQ5VOU",
  },
  // ── RECOVERY ── Beginner Workouts (additions) ─────────────
  {
    id: "rec-beginner-4",
    title: "Beginner Workout Week 1",
    description:
      "Your very first week of training — simple, effective, confidence-building.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "20 min",
    level: "Beginner",
    youtubeId: "AZQ0MAtR5t0",
  },
  {
    id: "rec-beginner-5",
    title: "Starting Strength for Beginners",
    description:
      "Introduction to the Starting Strength barbell program for raw novices.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "35 min",
    level: "Beginner",
    youtubeId: "TkaYafQ-XC4",
  },
  {
    id: "rec-beginner-6",
    title: "First Workout Ever",
    description:
      "Designed for those who have never worked out — safe, simple, encouraging.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "25 min",
    level: "Beginner",
    youtubeId: "ml6cT4AZdqI",
  },
  {
    id: "rec-beginner-7",
    title: "Beginner Home Gym Routine",
    description:
      "Build a solid fitness foundation with minimal home gym equipment.",
    group: "Recovery",
    category: "Beginner Workouts",
    duration: "30 min",
    level: "Beginner",
    youtubeId: "gC_L9qAHVJ8",
  },
];

// ─── Group lookup helper ────────────────────────────────────────────────────

function getGroupForCategory(categoryName: string): string {
  for (const group of CATEGORY_GROUPS) {
    if (group.categories.some((c) => c.name === categoryName)) {
      return group.name;
    }
  }
  return "All";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  navigate: (p: Page) => void;
}

export default function VideosPage({ navigate }: Props) {
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const currentGroup = CATEGORY_GROUPS.find((g) => g.name === activeGroup);

  const filtered = useMemo(() => {
    let results = VIDEOS;

    if (activeGroup !== "All") {
      results = results.filter((v) => v.group === activeGroup);
    }
    if (activeCategory !== "All") {
      results = results.filter((v) => v.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q),
      );
    }

    return results;
  }, [activeGroup, activeCategory, searchQuery]);

  const { identity, login } = useInternetIdentity();
  const { canAccess, isLoading: membershipLoading } = useMembership();

  const playingVideo = VIDEOS.find((v) => v.id === playingId);

  function handleGroupChange(groupName: string) {
    setActiveGroup(groupName);
    setActiveCategory("All");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎬</span>
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                Video Library
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              Workout Videos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                For Every Goal
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              {VIDEOS.length}+ free guided videos across{" "}
              {CATEGORY_GROUPS.reduce((sum, g) => sum + g.categories.length, 0)}{" "}
              categories — from muscle-group isolation to yoga, HIIT, recovery,
              and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* ── Not Logged In: Sign-in Prompt ── */}
      {!identity && (
        <div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
          data-ocid="videos.signin.card"
        >
          <div className="bg-card rounded-2xl border border-border p-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-3">
              Sign In to Start Your Free Trial
            </h2>
            <p className="text-muted-foreground mb-2">
              Get 15 minutes of free access to 100+ workout videos.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Then upgrade from just{" "}
              <span className="font-semibold text-primary">₹100/month</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={login}
                data-ocid="videos.signin.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                Sign In &amp; Start Free Trial
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ name: "membership" })}
                data-ocid="videos.membership.secondary_button"
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logged In: Loading ── */}
      {identity && membershipLoading && (
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          data-ocid="videos.loading_state"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* ── Logged In, No Access: Upgrade Wall ── */}
      {identity && !membershipLoading && !canAccess && (
        <div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
          data-ocid="videos.upgrade.card"
        >
          <div className="relative bg-card rounded-2xl border border-border p-12 overflow-hidden">
            {/* Blurred video grid glimpse behind */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-3 gap-2 p-4">
                {["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"].map(
                  (k) => (
                    <div key={k} className="h-20 bg-muted rounded-lg" />
                  ),
                )}
              </div>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                Your Free Trial Has Ended
              </h2>
              <p className="text-muted-foreground mb-8">
                Upgrade to continue watching 100+ expert-led workout videos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate({ name: "membership" })}
                  data-ocid="videos.upgrade.primary_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                >
                  View Membership Plans
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Starting from{" "}
                <span className="font-semibold text-primary">₹100/month</span> ·
                Cancel anytime
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Logged In, Has Access: Full Video Library ── */}
      {identity && !membershipLoading && canAccess && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Group Tabs ── */}
            <div className="flex flex-wrap gap-2 mb-6" data-ocid="videos.tab">
              {CATEGORY_GROUPS.map((group) => {
                const isActive = activeGroup === group.name;
                return (
                  <button
                    type="button"
                    key={group.name}
                    onClick={() => handleGroupChange(group.name)}
                    data-ocid={`videos.${group.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.tab`}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                        : "border-border text-muted-foreground hover:border-slate-400 hover:text-foreground bg-card"
                    }`}
                  >
                    <span className="text-base">{group.icon}</span>
                    {group.name}
                  </button>
                );
              })}
            </div>

            {/* ── Sub-category Pills + Search ── */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              {/* Sub-category pills */}
              {currentGroup && currentGroup.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("All")}
                    data-ocid="videos.all.tab"
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                      activeCategory === "All"
                        ? `bg-gradient-to-r ${currentGroup.color} text-white border-transparent shadow-sm`
                        : "border-border text-muted-foreground hover:text-foreground hover:border-slate-400"
                    }`}
                  >
                    All {activeGroup}
                  </button>
                  {currentGroup.categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      data-ocid={`videos.${cat.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.tab`}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                        activeCategory === cat.name
                          ? `bg-gradient-to-r ${currentGroup.color} text-white border-transparent shadow-sm`
                          : "border-border text-muted-foreground hover:text-foreground hover:border-slate-400"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="relative flex-shrink-0 w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search videos…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-ocid="videos.search_input"
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* ── Breadcrumb & Count ── */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
              <span
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleGroupChange("All")}
                onKeyDown={(e) => e.key === "Enter" && handleGroupChange("All")}
              >
                All Videos
              </span>
              {activeGroup !== "All" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span
                    className="cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => {
                      setActiveCategory("All");
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setActiveCategory("All")
                    }
                  >
                    {activeGroup}
                  </span>
                </>
              )}
              {activeCategory !== "All" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-foreground font-medium">
                    {activeCategory}
                  </span>
                </>
              )}
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {filtered.length} video{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* ── Video Grid ── */}
            {filtered.length === 0 ? (
              <div
                data-ocid="videos.empty_state"
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <span className="text-6xl mb-4">🎬</span>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No videos found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Try a different search term or select another category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((video, index) => {
                  const gradient =
                    CATEGORY_GRADIENTS[video.category] ||
                    "from-slate-400 to-slate-600";
                  return (
                    <article
                      key={video.id}
                      data-ocid={`videos.item.${index + 1}`}
                      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-250 group"
                    >
                      {/* Thumbnail */}
                      <button
                        type="button"
                        onClick={() => setPlayingId(video.id)}
                        data-ocid={`videos.play_button.${index + 1}`}
                        className="relative w-full h-48 overflow-hidden block"
                        aria-label={`Play ${video.title}`}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                        />
                        {/* gradient overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-25 group-hover:opacity-40 transition-opacity duration-200`}
                        />
                        {/* dark bottom fade */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                        {/* play button - YouTube style */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#CC0000] transition-all duration-200 opacity-90 group-hover:opacity-100">
                            <Play
                              className="h-5 w-5 text-white ml-0.5"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                        {/* YouTube badge */}
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3 fill-[#FF0000]"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-label="YouTube"
                          >
                            <title>YouTube</title>
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          <span className="text-white text-[9px] font-bold tracking-wide">
                            YouTube
                          </span>
                        </div>
                        {/* category group tag */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {getGroupForCategory(video.category)}
                          </span>
                        </div>
                      </button>

                      {/* Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              LEVEL_STYLES[video.level] || ""
                            }`}
                          >
                            {video.level}
                          </span>
                          <span className="text-xs text-muted-foreground border border-border px-2.5 py-0.5 rounded-full font-medium">
                            {video.category}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto font-medium">
                            ⏱ {video.duration}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-foreground leading-snug text-[0.95rem]">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Video Modal ── */}
          {playingId && playingVideo && (
            <div
              aria-modal="true"
              aria-label={playingVideo.title}
              data-ocid="videos.modal"
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setPlayingId(null)}
              onKeyDown={(e) => e.key === "Escape" && setPlayingId(null)}
            >
              <div
                className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-foreground truncate">
                      {playingVideo.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {playingVideo.category} ·{" "}
                      <span
                        className={`font-medium ${
                          playingVideo.level === "Beginner"
                            ? "text-emerald-600"
                            : playingVideo.level === "Advanced"
                              ? "text-rose-600"
                              : "text-amber-600"
                        }`}
                      >
                        {playingVideo.level}
                      </span>{" "}
                      · {playingVideo.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlayingId(null)}
                    data-ocid="videos.close_button"
                    className="ml-4 flex-shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Close video"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Embed */}
                <div className="aspect-video w-full bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0`}
                    title={playingVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Modal footer */}
                <div className="px-5 py-3 border-t border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {playingVideo.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
