export interface Coach {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  yearsExperience: bigint;
  hourlyRate: number;
  profilePhotoUrl: string;
  rating: number;
  reviewCount: bigint;
  isAvailable: boolean;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  category: string;
  sessionType: string;
  coachId: string;
  durationMinutes: bigint;
  price: number;
  thumbnailUrl: string;
  scheduledAt: bigint;
  maxParticipants: bigint;
  enrollmentCount: bigint;
  status: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  sessionId: string;
  bookedAt: bigint;
  status: string;
  amountPaid: number;
}

export interface Review {
  id: string;
  coachId: string;
  userId: string;
  rating: bigint;
  comment: string;
  createdAt: bigint;
}

export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;
