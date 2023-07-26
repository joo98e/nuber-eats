import { SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "@modules/users/entities/user.entity";

export type AllowedRoles = keyof typeof UserRoleEnum | "Any";

export const ROLES_METADATA_KEY = "roles" as const;
export default function Roles(roles: AllowedRoles[]) {
  return SetMetadata(ROLES_METADATA_KEY, roles);
}
