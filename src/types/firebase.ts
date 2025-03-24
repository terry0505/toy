import { Timestamp } from "firebase/firestore";

export type SocialProvider = "google" | "github" | "facebook";
export type AuthType = "login" | "signup" | "";

export interface IUser {
  createdAt: string;
  id: string;
  email: string;
  displayName?: string | null;
  lastLogin?: string | null;
}
export interface IPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Timestamp;
}
