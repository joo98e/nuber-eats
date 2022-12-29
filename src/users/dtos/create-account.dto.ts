import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";
import { CoreOutput } from "@modules/common/dtos/coreOutput";

@InputType()
export class CreateAccountInput extends PickType(User, ["email", "password", "role"]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
