import { DefaultResponse } from "@modules/common/dtos/default.response";
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "@modules/users/entities/users.entity";

@InputType()
export class LoginInputDto extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginOutputDto extends DefaultResponse {
  @Field((type) => String, { nullable: true })
  token?: string;
}
