import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUserKey = "user" as const;
export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(ctx).getContext();
  const user = gqlContext[AuthUserKey];
  return gqlContext[AuthUserKey];
});
