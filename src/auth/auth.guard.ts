import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";
import { AllowedRoles } from "@modules/auth/auth-roles.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>("roles", context.getHandler());

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext["user"];

    if (!roles) return true;
    return Boolean(user);
  }
}
