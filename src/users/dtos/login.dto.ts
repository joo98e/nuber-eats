import { DefaultOutputDto } from "@modules/common/dtos/default-output.dto";
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "@modules/users/entities/users.entity";

@InputType()
export class LoginInputDto extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginOutputDto extends DefaultOutputDto {
  @Field((type) => String, { nullable: true })
  token?: string;
}
