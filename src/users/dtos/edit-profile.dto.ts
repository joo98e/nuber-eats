import { CoreOutput } from "@modules/common/dtos/coreOutput";
import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { User } from "@modules/users/entities/user.entity";

@InputType()
export class EditProfileInput extends PartialType(PickType(User, ["email", "password"])) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
