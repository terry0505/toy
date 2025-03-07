export type SocialProvider = "google" | "github" | "facebook";
export type AuthType = "login" | "signup" | "";

export interface IUser {
  createdAt: string;
  id: string;
  email: string;
  displayName?: string | null;
  lastLogin?: string | null;
}
