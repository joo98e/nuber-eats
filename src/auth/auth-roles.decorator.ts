import { SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "@modules/users/entities/user.entity";

export type AllowedRoles = keyof typeof UserRoleEnum | "Any";

export default function Roles(roles: AllowedRoles[]) {
  return SetMetadata("roles", roles);
}
