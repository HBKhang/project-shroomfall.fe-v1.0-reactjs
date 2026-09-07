/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { Role } from "../../../enum/identity-domain/role";

export interface UserDTO {
  iD: string;
  role: Role;
  name: string;
  dob: Date;
  gender: string;
  email: string;
  passwordHash: string;
  steamID: string;
  refreshToken: string;
  refreshTokenExpiry: Date;
  createdAt: Date;
  lastLogin: Date;
}
