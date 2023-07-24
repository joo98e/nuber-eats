import { SetMetadata } from "@nestjs/common";

export default function Roles(roles: string[]) {
  return SetMetadata("roles", roles);
}
