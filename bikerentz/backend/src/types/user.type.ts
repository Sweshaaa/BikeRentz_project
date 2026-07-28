export type UserRole = "user" | "admin";

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
}
