import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DefaultOutputDto {
  @Field((type) => Boolean)
  ok: boolean;

  @Field((type) => String, { nullable: true })
  errorMsg?: string;
}
