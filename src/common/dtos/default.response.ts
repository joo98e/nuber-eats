import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DefaultResponse {
  ok: boolean;
  errorMsg?: string;
}
