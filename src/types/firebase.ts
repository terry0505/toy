export type SocialProvider = "google" | "github" | "facebook";
export type AuthType = "login" | "signup" | "";

export interface UserType {
  uid: string;
  displayName: string | null;
  email: string;
  createdAt?: string;
}
