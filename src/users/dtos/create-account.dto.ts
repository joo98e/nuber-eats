import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "@modules/users/entities/users.entity";
import { DefaultOutputDto } from "@modules/common/dtos/default-output.dto";

@InputType()
export class CreateAccountInputDto extends PickType(User, ["email", "password", "role"]) {}

@ObjectType()
export class CreateAccountOutputDto extends DefaultOutputDto {}
