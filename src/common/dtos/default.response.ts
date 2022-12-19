import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DefaultResponse {
  @Field(type => Boolean)
  ok: boolean;

  @Field(type => String)
  errorMsg?: string;
}
