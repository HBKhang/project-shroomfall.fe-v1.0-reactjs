import type { Role } from "../contracts/enum/identity-domain/role";

export interface UserSession {
  name: string;
  role: Role;
}