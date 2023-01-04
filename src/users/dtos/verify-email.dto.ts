import { CoreOutput } from "@modules/common/dtos/coreOutput";
import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Verification } from "@modules/users/entities/verification.entity";

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ["code"]) {}
