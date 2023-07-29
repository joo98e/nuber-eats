import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";
import { AllowedRoles, ROLES_METADATA_KEY } from "@modules/auth/auth-roles.decorator";
import { User } from "@modules/users/entities/user.entity";
import { AuthUserKey } from "@modules/auth/auth-user.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles: AllowedRoles[] = this.reflector.get<AllowedRoles[]>(ROLES_METADATA_KEY, context.getHandler());

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext[AuthUserKey];

    if (!roles) return true; // any anonymous can access
    if (!user) return false; // Roles exist, but there is no role to compare with the user's role
    if (roles.includes("Any")) return true; // any user can access

    return roles.includes(user.role);
  }
}
