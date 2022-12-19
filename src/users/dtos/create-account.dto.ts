import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";
import { DefaultResponse } from "@modules/common/dtos/default.response";

@InputType()
export class CreateAccountInputDto extends PickType(User, ["email", "password", "role"]) {}

@ObjectType()
export class CreateAccountOutputDto extends DefaultResponse {}
