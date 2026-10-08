// Mirrors the Prisma enums/models in the backend (PostgreSQL / Neon).
// IDs are UUID strings under `id` (not Mongo's `_id`).

export type UserRole = "ADMIN" | "DONOR" | "REQUESTER";

export type BloodGroup =
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG"
  | "O_POS"
  | "O_NEG";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RequestStatus = "PENDING" | "MATCHED" | "FULFILLED" | "EXPIRED" | "CANCELLED";
export type MatchStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodGroup?: BloodGroup | null;
  phone?: string | null;
  city?: string | null;
  isAvailable?: boolean;
  isVerified?: boolean;
  lastDonationAt?: string | null;
  createdAt: string;
}

// Backend returns { user, token } for register / login / google
export interface AuthResponse {
  user: User;
  token: string;
}

export interface PublicUser {
  id: string;
  name: string;
  phone?: string | null;
}

export interface DonationMatch {
  id: string;
  requestId: string;
  donorId: string;
  status: MatchStatus;
  donor?: PublicUser;
  createdAt: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requester?: PublicUser;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  city: string;
  urgency: UrgencyLevel;
  requiredBy: string;
  status: RequestStatus;
  notes?: string | null;
  matches?: DonationMatch[];
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  requestId?: string | null;
  amount: number;
  currency: string;
  purpose: "PRIORITY_LISTING" | "DONATION_CERTIFICATE" | "SERVICE_FEE";
  status: PaymentStatus;
  provider: string;
  transactionId?: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const BLOOD_GROUPS: BloodGroup[] = [
  "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG",
];

// Database stores A_POS etc.; people read A+ etc.
export const formatBloodGroup = (bg?: BloodGroup | string | null): string =>
  bg ? bg.replace("_POS", "+").replace("_NEG", "-") : "—";

export const URGENCY_LEVELS: UrgencyLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

// Values are saved in the backend's `city` column
export const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
];
